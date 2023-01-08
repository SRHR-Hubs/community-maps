import Logo from "../../../public/logo.svg";
import Link from "next/link";
import { Twitter, Instagram } from "../../../lib/ionicons";
import config from "../../../config/next-seo.config";

const { twitter: twitterInfo, instagram: instagramInfo } = config;

const Header = ({ show, ...props }) => (
  <header data-show={show}>
    <div className="container">
      <div className="columns" id="header-top-row">
        <section className="col-ml-auto links">
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/join-our-team">Get involved</Link>
          <Link href="#">Get out quick</Link>
        </section>
        <div className="col-1"></div>
      </div>
      <div className="columns" id="header-bottom-row">
        <section className="navbar-section column col-2">
          <Link href="/">
            <Logo className="logo" />
          </Link>
        </section>
        <section className="navbar-section column col links">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </section>
        <section className="navbar-section column col-2 links">
          <Link href={twitterInfo.site}>
            <Twitter />
          </Link>
          <Link href="#">
            <Instagram />
          </Link>
        </section>
      </div>
    </div>
  </header>
);

export default Header;
