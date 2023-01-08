import logo from "../../../public/logo.svg";
import NextImage from "next/image";
import Link from "next/link";

const Header = ({ show, ...props }) => (
  <header data-show={show}>
    <div className="container">
      <div className="columns">
        <section className="col-ml-auto links">
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/join-our-team">Get involved</Link>
          <Link href="#">Get out quick</Link>
        </section>
        <div className="col-1"></div>
      </div>
      <div className="columns">
        <section className="navbar-section column col-2">
          <Link href="/">
            <NextImage src={logo} className="logo" />
          </Link>
        </section>
        <section className="navbar-section column col links">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </section>
        <section className="navbar-section column col-2 btns">
            
        </section>
      </div>
    </div>
  </header>
);

export default Header;
