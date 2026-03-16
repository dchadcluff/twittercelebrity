export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-cyber-panel mt-auto py-6 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 text-xs text-cyber-muted">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a href="https://chadcluff.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            chadcluff.com
          </a>
          <a href="https://cougarcorner.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            cougarcorner.com
          </a>
          <a href="https://infertiletruth.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            infertiletruth.com
          </a>
          <a href="https://sarajocluff.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            sarajocluff.com
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <span className="text-cyber-panel">|</span>
          <a href="/terms" className="footer-link">Terms of Use</a>
        </div>

        <p>&copy; {currentYear} Chad Cluff. All rights reserved.</p>
      </div>
    </footer>
  );
}
