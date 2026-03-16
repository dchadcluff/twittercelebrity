import { Link } from "react-router";

export default function Terms() {
  return (
    <div className="min-h-screen bg-cyber-black font-cyber text-cyber-text px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-neon-cyan text-sm hover:underline">&larr; Back</Link>

        <h1 className="text-2xl font-bold text-neon-cyan mt-6 mb-8">Terms of Use</h1>

        <div className="space-y-6 text-sm text-cyber-muted leading-relaxed">
          <p><strong className="text-cyber-text">Last updated:</strong> March 16, 2026</p>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Acceptance</h2>
            <p>
              By accessing and using Twitter Celebrity ("the Site"), you agree to these terms. If you do not agree,
              please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Description</h2>
            <p>
              The Site is a parody/entertainment experience. It is not affiliated with, endorsed by, or connected to
              X Corp (formerly Twitter) or any celebrities featured. All celebrity names, images, and likenesses are
              used under fair use for the purposes of parody and commentary.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Intellectual Property</h2>
            <p>
              Original site design, code, and content are &copy; {new Date().getFullYear()} Chad Cluff. Celebrity
              profile images and names belong to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Disclaimer</h2>
            <p>
              The Site is provided "as is" without warranties of any kind. We make no guarantees about accuracy,
              completeness, or fitness for any particular purpose. Use the Site at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Limitation of Liability</h2>
            <p>
              In no event shall Chad Cluff be liable for any damages arising from the use or inability to use the
              Site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyber-text mb-2">Changes</h2>
            <p>
              These terms may be updated at any time. Continued use of the Site after changes constitutes acceptance
              of the revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
