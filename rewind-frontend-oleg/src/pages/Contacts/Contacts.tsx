import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import styles from "./Contacts.module.css";

const EMAILS = ["rewind@gmail.com", "rewind@yahoo.com", "rewind@icloud.com"];

export default function Contacts() {
  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Contacts</h1>
          <p className={styles.heroSubtitle}>
            Contact is the voice of Rewind, opening space for <br />
            dialogue, collaboration, and ideas that keep cinema <br />
            alive.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className={styles.main}>
        <div className={styles.container}>
          <p className={styles.lead}>
            We’d love to hear from you regarding any aspect of Rewind. Please check our
            Frequent Questions page first, and if your enquiry is not answered there, or
            is a general message of delight or dismay, send it to us by email using the
            links below. Please direct email enquiries to one of the following addresses
            (mass mails will be ignored).
          </p>

          <div className={styles.emailRow}>
            {EMAILS.map((e) => (
              <a key={e} className={styles.email} href={`mailto:${e}`}>
                {e}
              </a>
            ))}
          </div>

          <div className={styles.hr} />

          <section className={styles.block}>
            <h2 className={styles.h2}>Account Support + Film Data</h2>
            <ul className={styles.checkList}>
              <li>General support enquiries, bugs and feature requests</li>
              <li>Film data corrections and import requests*</li>
              <li className={styles.note}>
                *Film data comes from TMDB—please submit changes there in the first
                instance.
              </li>
            </ul>
          </section>

          <div className={styles.hr} />

          <section className={styles.block}>
            <h2 className={styles.h2}>Editorial + Partnerships</h2>
            <ul className={styles.checkList}>
              <li>Partnership and co-marketing enquiries</li>
              <li>Film-festival partnership enquiries</li>
              <li>Social-media collaboration enquiries</li>
              <li>Editorial pitches for Rewind Journal</li>
            </ul>
          </section>

          <div className={styles.hr} />

          <section className={styles.block}>
            <h2 className={styles.h2}>Press + Advertising</h2>
            <ul className={styles.checkList}>
              <li>Press or media enquiries</li>
              <li>Advertising enquiries</li>
              <li>Advertising enquiries (France)</li>
            </ul>
          </section>

          <div className={styles.hr} />

          <p className={styles.smallText}>
            Our prior feature-request board is archived here. Please send bug reports and
            feature requests by email.
          </p>

          <div className={styles.emailRowBottom}>
            {EMAILS.map((e) => (
              <a key={e} className={styles.emailBottom} href={`mailto:${e}`}>
                {e}
              </a>
            ))}
          </div>

          {/* відступ до футера як на ваших сторінках */}
          <div className={styles.footerSpace} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
