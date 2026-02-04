import React, { type ReactNode } from "react";
import {
  ChevronRight,
  Eye,
  Heart,
  MessageSquare,
  Star,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./MainPage.css";
import { useAuth } from "../context/AuthContext";

interface Film {
  src: string;
}

interface SectionLayoutProps {
  title: string;
  children: ReactNode;
  hasMore?: boolean;
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
  userImageUrl?: string;
  date: string;
}

const HomePage: React.FC = () => {
  const { isAuth } = useAuth();

  const similarFilms: Film[] = [
    { src: "https://cdn.europosters.eu/image/350/%D0%9F%D0%BB%D0%B0%D0%BA%D0%B0%D1%82%D0%B8/avengers-endgame-i122136.jpg" },
    { src: "https://upload.wikimedia.org/wikipedia/uk/archive/c/c0/20171220085356%21%D0%A1%D1%82%D0%BE%D1%80%D0%BE%D0%B6%D0%BE%D0%B2%D0%B0_%D0%B7%D0%B0%D1%81%D1%82%D0%B0%D0%B2%D0%B0_-_%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D1%96%D0%BB%D1%8C%D0%BC%D1%83.jpg" },
    { src: "https://www.5.ua/media/pictures/original/289365.jpg?t=1717932845" },
    { src: "https://cdn.europosters.eu/image/350/%D0%9F%D0%BB%D0%B0%D0%BA%D0%B0%D1%82%D0%B8/jaws-i116103.jpg" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyzv_5eNZNhYmLkS-ObmqWnKOvRA_vIOOTSw&s" },
    { src: "https://kino-teatr.ua/public/main/films/2026-01/x2_poster_695e4f19ec5d4.jpg" },
  ];

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

        {/* Header тепер без пропсів */}
        <Header />

        <div className="hero-content">
          {isAuth ? (
            <div className="hero-text-logged">
              <h1>Welcome back. Here's what we've been watching...</h1>
              <p>
                This homepage will become more personal as you{" "}
                <span>follow action members</span> on the net.
              </p>
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
              <Link className="btn-start" to="/register">
                Get started
              </Link>
            </div>
          )}
        </div>
      </section>

      <main className="home-main">
        <SectionLayout title={isAuth ? "New on Rewind" : "Popular on Rewind"} hasMore>
          <div className="poster-grid-6">
            {similarFilms.map((m, i) => (
              // Поки немає нормальної підвантаженої підбірки з бекенду — ведемо на пошук
              <Link key={i} to="/search" className="similar-movie-link">
                <img src={m.src} alt="film" />
              </Link>
            ))}
          </div>
        </SectionLayout>

        {!isAuth && (
          <SectionLayout title="Rewind lets you..." hasMore>
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
              <FeatureCard
                icon={<Calendar size={32} />}
                title="Keep a diary of your film watching, and get personalised stats pages"
              />
              <FeatureCard
                icon={<LayoutGrid size={32} />}
                title="Compile and share lists of films on any topic and keep a watchlist of films to see"
              />
            </section>
          </SectionLayout>
        )}

        <div className="content-split">
          <div className="reviews-column">
            <SectionLayout title="Popular reviews this week" hasMore>
              <ReviewCard
                author="Superman"
                rating="4.5"
                title="Oppenheimer"
                date="14 Dec 2025"
                text="The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb..."
                userImageUrl="https://randomuser.me/api/portraits/men/1.jpg"
              />
              <ReviewCard
                author="Avatar"
                rating="4.0"
                title="Avatar: The Way of Water"
                date="12 Dec 2025"
                text="James Cameron's long-awaited sequel is a visual marvel that pushes the boundaries of CGI..."
                userImageUrl="https://randomuser.me/api/portraits/women/2.jpg"
              />
            </SectionLayout>
          </div>

          <div className="sidebar-column">
            <SectionLayout title="Popular lists">
              <div className="list-stack">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="list-item">
                    <div className="list-images">
                      <div className="mini-img"></div>
                      <div className="mini-img"></div>
                    </div>
                    <p>Classic essential cinema</p>
                  </div>
                ))}
              </div>
            </SectionLayout>
          </div>
        </div>

        <SectionLayout title="Recent news" hasMore>
          <div className="news-grid">
            <div className="news-card">
              <div className="news-img"></div>
              <h4>Beyond the Screen</h4>
              <p>Exploring the latest trends in cinematography.</p>
            </div>
            <div className="news-card">
              <div className="news-img"></div>
              <h4>Funny Papers</h4>
              <p>The evolution of comic book adaptations.</p>
            </div>
          </div>
        </SectionLayout>
      </main>

      <Footer />
    </div>
  );
};

const SectionLayout: React.FC<SectionLayoutProps> = ({ title, children, hasMore }) => (
  <section className="section-container">
    <div className="section-header">
      <h3>{title}</h3>
      {hasMore && (
        <span className="more-link">
          More <ChevronRight size={14} />
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

const ReviewCard: React.FC<ReviewCardProps> = ({ author, title, rating, text, userImageUrl, date }) => (
  <div className="home-review-card">
    <div className="review-user-row">
      <div className="user-icon">
        {userImageUrl ? (
          <img src={userImageUrl} alt={author} className="avatar-img" />
        ) : (
          <div className="avatar-placeholder"></div>
        )}
      </div>
      <div className="user-meta">
        <p className="user-name">
          {author} <span>★ {rating}</span>
        </p>
        <p className="movie-title-link">
          {title} <span>{date}</span>
        </p>
      </div>
    </div>
    <p className="review-snippet">{text}</p>
  </div>
);

export default HomePage;
