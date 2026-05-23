import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrap-narrow text-center md:text-left">
      <p className="eyebrow">404</p>
      <h1 className="page-title">Page not found</h1>
      <p className="page-lead">This URL does not exist on cyob.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
