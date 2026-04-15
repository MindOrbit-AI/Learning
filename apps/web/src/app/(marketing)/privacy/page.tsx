import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MindOrbit collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/"
        className="text-sm font-bold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
      >
        ← Back to home
      </Link>
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: April 14, 2026
      </p>
      <div className="prose prose-sm mt-10 max-w-none dark:prose-invert">
        <p>
          This Privacy Policy describes how MindOrbit (“we,” “us,” or “our”)
          collects, uses, discloses, and protects information when you use our
          websites, applications, and related services (collectively, the
          “Services”). By using the Services, you agree to this policy. If you do
          not agree, please do not use the Services.
        </p>

        <h2>1. Information we collect</h2>
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>
            <strong>Account and profile data.</strong> Information you provide when
            you register or update an account, such as name, email address,
            username, password or authentication credentials, and preferences.
          </li>
          <li>
            <strong>Learning and usage data.</strong> Information related to your use
            of the Services, including diagnostic results, mastery maps, missions,
            progress, scores, study activity, and interactions with features or
            content.
          </li>
          <li>
            <strong>Content you submit.</strong> Text, files, notes, or other
            materials you upload or create within the Services, where applicable.
          </li>
          <li>
            <strong>Technical and device data.</strong> IP address, browser type,
            device identifiers, operating system, approximate location derived from
            IP, log data, and similar diagnostic information.
          </li>
          <li>
            <strong>Cookies and similar technologies.</strong> We and our partners
            may use cookies, local storage, and similar technologies to operate
            the Services, remember preferences, measure performance, and improve
            security. You can control cookies through your browser settings.
          </li>
          <li>
            <strong>Information from third parties.</strong> If you connect a third
            party (for example, a sign-in provider), we may receive information
            they share with us according to their policies and your settings.
          </li>
        </ul>

        <h2>2. How we use information</h2>
        <p>We use the information above to:</p>
        <ul>
          <li>Provide, maintain, and improve the Services;</li>
          <li>Create and manage accounts and authenticate users;</li>
          <li>Personalize learning paths, recommendations, and the user experience;</li>
          <li>Communicate with you about the Services, updates, and support;</li>
          <li>Monitor and help secure the Services, detect fraud, and prevent abuse;</li>
          <li>Comply with law, enforce our terms, and protect rights and safety;</li>
          <li>Conduct analytics and research in aggregate or de-identified form where
            appropriate.</li>
        </ul>

        <h2>3. How we share information</h2>
        <p>We may share information in these situations:</p>
        <ul>
          <li>
            <strong>Service providers.</strong> With vendors who help us host,
            analyze, secure, email, or operate the Services, subject to
            confidentiality and use limitations.
          </li>
          <li>
            <strong>Legal and safety.</strong> When required by law, legal process,
            or to protect the rights, property, or safety of MindOrbit, our users,
            or others.
          </li>
          <li>
            <strong>Business transfers.</strong> In connection with a merger,
            acquisition, financing, or sale of assets, subject to appropriate
            safeguards.
          </li>
          <li>
            <strong>With your direction.</strong> When you ask us to share
            information or connect integrations you authorize.
          </li>
        </ul>
        <p>
          We do not sell your personal information as that term is commonly
          understood in applicable privacy laws. We may use aggregated or
          de-identified data that cannot reasonably identify you.
        </p>

        <h2>4. Data retention</h2>
        <p>
          We retain information for as long as needed to provide the Services,
          comply with legal obligations, resolve disputes, and enforce our
          agreements. Retention periods may vary depending on the type of data and
          how it is used.
        </p>

        <h2>5. Security</h2>
        <p>
          We use technical and organizational measures designed to protect
          information against unauthorized access, loss, or alteration. No method of
          transmission or storage is completely secure; we cannot guarantee absolute
          security.
        </p>

        <h2>6. Your choices and rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, or export certain personal information, or to object to or
          restrict certain processing. You may also have the right to lodge a
          complaint with a supervisory authority. To exercise rights that apply to
          you, contact us using the information below. We may need to verify your
          identity before responding.
        </p>

        <h2>7. Children</h2>
        <p>
          The Services are not directed to children under 13 (or the age required
          in your jurisdiction) without appropriate consent. If you believe we have
          collected information from a child without proper authorization, contact
          us and we will take appropriate steps.
        </p>

        <h2>8. International transfers</h2>
        <p>
          We may process and store information in countries other than where you
          live. Where required, we use appropriate safeguards for cross-border
          transfers.
        </p>

        <h2>9. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the
          updated version on this page and adjust the “Last updated” date. Material
          changes may be communicated through the Services or by email where
          appropriate.
        </p>

        <h2>10. Contact us</h2>
        <p>
          For questions or requests about this Privacy Policy or our privacy
          practices, contact us at the support or legal contact address published
          for MindOrbit (or add a dedicated email when available).
        </p>
      </div>
    </div>
  );
}
