import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronRight, Eye, Heart, MessageSquare, Star, Calendar, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./MainPage.css";
import { useAuth } from "../context/AuthContext";
import { getMovies, type MovieCardResponse } from "../api/movies.api";

// Фолбек-постери (на випадок якщо в БД нема photoUrl)
import poster1 from "../assets/posters/FilmPoster1.jpg";
import poster2 from "../assets/posters/FilmPoster2.jpg";
import poster3 from "../assets/posters/FilmPoster3.jpg";
import poster4 from "../assets/posters/FilmPoster4.jpg";

import reviePoster1 from "../assets/ReviewPosters/RewiePoster1.png";
import reviePoster2 from "../assets/ReviewPosters/RewiePoster2.png";
import reviePoster3 from "../assets/ReviewPosters/RewiePoster3.png";
import reviePoster4 from "../assets/ReviewPosters/RewiePoster4.jpg";

import newsPoster1 from "../assets/NewsPosters/NewsPoster1.jpg";
import newsPoster2 from "../assets/NewsPosters/NewsPoster2.jpg";
import newsPoster3 from "../assets/NewsPosters/NewsPoster3.jpg";

interface SectionLayoutProps {
  title: string;
  children: ReactNode;
  hasMore?: boolean;
  onMoreClick?: () => void;
  isExpanded?: boolean;
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
}

interface ReviewCardProps {
  author: string;
  title: string;
  rating: string;
  text: string;
  moviePosterUrl?: string;
  date: string;
}

const HomePage: React.FC = () => {
  const { isAuth } = useAuth();

  const [movies, setMovies] = useState<MovieCardResponse[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoadingMovies(true);
      try {
        const res = await getMovies(0, 12);
        setMovies(res.data?.content ?? []);
      } finally {
        setLoadingMovies(false);
      }
    };

    load();
  }, []);

  const fallbackPosters = useMemo(() => [poster1, poster2, poster3, poster4], []);

  const gridMovies = useMemo(() => movies.slice(0, 6), [movies]);

  const reviewsData = useMemo(
    () => [
      {
        author: "CineMindset",
        rating: "4.5",
        title: "Superman",
        date: "10 Dec 2025",
        text:
          "This version of Superman is more human than mythic. He doubts, listens, and reacts to the consequences of his presence rather than blindly embracing the symbol he represents...",
      },
      {
        author: "MovieMoon",
        rating: "4.9",
        title: "Avatar: The Way of Water",
        date: "12 Dec 2025",
        text:
          "James Cameron is in no hurry. This guy has been working on Avatar in some shape or form since at least 1994...",
      },
      {
        author: "ReelRaven",
        rating: "4.0",
        title: "The Hunt",
        date: "10 Dec 2025",
        text:
          "Look, I KNEW what this film was about, I knew this was going to be difficult to watch...",
      },
      {
        author: "MoonlitCritic",
        rating: "4.0",
        title: "Wake Up Dead Man",
        date: "10 Dec 2025",
        text:
          "Wake Up Dead Man leans into a darker, more somber tone than previous Knives Out films...",
      },
    ],
    []
  );

  const reviePosters = useMemo(
    () => [
      { src: reviePoster1 },
      { src: reviePoster2 },
      { src: reviePoster3 },
      { src: reviePoster4 },
    ],
    []
  );

  const popularListsData = useMemo(
    () => [
      {
        title: "Classic movies for beginners",
        author: "ReefWatcher",
        authorAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        posters: [poster1, poster2, poster3, poster4],
      },
      {
        title: "Movies everyone should watch",
        author: "NeilFrane",
        authorAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
        posters: [poster4, poster3, poster2, poster1],
      },
      {
        title: "Most Fans on Rewind",
        author: "FilmFan",
        authorAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
        posters: [poster2, poster1, poster4, poster3],
      },
    ],
    []
  );

  const reviewersData = useMemo(
    () => [
      { name: "Karsten", info: "1,340 films, 1,621 reviews", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
      { name: "jamesbryant", info: "2,343 films, 1,120 reviews", avatar: "https://randomuser.me/api/portraits/men/8.jpg" },
      { name: "zoe fujii", info: "5,323 films, 2,545 reviews", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
    ],
    []
  );

  const newsData = useMemo(
    () => [
      {
        title: "Second Chances",
        description: "Katie Rife picks our January restoration, repertory and re-release highlights.",
        image: { src: newsPoster1 },
      },
      {
        title: "Funny Papers",
        description: "Park Chan-wook on how Looney Tunes influenced the cartoonish of No Other Choice.",
        image: { src: newsPoster2 },
      },
      {
        title: "Coming Home",
        description: "The independent theaters keeping The Rocky Horror Picture Show alive, 50 years on.",
        image: { src: newsPoster3 },
      },
    ],
    []
  );

  return (
    <div className="home-wrapper">
      <section className="home-hero">
        <div
          className="hero-bg"
          style={{
            backgroundImage: isAuth
              ? "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000')"
              : "url('https://image.tmdb.org/t/p/original/8uVKfOJUhmybNsVh089EqLHUYEG.jpg')",
          }}
        ></div>
        <div className="hero-overlay"></div>

        <Header />

        <div className="hero-content">
          {isAuth ? (
            <div className="hero-text-logged">
              <h1>Welcome back. Here's what we've been watching...</h1>
              <div className="hero-subtext">
                This homepage will become more personal as you <Link to="/profile">follow other members</Link> on the net.
              </div>
            </div>
          ) : (
            <div className="hero-text-guest">
              <h1>
                Track films you've watched.
                <br />
                Save those you want to see.
                <br />
                Tell your friends what's good.
              </h1>
              <Link className="btn-start" to="/register">Get started</Link>
            </div>
          )}
        </div>
      </section>

      <main className="home-main">
        <hr className="divider" />

        <SectionLayout
          title={isAuth ? "New on Rewind" : "Popular on Rewind"}
          hasMore={movies.length > 6}
          onMoreClick={() => (window.location.href = "/search")}
        >
          <div className="poster-grid-6">
            {loadingMovies && <p style={{ margin: 0, color: "#99aabb" }}>Loading movies...</p>}

            {!loadingMovies && gridMovies.length === 0 && (
              <p style={{ margin: 0, color: "#99aabb" }}>
                Немає фільмів у базі або бекенд не відповідає.
              </p>
            )}

            {gridMovies.map((m, i) => (
              <Link key={m.id} to={`/movie/${m.id}`} className="similar-movie-link">
                <img src={m.photoUrl ?? fallbackPosters[i % fallbackPosters.length]} alt={m.title} />
              </Link>
            ))}
          </div>
        </SectionLayout>

        {!isAuth && (
          <>
            <hr className="divider" />
            <SectionLayout title="Rewind lets you...">
              <section className="features-grid">
                <FeatureCard
                  icon={<Eye size={32} />}
                  title="Keep track of every film you've ever watched (or just start from the day you join)"
                />
                <FeatureCard
                  icon={<Heart size={32} />}
                  title='Show some love for your favorite films, lists and reviews with a “like”'
                />
                <FeatureCard
                  icon={<MessageSquare size={32} />}
                  title="Write and share reviews, and follow friends and other members to read theirs"
                />
                <FeatureCard
                  icon={<Star size={32} />}
                  title="Rate each film on a five-star scale (with halves) to record and share your reaction"
                />
                <FeatureCard icon={<Calendar size={32} />} title="Keep a diary of your film watching, and get personalised stats pages" />
                <FeatureCard
                  icon={<LayoutGrid size={32} />}
                  title="Compile and share lists of films on any topic and keep a watchlist of films to see"
                />
              </section>
            </SectionLayout>
          </>
        )}

        <div className="content-split">
          <div className="reviews-column">
            <hr className="divider" />
            <SectionLayout
              title="Popular reviews this week"
              hasMore={reviewsData.length > 4}
              onMoreClick={() => (window.location.href = "/search")}
            >
              {reviewsData.slice(0, 4).map((review, index) => (
                <ReviewCard
                  key={index}
                  author={review.author}
                  rating={review.rating}
                  title={review.title}
                  date={review.date}
                  text={review.text}
                  moviePosterUrl={reviePosters[index]?.src}
                />
              ))}
            </SectionLayout>
          </div>

          <div className="sidebar-column">
            <hr className="divider" />

            <SectionLayout
              title="Popular lists"
              hasMore={popularListsData.length > 3}
              onMoreClick={() => (window.location.href = "/about")}
            >
              <div className="lists-container">
                {popularListsData.slice(0, 3).map((list, index) => (
                  <ListCard key={index} {...list} />
                ))}
              </div>
            </SectionLayout>

            <hr className="divider" style={{ margin: "58px 0" }} />

            <SectionLayout
              title="Popular reviewers"
              hasMore={reviewersData.length > 3}
              onMoreClick={() => (window.location.href = "/profile")}
            >
              <div className="reviewers-list">
                {reviewersData.slice(0, 3).map((rev, i) => (
                  <ReviewerCard key={i} {...rev} />
                ))}
              </div>
            </SectionLayout>
          </div>
        </div>

        <hr className="divider" />

        <SectionLayout title="Recent news" hasMore={newsData.length > 3} onMoreClick={() => (window.location.href = "/about")}>
          <div className="news-grid">
            {newsData.slice(0, 3).map((news, index) => (
              <div key={index} className="news-card">
                <div className="news-img-container">
                  <img src={news.image.src} alt={news.title} className="news-img" />
                </div>
                <div className="news-content">
                  <h4 className="news-title">{news.title}</h4>
                  <p className="news-description">{news.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionLayout>
      </main>

      <Footer />
    </div>
  );
};

const SectionLayout: React.FC<SectionLayoutProps> = ({ title, children, hasMore, onMoreClick, isExpanded }) => (
  <section className="section-container">
    <div className="section-header">
      <h3>{title}</h3>
      {hasMore && (
        <span className="more-link" onClick={onMoreClick} style={{ cursor: "pointer" }}>
          {isExpanded ? "Show Less" : "More"} <ChevronRight size={14} />
        </span>
      )}
    </div>
    {children}
  </section>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <p className="feature-text">{title}</p>
  </div>
);

const ReviewCard: React.FC<ReviewCardProps> = ({ author, title, rating, text, moviePosterUrl, date }) => (
  <div className="home-review-card">
    <div className="review-movie-poster">
      <img src={moviePosterUrl || "https://via.placeholder.com/150x225"} alt={title} />
    </div>

    <div className="review-content-right">
      <div className="review-header-row">
        <p className="movie-title-header">
          <span className="movie-name">{title}</span>
          <span className="rating-stars">★ {rating}</span>
        </p>
        <div className="author-meta">
          <span className="author-name">{author}</span>
          <span className="review-date">{date}</span>
        </div>
      </div>
      <p className="review-text-body">{text}</p>
    </div>
  </div>
);

const ListCard = ({ title, author, authorAvatar, posters }: any) => (
  <div className="sidebar-list-card">
    <div className="list-poster-stack">
      {posters.slice(0, 4).map((p: any, i: number) => (
        <div
          key={i}
          className="stacked-poster"
          style={{
            left: i * 45,
            zIndex: 10 - i,
            boxShadow: i === Math.min(posters.length, 4) - 1 ? "none" : undefined,
          }}
        >
          <img src={p} alt="poster" />
        </div>
      ))}
    </div>
    <div className="list-card-info">
      <h4 className="list-card-title">{title}</h4>
      <div className="list-card-meta">
        <img src={authorAvatar} alt={author} className="mini-avatar" />
        <span className="author-label">Created by </span>
        <span className="author-name">{author}</span>
      </div>
    </div>
  </div>
);

const ReviewerCard = ({ name, info, avatar }: any) => (
  <div className="reviewer-item">
    <img src={avatar} alt={name} className="reviewer-avatar" />
    <div className="reviewer-info">
      <p className="reviewer-name">{name}</p>
      <p className="reviewer-stats">{info}</p>
    </div>
  </div>
);

export default HomePage;
