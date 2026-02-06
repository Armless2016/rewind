import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import styles from "./Terms.module.css";

type Section = {
  title?: string; // перший абзац без заголовка
  text: string;
};

const sections: Section[] = [
  {
    text:
      "By accessing and using rewind.com and any other site, application, API, or content offered, owned or operated by Rewind Limited (\"we\", \"us\", or \"our\"), including Rewind Video Store (together, the \"Service\"), you accept and agree to be bound by the following terms and conditions (\"Terms\"). If you do not agree with these Terms, you may not use the Service. Please also read our Privacy Notice for information on how we collect and use personal information. By using or otherwise accessing the Service, you acknowledge the applicability of the Privacy Notice. All references to \"you\" or \"your\", as applicable, mean the person who accesses, uses, and/or participates in the Service, and each of your heirs, assigns, and successors.",
  },
  {
    title: "License; Use",
    text:
      "Your access to the Services and all content contained therein is licensed to you, not sold. You may only use the Service in accordance with these Terms. All rights not expressly granted to you in these Terms are reserved by us, except that this does not affect your statutory rights.",
  },
  {
    title: "Responsibility",
    text:
      "You are responsible for all activity that occurs as a result of your use of the Service. We disclaim any and all liability (including for negligence) for the content, opinions, statements or other information posted to, or use of, the Service by its users (\"Posted Content\"), to the extent permissible by local law.",
  },
  {
    title: "Eligibility and Registration",
    text:
      "To use the Service, you must be at least 16 years of age. You may be required to register for an account to access certain features. When registering, you agree to provide true, accurate, current and complete information about yourself, and to maintain and promptly update this information.",
  },
  {
    title: "Community Policy",
    text:
      "You must be courteous and respectful of others’ opinions, and you must not post unwelcome, aggressive, suggestive or otherwise inappropriate remarks directed at another member of the Service.",
  },
  {
    title: "Prohibited Conduct",
    text:
      "You must not use the Service to promote hate, violence, discrimination or intolerance. You must not misrepresent your identity, disrupt discussions, post spam, or attempt to manipulate the Service. You must not reverse engineer, scrape, or otherwise misuse the Service’s technology. You must not use the Service for unlawful purposes, including defamation, privacy violations, or intellectual property infringement.",
  },
  {
    title: "Content Removal",
    text:
      "We reserve the right to remove any Posted Content that we consider offensive, objectionable, unlawful, or in breach of these Terms. Any Posted Content is solely the responsibility of the person or entity submitting it.",
  },
  {
    title: "Subscription Fees",
    text:
      "Certain services may require a paid subscription. You are responsible for paying applicable fees. Subscriptions renew automatically unless cancelled. Refunds are available only as required by law or at our discretion.",
  },
  {
    title: "Intellectual Property",
    text:
      "We (or our licensors) own all intellectual property rights in the Service, including software, images, text, graphics, logos, and audiovisual content. You may not copy, reproduce, or exploit any portion of the Service except as expressly permitted.",
  },
  {
    title: "Rewind Video Store",
    text:
      "In some countries, we may make certain films or audiovisual content available to rent for a set viewing period. Rental Content is curated at our discretion. Access is limited to personal, non-commercial use. Unauthorized copying, distribution, or exhibition of Rental Content is strictly prohibited and may result in legal penalties.",
  },
  {
    title: "Account Security",
    text:
      "You must keep your account credentials confidential. You are responsible for any activity under your account unless we have breached our legal obligations.",
  },
  {
    title: "Indemnity",
    text:
      "Where permissible by local law, you agree to indemnify and hold harmless Rewind and its affiliates against all claims, liabilities, and expenses arising from your use of the Service.",
  },
  {
    title: "Liability",
    text:
      "To the extent permitted by law, Rewind shall not be liable for indirect, incidental, or consequential damages arising from your use of the Service. Our maximum liability is limited to the amount you paid for the Service in the twelve months prior to the claim.",
  },
  {
    title: "Amendments",
    text:
      "We reserve the right to amend these Terms at any time. If changes are material, we will notify users in advance. Continued use of the Service constitutes acceptance of the updated Terms.",
  },
  {
    title: "Modifications to the Service",
    text:
      "We may modify, suspend, or discontinue the Service any time. For users in the UK/EU, if changes materially impact usability, you may cancel your subscription and request a refund for unused services.",
  },
  {
    title: "Contact us",
    text: "For questions about these Terms, please contact us.",
  },
];

export default function Terms() {
  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Terms</h1>
          <p className={styles.heroSubtitle}>
            Terms is the foundation of trust at Rewind, setting <br />
            clear rules that protect creativity, community, and the <br />
            shared love of cinema.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className={styles.main}>
        <div className={styles.container}>
          {sections.map((s, idx) => (
            <section key={idx} className={styles.section}>
              {s.title && <h2 className={styles.h2}>{s.title}</h2>}
              <p className={styles.p}>{s.text}</p>
              {idx !== sections.length - 1 && <div className={styles.hr} />}
            </section>
          ))}

          {/* як на скріні — відступ перед футером */}
          <div className={styles.footerSpace} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
