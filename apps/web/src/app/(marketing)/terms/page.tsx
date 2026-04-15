import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms that govern use of the MindOrbit learning platform.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/"
        className="text-sm font-bold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
      >
        ← Back to home
      </Link>
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: April 14, 2026
      </p>
      <div className="prose prose-sm mt-10 max-w-none dark:prose-invert">
        <p>
          These Terms of Service (“Terms”) govern your access to and use of
          MindOrbit’s websites, applications, and related services (collectively, the
          “Services”). By creating an account, accessing, or using the Services, you
          agree to these Terms. If you are using the Services on behalf of an
          organization, you represent that you have authority to bind that
          organization.
        </p>

        <h2>1. Eligibility and accounts</h2>
        <p>
          You must provide accurate registration information and keep it current.
          You are responsible for all activity under your account and for
          safeguarding your credentials. Notify us promptly of any unauthorized
          use. We may refuse registration or suspend accounts that violate these
          Terms or pose risk to the Services or other users.
        </p>

        <h2>2. License to use the Services</h2>
        <p>
          Subject to these Terms, we grant you a limited, non-exclusive,
          non-transferable, revocable license to access and use the Services for
          your personal or internal educational purposes. You may not resell,
          sublicense, or commercially exploit the Services except as expressly
          permitted.
        </p>

        <h2>3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use the Services in violation of law or in a way that infringes others’
            rights;
          </li>
          <li>
            Attempt to probe, scan, or test vulnerabilities, or bypass security or
            access controls;
          </li>
          <li>
            Interfere with or disrupt the Services, servers, or networks, or use
            automated means (such as scraping or bots) in violation of our rules or
            rate limits;
          </li>
          <li>
            Upload malware, harass others, or distribute spam or deceptive content;
          </li>
          <li>
            Reverse engineer, decompile, or disassemble the Services except where
            prohibited by applicable law;
          </li>
          <li>
            Misrepresent your identity or affiliation, or use another user’s account
            without permission.
          </li>
        </ul>

        <h2>4. User content</h2>
        <p>
          You retain ownership of content you submit to the Services. You grant
          MindOrbit a worldwide, non-exclusive license to host, use, reproduce,
          modify, and display such content solely as needed to operate, improve,
          and promote the Services and as described in our Privacy Policy. You
          represent that you have the rights to grant this license and that your
          content does not violate law or third-party rights.
        </p>

        <h2>5. Our intellectual property</h2>
        <p>
          The Services, including software, branding, text, graphics, and other
          materials, are owned by MindOrbit or its licensors and are protected by
          intellectual property laws. Except for the limited license above, no
          rights are granted to you. Feedback you provide may be used by us without
          obligation to you.
        </p>

        <h2>6. Third-party services</h2>
        <p>
          The Services may link to or integrate third-party products. Those services
          are governed by their own terms and privacy policies. We are not
          responsible for third-party content or practices.
        </p>

        <h2>7. Changes to the Services</h2>
        <p>
          We may modify, suspend, or discontinue features or the Services with
          reasonable notice where practicable. We may also update these Terms;
          continued use after changes become effective constitutes acceptance unless
          applicable law requires otherwise.
        </p>

        <h2>8. Disclaimers</h2>
        <p>
          THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. MindOrbit does not
          guarantee specific learning outcomes, grades, or test results. Educational
          content is for informational purposes and is not professional advice.
        </p>

        <h2>9. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, MINDORBIT AND ITS AFFILIATES,
          OFFICERS, EMPLOYEES, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF
          PROFITS, DATA, OR GOODWILL. OUR AGGREGATE LIABILITY FOR CLAIMS ARISING OUT
          OF OR RELATED TO THE SERVICES OR THESE TERMS WILL NOT EXCEED THE GREATER OF
          THE AMOUNTS YOU PAID US FOR THE SERVICES IN THE TWELVE MONTHS BEFORE THE
          CLAIM OR ONE HUNDRED U.S. DOLLARS (US$100), EXCEPT WHERE PROHIBITED BY LAW.
        </p>

        <h2>10. Indemnity</h2>
        <p>
          You will defend and indemnify MindOrbit and its affiliates against claims,
          damages, losses, and expenses (including reasonable attorneys’ fees)
          arising from your use of the Services, your content, or your violation of
          these Terms.
        </p>

        <h2>11. Termination</h2>
        <p>
          You may stop using the Services at any time. We may suspend or terminate
          your access for breach of these Terms or for other legitimate reasons,
          with notice where required. Provisions that by their nature should survive
          will survive termination, including ownership, disclaimers, limitation of
          liability, and indemnity.
        </p>

        <h2>12. Governing law and disputes</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction we designate for
          MindOrbit, without regard to conflict-of-law rules, except where
          mandatory consumer protections apply in your country. Disputes will be
          resolved in the courts or forums we specify, unless applicable law
          requires otherwise. You may have mandatory rights in your jurisdiction
          that cannot be waived by contract.
        </p>

        <h2>13. General</h2>
        <p>
          These Terms constitute the entire agreement between you and MindOrbit
          regarding the Services and supersede prior agreements on this subject.
          If any provision is unenforceable, the remaining provisions remain in
          effect. Our failure to enforce a provision is not a waiver. You may not
          assign these Terms without our consent; we may assign them in connection
          with a merger or sale.
        </p>

        <h2>14. Contact</h2>
        <p>
          For questions about these Terms, contact us at the support address
          published for MindOrbit (or add a dedicated legal contact when available).
        </p>
      </div>
    </div>
  );
}
