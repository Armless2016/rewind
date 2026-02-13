import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./Profile.module.css";

import { useAuth } from "../context/AuthContext";
import {
  getProfile,
  getMyFavorites,
  getMyWatched,
  updateProfile,
} from "../api/profile.api";
import { getMovieDetails } from "../api/movies.api";
import { createList, getListItems, getUserLists, updateList } from "../api/lists.api";
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
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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





function buildPager(totalPages: number, currentPage: number) {
  if (totalPages <= 1) return [0];

  const last = totalPages - 1;
  const pages: Array<number | "dots"> = [];

  const windowPages = new Set<number>([
    0,
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    last - 1,
    last,
  ]);

  const inRange = (p: number) => p >= 0 && p <= last;

  const sorted = Array.from(windowPages)
    .filter(inRange)
    .sort((a, b) => a - b);

  let prev: number | null = null;
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) pages.push("dots");
    pages.push(p);
    prev = p;
  }

  return pages;
}




export default function Profile() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  type Tab = "profile" | "films" | "watchlist" | "likes" | "lists";
  const activeTab: Tab = (() => {
    const q = new URLSearchParams(location.search).get("tab");
    if (q === "films" || q === "watchlist" || q === "likes" || q === "lists") return q;
    return "profile";
  })();

  // ✅ якщо не залогінений — на Register
  useEffect(() => {
    if (!isAuth) navigate("/register", { replace: true });
  }, [isAuth, navigate]);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  const [favorites, setFavorites] = useState<MovieCard[]>([]);
  const [watched, setWatched] = useState<MovieCard[]>([]);
  const [watchedTotal, setWatchedTotal] = useState<number>(0);

  const WATCHED_PAGE_SIZE = 24;

  const [watchedMovies, setWatchedMovies] = useState<MovieCard[]>([]);
  const [watchedLoading, setWatchedLoading] = useState(false);

  const [watchedPageIndex, setWatchedPageIndex] = useState(0);
  const [watchedTotalPages, setWatchedTotalPages] = useState(0);


  // Films tab (Watched grid)
  const FILMS_PAGE_SIZE = 24; // 6 posters x 4 rows (like макет)
  const [filmsPageIndex, setFilmsPageIndex] = useState(0);
  const [filmsWatched, setFilmsWatched] = useState<Page<MovieCard> | null>(null);
  const [filmsLoading, setFilmsLoading] = useState(false);

  const [backdropUrl, setBackdropUrl] = useState<string | null>(null);

  // Watchlist tab (Wants To See)
  const WATCHLIST_PAGE_SIZE = 24; // 6 posters x 4 rows
  const [watchlistPageIndex, setWatchlistPageIndex] = useState(0);
  const [watchlistMovies, setWatchlistMovies] = useState<MovieCard[]>([]);
  const [watchlistTotal, setWatchlistTotal] = useState(0);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistList, setWatchlistList] = useState<MyList | null>(null);

    // ===== Likes tab =====
    const LIKES_PAGE_SIZE = 24; // 6 x 4 як на скріні
    const [likesPageIndex, setLikesPageIndex] = useState(0);
    const [likesMovies, setLikesMovies] = useState<MovieCard[]>([]);
    const [likesTotal, setLikesTotal] = useState(0);
    const [likesLoading, setLikesLoading] = useState(false);
    const [likesList, setLikesList] = useState<MyList | null>(null);

  // для постерів у reviews (бо бекенд review item не має photoUrl)
  const [moviePosterById, setMoviePosterById] = useState<Record<number, string>>({});

  // edit profile modal (мінімально: displayName + avatarUrl)
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // lists preview (1 карточка як у макеті)
  const [listCard, setListCard] = useState<{ list: MyList; posters: string[]; count: number } | null>(null);
  // ===== Lists tab =====
  const [listsLoading, setListsLoading] = useState(false);
  const [listsCards, setListsCards] = useState<Array<{ list: MyList; posters: string[]; count: number }>>([]);
  const [listsReloadKey, setListsReloadKey] = useState(0);

  const [createListOpen, setCreateListOpen] = useState(false);
  const [createListName, setCreateListName] = useState("");
  const [createListDesc, setCreateListDesc] = useState("");
  const [createListPublic, setCreateListPublic] = useState(true);

  const [editListOpen, setEditListOpen] = useState(false);
  const [editListTarget, setEditListTarget] = useState<MyList | null>(null);
  const [editListName, setEditListName] = useState("");
  const [editListDesc, setEditListDesc] = useState("");
  const [editListPublic, setEditListPublic] = useState(true);

  const LIST_TAGS = ["mytop", "favorites", "rewatch", "personal", "cinema", "topfilms", "alltime", "essential"];


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

        // ✅ watched preview (4) + total для лічильника Films
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
    let alive = true;

    async function loadWatched() {
      if (activeTab !== "films") return; // або як у тебе називається tab з watched

      try {
        setWatchedLoading(true);

        const res = await getMyWatched(watchedPageIndex, WATCHED_PAGE_SIZE);
        if (!alive) return;

        const page: Page<MovieCard> = res.data;

        setWatchedMovies(page.content || []);
        setWatchedTotalPages(page.totalPages ?? 0);

        // якщо бекенд повернув інший номер (іноді так буває)
        if (typeof page.number === "number" && page.number !== watchedPageIndex) {
          setWatchedPageIndex(page.number);
        }
      } finally {
        if (alive) setWatchedLoading(false);
      }
    }

    loadWatched();
    return () => {
      alive = false;
    };
  }, [activeTab, watchedPageIndex]);


  // ✅ Films tab: Watched grid + pagination
  useEffect(() => {
    let alive = true;

    async function loadFilmsWatched() {
      if (activeTab !== "films") return;
      try {
        setFilmsLoading(true);
        const res = await getMyWatched(filmsPageIndex, FILMS_PAGE_SIZE);
        if (!alive) return;
        setFilmsWatched(res.data);
      } finally {
        if (alive) setFilmsLoading(false);
      }
    }

    loadFilmsWatched();
    return () => {
      alive = false;
    };
  }, [activeTab, filmsPageIndex]);

    useEffect(() => {
      let alive = true;

      async function loadWatchlist() {
        if (activeTab !== "watchlist") return;

        try {
          setWatchlistLoading(true);

          // 1) знайти системний list типу WATCHLIST / WANT_TO_SEE
          const listsRes = await getUserLists();
          if (!alive) return;
          const lists: MyList[] = listsRes.data || [];

          const wl =
            lists.find((l) =>
              ["WATCHLIST", "WANT_TO_SEE", "WANTS_TO_SEE"].includes(
                String(l.listType).toUpperCase()
              )
            ) || null;

          setWatchlistList(wl);

          if (!wl) {
            setWatchlistMovies([]);
            setWatchlistTotal(0);
            return;
          }

          // 2) витягнути items і зробити пагінацію на фронті
          const itemsRes = await api.get(`/lists/${wl.id}/items`);
          if (!alive) return;

          const items: ListItem[] = itemsRes.data || [];
          const movies = items.map((it) => it.movie).filter(Boolean) as MovieCard[];

          setWatchlistTotal(movies.length);

          const start = watchlistPageIndex * WATCHLIST_PAGE_SIZE;
          setWatchlistMovies(movies.slice(start, start + WATCHLIST_PAGE_SIZE));
        } finally {
          if (alive) setWatchlistLoading(false);
        }
      }

      loadWatchlist();
      return () => {
        alive = false;
      };
    }, [activeTab, watchlistPageIndex]);

      useEffect(() => {
        let alive = true;

        async function loadLikes() {
          if (activeTab !== "likes") return;

          try {
            setLikesLoading(true);

            // ✅ Likes = Favorites з бекенду
            const res = await getMyFavorites(likesPageIndex, LIKES_PAGE_SIZE);
            if (!alive) return;

            const page = res.data as Page<MovieCard>;

            setLikesMovies(page.content || []);
            setLikesTotal(page.totalElements || 0);
          } finally {
            if (alive) setLikesLoading(false);
          }
        }

        loadLikes();
        return () => {
          alive = false;
        };
      }, [activeTab, likesPageIndex]);

  useEffect(() => {
    let alive = true;

    async function loadLists() {
      if (activeTab !== "lists") return;

      try {
        setListsLoading(true);

        const listsRes = await getUserLists();
        if (!alive) return;

        const all: MyList[] = listsRes.data || [];
        const custom = all.filter((l) => String(l.listType).toUpperCase() === "CUSTOM");

        const cards = await Promise.all(
          custom.map(async (list) => {
            try {
              const itemsRes = await getListItems(list.id);
              const items: ListItem[] = itemsRes.data || [];

              const posters = items
                .map((it) => it.movie?.photoUrl)
                .filter(Boolean)
                .slice(0, 4) as string[];

              return { list, posters, count: items.length };
            } catch {
              return { list, posters: [] as string[], count: 0 };
            }
          })
        );

        if (!alive) return;
        setListsCards(cards);
      } finally {
        if (alive) setListsLoading(false);
      }
    }

    loadLists();
    return () => {
      alive = false;
    };
  }, [activeTab, listsReloadKey]);





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

  const openCreateList = () => {
    setCreateListName("");
    setCreateListDesc("");
    setCreateListPublic(true);
    setCreateListOpen(true);
  };

  const submitCreateList = async () => {
    const name = createListName.trim();
    if (!name) return;

    try {
      await createList({
        name,
        description: createListDesc.trim() ? createListDesc.trim() : undefined,
        isPublic: createListPublic,
      });
      setCreateListOpen(false);
      setListsReloadKey((k) => k + 1);
    } catch {
      // можна додати error/toast
    }
  };

  const openEditList = (list: MyList) => {
    setEditListTarget(list);
    setEditListName(list.name || "");
    setEditListDesc(list.description || "");
    setEditListPublic(Boolean(list.isPublic));
    setEditListOpen(true);
  };

  const submitEditList = async () => {
    if (!editListTarget) return;

    const name = editListName.trim();
    if (!name) return;

    try {
      await updateList(editListTarget.id, {
        name,
        description: editListDesc.trim() ? editListDesc.trim() : undefined,
        isPublic: editListPublic,
      });
      setEditListOpen(false);
      setEditListTarget(null);
      setListsReloadKey((k) => k + 1);
    } catch {
      // можна додати error/toast
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
            ? {
                backgroundImage: `
                  radial-gradient(700px 420px at 50% 25%, rgba(73, 154, 160, 0.70), transparent 60%),
                  radial-gradient(620px 420px at 82% 30%, rgba(193, 145, 70, 0.70), transparent 60%),
                  linear-gradient(180deg, rgba(0,0,0,0.20), rgba(0,0,0,0.85)),
                  url(${backdropUrl})
                `,
              }
            : undefined
        }
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <div className={styles.avatarWrap}>
            {profile?.avatarUrl ? (
              <img className={styles.avatar} src={profile.avatarUrl} alt="avatar" />
            ) : (
              <div className={styles.avatarFallback} />
            )}
          </div>

          <h1 className={styles.name}>{displayName}</h1>
          <div className={styles.username}>@{profile?.username || "username"}</div>

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
          <button
            className={`${styles.tab} ${activeTab === "profile" ? styles.tabActive : ""}`}
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button
            className={`${styles.tab} ${activeTab === "films" ? styles.tabActive : ""}`}
            onClick={() => {
              setFilmsPageIndex(0);
              navigate("/profile?tab=films");
            }}
          >
            Films
          </button>

          <button
            className={`${styles.tab} ${activeTab === "watchlist" ? styles.tabActive : ""}`}
            onClick={() => {
              setWatchlistPageIndex(0);
              navigate("/profile?tab=watchlist");
            }}
          >
            Watchlist
          </button>

          <button
            className={`${styles.tab} ${activeTab === "likes" ? styles.tabActive : ""}`}
            onClick={() => {
              setLikesPageIndex(0);
              navigate("/profile?tab=likes");
            }}
          >
            Likes
          </button>

          <button
            className={`${styles.tab} ${activeTab === "lists" ? styles.tabActive : ""}`}
            onClick={() => navigate("/profile?tab=lists")}
          >
            Lists
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <main className={styles.main}>
        <div className={styles.container}>
          {activeTab === "profile" && loading && <div className={styles.loading}>Loading…</div>}

          {activeTab === "profile" && (
            <>
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
                      <p className={styles.listDesc}>{listCard.list.description || " "}</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.empty}>No custom lists yet.</div>
                )}
              </section>

              <div className={styles.footerSpace} />
            </>
          )}

          {activeTab === "films" && (
            <>
              <div className={styles.filmsTopRow}>
                <h2 className={styles.filmsTitle}>Watched</h2>
              </div>

              <div className={styles.hr} />

              {filmsLoading ? (
                <div className={styles.loading}>Loading…</div>
              ) : (
                <>
                  <div className={styles.filmsGrid}>
                    {(filmsWatched?.content || []).map((m) => {
                      const r = (m.rating ?? ratingMap.get(m.id)?.rating ?? 0) as number;

                      return (
                        <div key={m.id} className={styles.filmsCard}>
                          {m.photoUrl ? (
                            <img className={styles.filmsPoster} src={m.photoUrl} alt={m.title} />
                          ) : (
                            <div className={styles.filmsPosterFallback}>No poster</div>
                          )}
                          <Stars value={r} />
                        </div>
                      );
                    })}
                  </div>

                  {/* ✅ pager */}
                  {(filmsWatched?.totalPages ?? 0) > 1 && (
                    <div className={styles.pagerRow}>
                      {buildPager(filmsWatched?.totalPages ?? 0, watchedPageIndex).map((p, idx) => {
                        if (p === "dots") {
                          return (
                            <span key={`dots-${idx}`} className={styles.pagerDots}>
                              …
                            </span>
                          );
                        }

                        const pageIndex = p as number;
                        const isActive = pageIndex === watchedPageIndex;

                        return (
                          <button
                            key={pageIndex}
                            type="button"
                            className={`${styles.pagerBtn} ${isActive ? styles.pagerBtnActive : ""}`}
                            onClick={() => setWatchedPageIndex(pageIndex)}
                            disabled={watchedLoading}
                          >
                            {pageIndex + 1}
                          </button>
                        );
                      })}
                    </div>
                  )}


                  <div className={styles.filmsBottomBar}>
                    <div className={styles.filmsPager}>
                      {buildPager(filmsWatched?.totalPages || 0).map((p, idx) => {
                        if (p === "dots") {
                          return (
                            <span key={`dots-${idx}`} className={styles.pagerDots}>
                              …
                            </span>
                          );
                        }
                        const pageIndex = p as number;
                        const isActive = pageIndex === filmsPageIndex;
                        return (
                          <button
                            key={pageIndex}
                            className={`${styles.pagerBtn} ${isActive ? styles.pagerBtnActive : ""}`}
                            onClick={() => setFilmsPageIndex(pageIndex)}
                          >
                            {pageIndex + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button className={styles.orderBtn} type="button">
                      Order
                    </button>
                  </div>
                </>
              )}

              <div className={styles.footerSpace} />
            </>
          )}

          {activeTab === "watchlist" && (
            <section className={styles.filmsSection}>
              {/* ✅ line above title (як в інших вкладках) */}
              <div className={styles.sectionLine} />

              <div className={styles.filmsTopRow}>
                <h2 className={styles.filmsTitle}>Wants To See</h2>
              </div>

              {watchlistLoading ? (
                <div className={styles.loading}>Loading…</div>
              ) : (
                <>
                  <div className={styles.filmsGrid}>
                    {watchlistMovies.map((m) => (
                      <div key={m.id} className={styles.filmsCard}>
                        {m.photoUrl ? (
                          <img className={styles.filmsPoster} src={m.photoUrl} alt={m.title} />
                        ) : (
                          <div className={styles.filmsPosterFallback}>No poster</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ✅ Newer — pages — Older (без Order) */}
                 <div className={styles.watchlistBottomBar}>
                   <button
                     className={styles.pillBtn}
                     type="button"
                     disabled={watchlistPageIndex === 0}
                     onClick={() => setWatchlistPageIndex((p) => Math.max(0, p - 1))}
                   >
                     Newer
                   </button>

                   <div className={styles.filmsPagerCenter}>
                     {buildPager(Math.ceil(watchlistTotal / WATCHLIST_PAGE_SIZE) || 0).map((p, idx) => {
                       if (p === "dots") return <span key={idx} className={styles.pagerDots}>…</span>;
                       const pageIndex = p as number;
                       const isActive = pageIndex === watchlistPageIndex;
                       return (
                         <button
                           key={pageIndex}
                           className={`${styles.pagerBtn} ${isActive ? styles.pagerBtnActive : ""}`}
                           onClick={() => setWatchlistPageIndex(pageIndex)}
                           type="button"
                         >
                           {pageIndex + 1}
                         </button>
                       );
                     })}
                   </div>

                   <button
                     className={styles.pillBtn}
                     type="button"
                     disabled={watchlistPageIndex >= (Math.ceil(watchlistTotal / WATCHLIST_PAGE_SIZE) || 1) - 1}
                     onClick={() =>
                       setWatchlistPageIndex((p) =>
                         Math.min((Math.ceil(watchlistTotal / WATCHLIST_PAGE_SIZE) || 1) - 1, p + 1)
                       )
                     }
                   >
                     Older
                   </button>
                 </div>

                  <div className={styles.howTo}>
                    <div className={styles.howTitle}>How To Add</div>
                    <div className={styles.howText}>
                      Add films you want to see to your watchlist from the icon on each film poster
                      or click the Watchlist icon in the actions panel on a film or review page.
                    </div>

                    <div className={styles.howBtns}>
                      <button className={styles.howBtn} type="button">
                        Make this list private
                      </button>
                      <button className={styles.howBtnGhost} type="button">
                        Clear watchlist
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}


          {activeTab === "likes" && (
            <>
              {/* LINE + TITLE like in макет */}
              <div className={styles.sectionHeaderRow}>
                <h2 className={styles.sectionHeaderTitle}>Liked</h2>
              </div>

              {likesLoading ? (
                <div className={styles.loading}>Loading…</div>
              ) : (
                <>
                  <div className={styles.filmsGrid}>
                    {likesMovies.map((m) => {
                      const r = (m.rating ?? ratingMap.get(m.id)?.rating ?? 0) as number;

                      return (
                        <div key={m.id} className={styles.filmsCard}>
                          {m.photoUrl ? (
                            <img className={styles.filmsPoster} src={m.photoUrl} alt={m.title} />
                          ) : (
                            <div className={styles.filmsPosterFallback}>No poster</div>
                          )}

                          <div className={styles.likeMetaRow}>
                            <span className={styles.likeHeart} aria-hidden>
                              ♥
                            </span>
                            <Stars value={r} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* LINE after films like in макет */}
                  <div className={styles.sectionBottomDivider} />



                  <div className={styles.likesBottomBar}>
                    <div className={styles.filmsPager}>
                      {buildPager(Math.ceil(likesTotal / LIKES_PAGE_SIZE) || 0).map((p, idx) => {
                        if (p === "dots") {
                          return (
                            <span key={`dots-${idx}`} className={styles.pagerDots}>
                              …
                            </span>
                          );
                        }
                        const pageIndex = p as number;
                        const isActive = pageIndex === likesPageIndex;
                        return (
                          <button
                            key={pageIndex}
                            className={`${styles.pagerBtn} ${isActive ? styles.pagerBtnActive : ""}`}
                            onClick={() => setLikesPageIndex(pageIndex)}
                          >
                            {pageIndex + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className={styles.footerSpace} />
            </>
          )}




          {activeTab === "lists" && (
            <section className={styles.listsSection}>
              <div className={styles.listsHeaderRow}>
                <div className={styles.listsTitle}>Your Lists</div>
              </div>

              {listsLoading ? (
                <div className={styles.placeholder}>Loading...</div>
              ) : (
                <div className={styles.listsRows}>
                  {listsCards.map(({ list, posters, count }) => (
                    <div key={list.id} className={styles.listRowCard}>
                      <div className={styles.listRowLeft}>
                        <div className={styles.listRowPosters}>
                          {[0, 1, 2, 3].map((i) => {
                            const src = posters[i];
                            return (
                              <div
                                key={i}
                                className={`${styles.posterTile} ${!src ? styles.posterTileEmpty : ""}`}
                                style={{ transform: `translateX(${i * 34}px)` }}
                              >
                                {src ? <img src={src} alt="" /> : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className={styles.listRowBody}>
                        <div className={styles.listRowTop}>
                          <div>
                            <div className={styles.listRowName}>{list.name}</div>
                            <div className={styles.listRowMeta}>{count} Films</div>
                          </div>

                          <button
                            className={styles.listRowEditBtn}
                            onClick={() => openEditList(list)}
                            aria-label="Edit list"
                            title="Edit"
                          >
                            ✎
                          </button>
                        </div>

                        <div className={styles.listRowDesc}>
                          {list.description || ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.startNewListWrap}>
                <button className={styles.startNewListBtn} onClick={openCreateList}>
                  Start a new list
                </button>
              </div>

              <div className={styles.tagsBlock}>
                <div className={styles.tagsTitle}>List tags</div>
                <div className={styles.tagsRow}>
                  {LIST_TAGS.map((t) => (
                    <span key={t} className={styles.tagChip}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />

      {/* CREATE LIST MODAL */}
      {createListOpen && (
        <div className={styles.modalBackdrop} onClick={() => setCreateListOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Start a new list</h3>

            <label className={styles.modalLabel}>Name</label>
            <input
              className={styles.modalInput}
              value={createListName}
              onChange={(e) => setCreateListName(e.target.value)}
              placeholder="List name"
            />

            <label className={styles.modalLabel}>Description</label>
            <textarea
              className={`${styles.modalInput} ${styles.modalTextarea}`}
              value={createListDesc}
              onChange={(e) => setCreateListDesc(e.target.value)}
              placeholder="Write something about this list..."
            />

            <label className={styles.modalCheckRow}>
              <input
                type="checkbox"
                checked={createListPublic}
                onChange={(e) => setCreateListPublic(e.target.checked)}
              />
              <span>Public</span>
            </label>

            <div className={styles.modalActions}>
              <button className={styles.modalBtnGhost} onClick={() => setCreateListOpen(false)}>
                Cancel
              </button>
              <button className={styles.modalBtn} onClick={submitCreateList}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LIST MODAL */}
      {editListOpen && editListTarget && (
        <div className={styles.modalBackdrop} onClick={() => setEditListOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Edit list</h3>

            <label className={styles.modalLabel}>Name</label>
            <input
              className={styles.modalInput}
              value={editListName}
              onChange={(e) => setEditListName(e.target.value)}
              placeholder="List name"
            />

            <label className={styles.modalLabel}>Description</label>
            <textarea
              className={`${styles.modalInput} ${styles.modalTextarea}`}
              value={editListDesc}
              onChange={(e) => setEditListDesc(e.target.value)}
              placeholder="Description..."
            />

            <label className={styles.modalCheckRow}>
              <input
                type="checkbox"
                checked={editListPublic}
                onChange={(e) => setEditListPublic(e.target.checked)}
              />
              <span>Public</span>
            </label>

            <div className={styles.modalActions}>
              <button
                className={styles.modalBtnGhost}
                onClick={() => {
                  setEditListOpen(false);
                  setEditListTarget(null);
                }}
              >
                Cancel
              </button>
              <button className={styles.modalBtn} onClick={submitEditList}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}


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
