// ... імпорти як у тебе
// src/pages/Help/Help.tsx

import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import styles from "./Help.module.css";

export default function Help() {
  return (
    <div className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Help</h1>
          <p className={styles.heroSubtitle}>
            Help is a trusted space where Rewind supports every <br />
            reader, making the journey through cinema simple, <br />
            accessible, and enjoyable.
          </p>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* 1: text left / image right */}
          <section className={styles.row}>
            <div className={styles.textCol}>
              <h2 className={styles.h2}>Tell Us What You’ve Seen</h2>
              <p className={styles.p}>
                Start your Rewind journey by marking films you’ve already watched.
                Click the “eye” icon on any poster to add it to your profile. Add a
                “like” or rating if you enjoyed it. All marked films go to your “Films”
                tab.
              </p>
            </div>

            <div className={styles.mediaColRight}>
              <div className={styles.card_actions}>
                <img className={styles.img} src="/help/help-01-actions.png" alt="" />
              </div>
            </div>
          </section>

          <div className={styles.hr} />

          {/* 2: image left / text right */}
          <section className={styles.row}>
            <div className={styles.mediaColLeft}>
              <div className={styles.card_filmsTab}>
                <img className={styles.img} src="/help/help-02-films-tab.png" alt="" />
              </div>
            </div>

            <div className={styles.textColRight}>
              <h2 className={styles.h2}>Browse Your Films</h2>
              <p className={styles.p}>
                Once you’ve added a few titles, they appear in your “Films” tab. The more
                you add, the more your profile reflects your taste. You can also browse
                other members’ collections and activate “Hide watched films” to discover
                new titles.
              </p>
            </div>
          </section>

          <div className={styles.hr} />

          {/* 3: text left / image right */}
          <section className={styles.row}>
            <div className={styles.textCol}>
              <h2 className={styles.h2}>Add movies to your Watchlist</h2>
              <p className={styles.p}>
                The Watchlist feature lets you curate a collection of movies you want to
                watch. Use the plus icon on a movie poster or menu to add it to your list.
              </p>
            </div>

            <div className={styles.mediaColRight}>
              <div className={styles.card_watchlist}>
                <img className={styles.img} src="/help/help-03-watchlist.png" alt="" />
              </div>
            </div>
          </section>

          <div className={styles.hr} />

          {/* 4: image left / text right */}
          <section className={styles.row}>
            <div className={styles.mediaColLeft}>
              <div className={styles.card_settings}>
                <img className={styles.img} src="/help/help-04-settings.png" alt="" />
              </div>
            </div>

            <div className={styles.textColRight}>
              <h2 className={styles.h2}>Your Account and Settings</h2>
              <p className={styles.p}>
                Click your username at the top of the page for shortcuts to Profile,
                Films, Diary, Watchlist, and more. In Settings, you can customize your
                name, location, website, bio, and favorite films.
              </p>
            </div>
          </section>

          <div className={styles.hr} />

          {/* 5: text left / image right */}
          <section className={styles.row}>
            <div className={styles.textCol}>
              <h2 className={styles.h2}>Following and Activity</h2>
              <p className={styles.p}>
                Read reviews from other members to find voices you enjoy and follow them.
                Your “Activity” feed will then show recommendations and reviews from those
                accounts.
              </p>
            </div>

            <div className={styles.mediaColRight}>
              <div className={styles.card_activity}>
                <img className={styles.img} src="/help/help-05-activity.png" alt="" />
              </div>
            </div>
          </section>

          <div className={styles.hr} />

          {/* 6: image left / text right */}
          <section className={styles.row}>
            <div className={styles.mediaColLeft}>
              <div className={styles.card_makeLists}>
                <img className={styles.img} src="/help/help-06-make-lists.png" alt="" />
              </div>
            </div>

            <div className={styles.textColRight}>
              <h2 className={styles.h2}>Make and Share Lists</h2>
              <p className={styles.p}>
                Lists let you share collections of films by genre, actor, director, or
                theme. Create a list in your “Lists” tab, add films, and make it public to
                share with your followers.
              </p>
            </div>
          </section>

          {/* нижній блок 3 в ряд */}
          <div className={styles.bottomGrid}>
            <div className={styles.bottomItem}>
              <div className={styles.card_bottomLeft}>
                <img className={styles.img} src="/help/help-07-film-actions.png" alt="" />
              </div>
              <h3 className={styles.h3}>Film actions</h3>
              <p className={styles.pSmall}>
                On a film or review page, you can quickly mark a title as watched, add a
                “like”, and rate it. You can also log the film with a date or include it
                in a formatted list. These actions personalize your profile and help track
                your viewing journey.
              </p>
            </div>

            <div className={styles.bottomItemCenter}>
              <div className={styles.card_tags}>
                <img className={styles.img} src="/help/help-08-tags.png" alt="" />
              </div>
              <h3 className={styles.h3}>Tagging films</h3>
              <p className={styles.pSmall}>
                Tags help organize films as you log them. Use them to note how, where, or
                with whom you watched, or to create your own genre system. Later, you can
                filter by tags to recall specific experiences or group films into
                categories that matter to you.
              </p>
            </div>

            <div className={styles.bottomItem}>
              <div className={styles.card_bottomRight}>
                <img className={styles.img} src="/help/help-09-lists.png" alt="" />
              </div>
              <h3 className={styles.h3}>Lists</h3>
              <p className={styles.pSmall}>
                Lists let you collect and share films by theme, genre, director, or mood.
                With tags, they become searchable, so others can find them through browsing.
                A list tagged “French New Wave” or “Oscar Winners” connects your curation
                with the community.
              </p>
            </div>
          </div>

          <div className={styles.footerSpace} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
