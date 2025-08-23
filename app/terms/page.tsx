import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Epoch IIITS",
  description: "Terms and Conditions for Epoch IIITS Website",
};

export default function TermsAndConditions() {
  return (
    <div className="container max-w-3xl py-12 text-center mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Terms and Conditions
      </h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Agreement to Terms
          </h2>
          <p className="text-muted-foreground">
            By accessing and using this website, you accept and
            agree to be bound by the terms and conditions of this
            agreement. If you do not agree to abide by these
            terms, please do not use this website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Use License
          </h2>
          <ul className="list-none pl-6 text-muted-foreground space-y-2">
            <li>
              Your are not allowed to use any pictures or
              materials on Epoch IIITS&apos;s website for any
              personal, non-commercial use, or any kind of use.
            </li>
            <li>
              This is the grant of a license, not a transfer of
              title.
            </li>
            <li>
              This license shall automatically terminate if you
              violate any of these restrictions.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 ">
            User Account
          </h2>
          <p className="text-muted-foreground mb-4">
            When you create an account with us, you guarantee
            that:
          </p>
          <ul className="list-none pl-6 text-muted-foreground space-y-2">
            <li>
              The information you provide is accurate and
              complete
            </li>
            <li>
              You will maintain the accuracy of such information
            </li>
            <li>
              You are responsible for maintaining the
              confidentiality of your account
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Event Registration
          </h2>
          <p className="text-muted-foreground mb-4">
            By registering for events through our platform:
          </p>
          <ul className="list-none pl-6 text-muted-foreground space-y-2">
            <li>
              You agree to provide accurate registration
              information
            </li>
            <li>
              You understand that registration is subject to
              availability
            </li>
            <li>
              You agree to comply with event-specific rules and
              guidelines
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Disclaimer
          </h2>
          <p className="text-muted-foreground">
            The materials on Epoch IIITS&apos;s website are
            provided on an &apos;as is&apos; basis. Epoch IIITS
            makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties including,
            without limitation, implied warranties or conditions
            of merchantability, fitness for a particular purpose,
            or non-infringement of intellectual property or other
            violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Limitations
          </h2>
          <p className="text-muted-foreground">
            In no event shall Epoch IIITS or its suppliers be
            liable for any damages (including, without
            limitation, damages for loss of data or profit, or
            due to business interruption) arising out of the use
            or inability to use the materials on our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Changes to Terms
          </h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any
            time. By using this website, you agree to be bound by
            the current version of these terms and conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Contact Information
          </h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms and
            Conditions, please contact us at{" "}
            <a
              href="mailto:epoch@iiits.in"
              className="text-primary hover:underline"
            >
              epoch@iiits.in
            </a>
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: August 23, 2025
        </p>
      </div>
    </div>
  );
}
