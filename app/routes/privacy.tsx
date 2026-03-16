import { Link } from "react-router";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-cyber-black font-cyber text-cyber-text px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-neon-cyan text-sm hover:underline">&larr; Back</Link>

        <h1 className="text-2xl font-bold text-neon-cyan mt-6 mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-sm text-cyber-muted leading-relaxed">
          <p><strong className="text-cyber-text">Last updated:</strong> March 16, 2026</p>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Overview</h2>
            <p>
              Twitter Celebrity ("the Site") is a fun, interactive experience. We respect your privacy and are
              committed to being transparent about how we handle information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Information We Collect</h2>
            <p>
              The Site does not collect personal information, require account creation, or use login systems. We do
              not ask for your name, email address, or any other personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Cookies &amp; Analytics</h2>
            <p>
              We may use basic analytics tools (such as page-view counters) to understand how visitors interact with
              the Site. These tools may use cookies or similar technologies. No data collected is used to personally
              identify you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Third-Party Links</h2>
            <p>
              The Site contains links to external websites (e.g., X/Twitter, other personal sites). We are not
              responsible for the privacy practices of those sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an updated
              revision date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Contact</h2>
            <p>
              If you have questions about this policy, you can reach out via{" "}
              <a href="https://x.com/chadcluff" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">
                @chadcluff on X
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
