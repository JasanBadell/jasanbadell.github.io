import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__glitch-wrap">
        <span className="not-found__code" aria-hidden="true">404</span>
        <span className="not-found__code not-found__code--glitch-1" aria-hidden="true">404</span>
        <span className="not-found__code not-found__code--glitch-2" aria-hidden="true">404</span>
      </div>
      <div className="not-found__terminal">
        <span className="not-found__prompt">$ </span>
        <span className="not-found__cmd">GET</span>
        <span className="not-found__path"> /???</span>
        <span className="not-found__cursor" aria-hidden="true" />
      </div>
      <p className="not-found__status">
        <span className="not-found__badge">ERR</span>
        Route not found — the page you requested does not exist or was moved.
      </p>
      <div className="link-row">
        <Link href="/" className="btn btn--primary">← Go home</Link>
        <Link href="/projects" className="btn btn--ghost">View projects</Link>
      </div>
    </section>
  );
}
