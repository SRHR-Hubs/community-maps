import Logo from "../../../public/logo.svg";
import Link from "next/link";
import { Twitter, Instagram } from "../../../lib/ionicons";
import config from "../../../config/next-seo.config";
import { Trans } from "next-i18next";

const { twitter: twitterInfo, instagram: instagramInfo } = config;

const Header = ({ show, ...props }) => (
  <header data-show={show} role="banner">
    <div className="container grid-xl">
      <div className="columns" id="header-top-row">
        <section className="col-ml-auto links" role="navigation">
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/join-our-team">Get involved</Link>
          <Link href="#"><button className="btn btn-error get-out-quick">Get out quick</button></Link>
        </section>
        <div className="col-1 dummy"></div>
      </div>
      <div className="columns" id="header-bottom-row">
        <section className="navbar-section column col-2 hide-md" aria-hidden>
          <Link href="/" tabIndex={-1}>
            <Logo className="logo" />
          </Link>
        </section>
        <section className="navbar-section column col links">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </section>
        <section className="navbar-section column col-2 links hide-md">
          <Link
            href={twitterInfo.site}
            className="tooltip tooltip-bottom"
            data-tooltip={twitterInfo.handle}
            aria-label="Follow SRHR Hubs on Twitter"
          >
            <Twitter />
          </Link>
          <Link
            href={instagramInfo.site}
            className="tooltip tooltip-bottom"
            data-tooltip={instagramInfo.handle}
            aria-label="Follow SRHR Hubs on Instagram"
          >
            <Instagram />
          </Link>
          <button className="btn btn-primary"><Trans i18nKey={'layout.header.use-the-map'}>Use the map</Trans></button>
        </section>
        <div className="col-1 dummy"></div>
      </div>
    </div>
  </header>
);

export default Header;
