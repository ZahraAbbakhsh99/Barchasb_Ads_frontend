import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link href="/" className="logo">رستاتک</Link>
        <div className="nav-links">
          <Link href="/seller">بازارچه</Link>
          <Link href="/employer">کارفرما</Link>
          <Link href="/digital">پروژه</Link>
          <Link href="/jobseeker">کارجویان</Link>
        </div>
      </div>
    </nav>
  );
}