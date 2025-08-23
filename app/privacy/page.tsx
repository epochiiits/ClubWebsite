import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Epoch IIITS",
  description: "Privacy Policy for Epoch IIITS Website",
};

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-3xl py-12 mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Introduction
          </h2>
          <p className="text-muted-foreground">
            At Epoch IIITS, we respect your privacy and are
            committed to protecting your personal data. This
            privacy policy explains how we collect, use, and
            safeguard your information when you use our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h2>
          <p className="text-muted-foreground mb-4">
            We collect information that you provide directly to
            us when you:
          </p>
          <ul className="list-none pl-6 text-muted-foreground space-y-2">
            <li>Create an account or profile</li>
            <li>Register for events</li>
            <li>Contact us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            How We Use Your Information
          </h2>
          <p className="text-muted-foreground mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-none pl-6 text-muted-foreground space-y-2">
            <li>Provide and maintain our services</li>
            <li>Process your event registrations</li>
            <li>Send you important updates and notifications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Data Security
          </h2>
          <p className="text-muted-foreground">
            We implement appropriate security measures to protect
            your personal information. However, please note that
            no method of transmission over the internet is 100%
            secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy,
            please contact us at{" "}
            <a
              href="mailto:epoch@iiits.in"
              className="text-primary hover:underline"
            >
              epoch@iiits.in
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Changes to This Policy
          </h2>
          <p className="text-muted-foreground">
            We may update our Privacy Policy from time to time.
            We will notify you of any changes by posting the new
            Privacy Policy on this page.
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: August 23, 2025
        </p>
      </div>
    </div>
  );
}
