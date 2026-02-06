import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import styles from "./AboutUs.module.css";

export default function AboutUs() {
  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>About Us</h1>
          <p className={styles.heroSubtitle}>
            Rewind is a cultural space created for those who live <br />
            and breathe cinema, seeing it as part of modern life.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Our Mission</h2>
            <p className={styles.blockText}>
              Rewind is a cultural space created for those who live and breathe cinema,
              seeing it not only as entertainment but as an essential part of modern
              identity, collective memory, and artistic dialogue. From the very beginning,
              our mission has been to create a platform that unites critics, writers,
              designers, and audiences in a shared pursuit of cinematic discovery. We
              believe cinema is not a passive spectacle but an active force that shapes
              how we perceive the world, how we remember history, and how we imagine the
              future.
            </p>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Editorial Approach</h2>
            <p className={styles.blockText}>
              Our editorial team works across multiple formats — in-depth features,
              interviews, podcasts, visual essays, and curated collections — to highlight
              the richness of film culture. Each piece is designed not only to inform but
              to inspire, to spark conversation, and to encourage reflection. We strive to
              ensure that our content is visually expressive, aesthetically refined, and
              intellectually engaging. Rewind is not just media; it is a community where
              honesty, aesthetics, and depth are valued, where every article or creative
              project is crafted with care and respect for cinema’s transformative power.
            </p>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Bridging Past and Future</h2>
            <p className={styles.blockText}>
              We embrace both established classics and emerging voices, bridging the past
              and the present while opening doors to the future of cinema. Our coverage
              spans Hollywood landmarks, European masterpieces, independent experiments,
              and global discoveries. By curating stories that matter, we aim to inspire
              audiences, foster creativity, and strengthen the bond between film and
              society.
            </p>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Accessibility and Inclusion</h2>
            <p className={styles.blockText}>
              Rewind also believes in the importance of accessibility. Cinema should not
              be confined to elite spaces or academic circles; it should be open to
              everyone. That is why we design our projects to be inclusive, approachable,
              and engaging for diverse audiences. Whether you are a lifelong cinephile or
              someone discovering film for the first time, Rewind offers a space where you
              can feel welcome, challenged, and inspired.
            </p>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Philosophy of Dialogue</h2>
            <p className={styles.blockText}>
              Our philosophy is rooted in dialogue. We see cinema as a conversation between
              artists and audiences, between past and present, between cultures and
              generations. Rewind exists to facilitate that conversation, to provide
              context, to amplify voices, and to create bridges across differences. We
              believe that great films are not diminished by time; they are transformed by
              the moment in which we finally meet them.
            </p>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Visual Storytelling</h2>
            <p className={styles.blockText}>
              Beyond editorial work, Rewind invests in visual storytelling. Our design team
              creates infographics, nomination-style graphics, and branded visuals that
              make film culture not only readable but also visually compelling. We
              understand that cinema is both an intellectual and aesthetic experience, and
              we strive to reflect that duality in everything we publish.
            </p>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Commitment to Innovation</h2>
            <p className={styles.blockText}>
              Rewind is also committed to innovation. We experiment with new formats,
              digital storytelling techniques, and interactive projects. We believe that
              the future of film culture lies in blending tradition with innovation, in
              respecting the canon while embracing new voices, in creating spaces where
              creativity can flourish without boundaries.
            </p>
          </section>

          <section className={`${styles.block} ${styles.lastBlock}`}>
            <h2 className={styles.blockTitle}>Final Vision</h2>
            <p className={styles.blockText}>
              Ultimately, Rewind is a place where cinema lives, breathes, and continues to
              transform the way we see the world. It is a platform built on passion,
              sustained by collaboration, and driven by the belief that film is one of the
              most powerful tools we have to understand ourselves and each other.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
