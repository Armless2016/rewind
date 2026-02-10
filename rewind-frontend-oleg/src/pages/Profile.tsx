import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./Profile.module.css";

import { useAuth } from "../context/AuthContext";
import { getProfile, getMyFavorites, getMyWatched, updateProfile } from "../api/profile.api";
import { getMovieDetails } from "../api/movies.api";
import { getUserLists } from "../api/lists.api";
import api from "../api/axios";

type ProfileReviewItem = {
  movieId: number;
  movieTitle: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ProfileRatingItem = {
  movieId: number;
  movieTitle: string;
  moviePhotoUrl: string | null;
  rating: number; // 1..5
  ratedAt: string;
};

type ProfileResponse = {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  recentReviews: ProfileReviewItem[];
  recentRatings: ProfileRatingItem[];
};

type MovieCard = {
  id: number;
  title: string;
  releaseDate: string | null;
  rating: number | null;
  photoUrl: string | null;
};

type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

type MovieDetails = {
  id: number;
  title: string;
  photoUrl: string | null;
  backdropUrl: string | null;
};

type MyList = {
  id: number;
  name: string;
  description: string | null;
  listType: string; // CUSTOM / WATCHED / etc
  isPublic: boolean | null;
};

type ListItem = {
  id: number;
  position: number;
  movie: MovieCard;
};

function formatDate(iso: string) {
  // простий формат як у макеті: "18 Dec 2025"
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function Stars({ value }: { value: number }) {
  const full = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className={styles.stars} aria-label={`rating ${full}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? styles.starOn : styles.starOff}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Profile() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  // ✅ якщо не залогінений — на Register
  useEffect(() => {
    if (!isAuth) navigate("/register", { replace: true });
  }, [isAuth, navigate]);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  const [favorites, setFavorites] = useState<MovieCard[]>([]);
  const [watched, setWatched] = useState<MovieCard[]>([]);
  const [watchedTotal, setWatchedTotal] = useState<number>(0);

  const [backdropUrl, setBackdropUrl] = useState<string | null>(null);

  // для постерів у reviews (бо бекенд review item не має photoUrl)
  const [moviePosterById, setMoviePosterById] = useState<Record<number, string>>({});

  // edit profile modal (мінімально: displayName + avatarUrl)
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // lists preview (1 карточка як у макеті)
  const [listCard, setListCard] = useState<{ list: MyList; posters: string[]; count: number } | null>(null);

  const ratingMap = useMemo(() => {
    const m = new Map<number, ProfileRatingItem>();
    (profile?.recentRatings || []).forEach((r) => m.set(r.movieId, r));
    return m;
  }, [profile]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);

        const profRes = await getProfile();
        if (!alive) return;
        const prof: ProfileResponse = profRes.data;
        setProfile(prof);

        // ✅ favorites (4)
        const favRes = await getMyFavorites(0, 4);
        if (!alive) return;
        const favPage: Page<MovieCard> = favRes.data;
        setFavorites(favPage.content || []);

        // ✅ watched (4) + total для лічильника Films
        const watRes = await getMyWatched(0, 4);
        if (!alive) return;
        const watPage: Page<MovieCard> = watRes.data;
        setWatched(watPage.content || []);
        setWatchedTotal(watPage.totalElements || 0);

        // ✅ backdrop для hero (беремо 1-й favorite і тягнемо details -> backdropUrl)
        const firstFav = favPage.content?.[0];
        if (firstFav?.id) {
          try {
            const det = await getMovieDetails(firstFav.id);
            if (!alive) return;
            const details: MovieDetails = det.data;
            setBackdropUrl(details.backdropUrl || null);
          } catch {
            setBackdropUrl(null);
          }
        }

        // ✅ posters для reviews: спочатку пробуємо з recentRatings, решту — через details
        const posters: Record<number, string> = {};
        (prof.recentRatings || []).forEach((r) => {
          if (r.moviePhotoUrl) posters[r.movieId] = r.moviePhotoUrl;
        });

        const reviewMovieIds = (prof.recentReviews || []).slice(0, 2).map((x) => x.movieId);
        const missing = reviewMovieIds.filter((id) => !posters[id]);

        if (missing.length) {
          const results = await Promise.all(
            missing.map(async (id) => {
              try {
                const det = await getMovieDetails(id);
                const details: MovieDetails = det.data;
                return [id, details.photoUrl || ""] as const;
              } catch {
                return [id, ""] as const;
              }
            })
          );
          results.forEach(([id, url]) => {
            if (url) posters[id] = url;
          });
        }

        if (!alive) return;
        setMoviePosterById(posters);

        // ✅ Lists preview: беремо перший CUSTOM list і його items (перші 4 постери)
        try {
          const listsRes = await getUserLists();
          if (!alive) return;
          const lists: MyList[] = listsRes.data || [];
          const custom = lists.find((l) => String(l.listType).toUpperCase() === "CUSTOM") || null;

          if (custom) {
            const itemsRes = await api.get(`/lists/${custom.id}/items`);
            const items: ListItem[] = itemsRes.data || [];
            const postersArr = items
              .slice(0, 4)
              .map((it) => it.movie?.photoUrl)
              .filter(Boolean) as string[];

            setListCard({
              list: custom,
              posters: postersArr,
              count: items.length,
            });
          } else {
            setListCard(null);
          }
        } catch {
          setListCard(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!profile) return;
    setEditName(profile.displayName || profile.username || "");
    setEditAvatar(profile.avatarUrl || "");
  }, [profile]);

  const displayName = profile?.displayName || profile?.username || "User";

  const onSaveProfile = async () => {
    try {
      await updateProfile({
        displayName: editName.trim() || undefined,
        avatarUrl: editAvatar.trim() || undefined,
      });
      const profRes = await getProfile();
      setProfile(profRes.data);
      setEditOpen(false);
    } catch {
      // можна додати toast/error
    }
  };

  if (!isAuth) return null; // поки редірект

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section
        className={styles.hero}
        style={
          backdropUrl
            ? { backgroundImage: `url(${backdropUrl})` }
            : undefined
        }
      >
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <div className={styles.avatarWrap}>
            {profile?.avatarUrl ? (
              <img className={styles.avatar} src={profile.avatarUrl} alt="avatar" />
            ) : (
              <div className={styles.avatarFallback} aria-label="avatar">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <h1 className={styles.name}>{displayName}</h1>

          <div className={styles.countryRow}>
            <span className={styles.countryIcon}>×</span>
            <span className={styles.countryText}>USA</span>
          </div>

          <p className={styles.bio}>
            {profile?.username ? (
              <>
                Obsessed with great directing, bold storytelling, and <br />
                films that stick with you long after the credits roll.
              </>
            ) : (
              " "
            )}
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>{watchedTotal}</div>
              <div className={styles.statLabel}>Films</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Following</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Followers</div>
            </div>
          </div>

          <button className={styles.editBtn} onClick={() => setEditOpen(true)}>
            Edit Profile
          </button>
        </div>
      </section>

      {/* TABS */}
      <div className={styles.tabsBar}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>Profile</button>
          <button className={styles.tab} onClick={() => navigate("/profile?tab=films")}>Films</button>
          <button className={styles.tab} onClick={() => navigate("/profile?tab=watchlist")}>Watchlist</button>
          <button className={styles.tab} onClick={() => navigate("/profile?tab=likes")}>Likes</button>
          <button className={styles.tab} onClick={() => navigate("/profile?tab=lists")}>Lists</button>
        </div>
      </div>

      {/* CONTENT */}
      <main className={styles.main}>
        <div className={styles.container}>
          {loading && <div className={styles.loading}>Loading…</div>}

          {/* Favorite Films */}
          <section className={styles.block}>
            <div className={styles.blockHeader}>
              <h2 className={styles.h2}>Favorite Films</h2>
            </div>
            <div className={styles.posterRow}>
              {Array.from({ length: 4 }).map((_, i) => {
                const m = favorites[i];
                const r = m ? ratingMap.get(m.id) : undefined;
                return (
                  <div key={i} className={styles.posterCard}>
                    {m?.photoUrl ? (
                      <img className={styles.posterImg} src={m.photoUrl} alt={m.title} />
                    ) : (
                      <div className={styles.posterFallback}>No poster</div>
                    )}
                    {r ? <Stars value={r.rating} /> : <div className={styles.starsSpacer} />}
                  </div>
                );
              })}
            </div>
          </section>

          <div className={styles.hr} />

          {/* Recent Activity (watched) */}
          <section className={styles.block}>
            <div className={styles.blockHeader}>
              <h2 className={styles.h2}>Recent Activity</h2>
              <button className={styles.allBtn}>All</button>
            </div>

            <div className={styles.posterRow}>
              {Array.from({ length: 4 }).map((_, i) => {
                const m = watched[i];
                const r = m ? ratingMap.get(m.id) : undefined;
                return (
                  <div key={i} className={styles.posterCard}>
                    {m?.photoUrl ? (
                      <img className={styles.posterImg} src={m.photoUrl} alt={m.title} />
                    ) : (
                      <div className={styles.posterFallback}>No poster</div>
                    )}
                    {r ? <Stars value={r.rating} /> : <div className={styles.starsSpacer} />}
                  </div>
                );
              })}
            </div>
          </section>

          <div className={styles.hr} />

          {/* Recent Reviews */}
          <section className={styles.block}>
            <div className={styles.blockHeader}>
              <h2 className={styles.h2}>Recent Reviews</h2>
              <button className={styles.allBtn}>All</button>
            </div>

            <div className={styles.reviews}>
              {(profile?.recentReviews || []).slice(0, 2).map((rv, idx) => {
                const poster = moviePosterById[rv.movieId];
                const rating = ratingMap.get(rv.movieId)?.rating;
                return (
                  <article key={idx} className={styles.reviewCard}>
                    <div className={styles.reviewPoster}>
                      {poster ? (
                        <img src={poster} alt={rv.movieTitle} />
                      ) : (
                        <div className={styles.reviewPosterFallback}>No poster</div>
                      )}
                    </div>

                    <div className={styles.reviewBody}>
                      <div className={styles.reviewTitleRow}>
                        <div className={styles.reviewTitle}>
                          {rv.movieTitle}
                          {typeof rating === "number" ? (
                            <span className={styles.reviewRating}> ★ {rating.toFixed(1)}</span>
                          ) : null}
                        </div>
                        <div className={styles.reviewDate}>{formatDate(rv.updatedAt || rv.createdAt)}</div>
                      </div>

                      <p className={styles.reviewText}>{rv.content}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className={styles.hr} />

          {/* Following */}
          <section className={styles.block}>
            <div className={styles.blockHeader}>
              <h2 className={styles.h2}>Following</h2>
              <button className={styles.allBtn}>All</button>
            </div>

            <div className={styles.followingRow}>
              <div className={styles.followBubble} />
              <div className={styles.followBubble} />
              <div className={styles.followBubble} />
            </div>
          </section>

          <div className={styles.hr} />

          {/* Lists */}
          <section className={styles.block}>
            <div className={styles.blockHeader}>
              <h2 className={styles.h2}>Lists</h2>
              <button className={styles.allBtn}>All</button>
            </div>

            {listCard ? (
              <div className={styles.listCard}>
                <div className={styles.listPosters}>
                  {Array.from({ length: 4 }).map((_, i) => {
                    const url = listCard.posters[i];
                    return (
                      <div key={i} className={styles.listPosterSlot}>
                        {url ? <img src={url} alt="" /> : <div className={styles.listPosterFallback} />}
                      </div>
                    );
                  })}
                </div>

                <div className={styles.listInfo}>
                  <div className={styles.listTitle}>{listCard.list.name}</div>
                  <div className={styles.listMeta}>{listCard.count} Films</div>
                  <p className={styles.listDesc}>
                    {listCard.list.description || " "}
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.empty}>No custom lists yet.</div>
            )}
          </section>

          <div className={styles.footerSpace} />
        </div>
      </main>

      <Footer />

      {/* EDIT MODAL */}
      {editOpen && (
        <div className={styles.modalBackdrop} onClick={() => setEditOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Edit profile</h3>

            <label className={styles.modalLabel}>Display name</label>
            <input
              className={styles.modalInput}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Display name"
            />

            <label className={styles.modalLabel}>Avatar URL</label>
            <input
              className={styles.modalInput}
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              placeholder="https://..."
            />

            <div className={styles.modalActions}>
              <button className={styles.modalBtnGhost} onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button className={styles.modalBtn} onClick={onSaveProfile}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
