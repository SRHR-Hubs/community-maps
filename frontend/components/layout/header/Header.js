import Logo from "../../../public/logo.svg";
import Link from "next/link";
import { Twitter, Instagram } from "lucide-react";
// import Twitter
import config from "../../../config/next-seo.config";
import { Trans } from "next-i18next";
import GetOutQuick from "../get-out-quick/GetOutQuick";
import { useState } from "react";
import { clsx } from "clsx";

const { twitter: twitterInfo, instagram: instagramInfo } = config;

const Header = ({ show, ...props }) => {
  const [mobileNavOpen, toggleMobileNav] = useState(false);

  const handleOpenNav = (e) => toggleMobileNav(true);
  const handleCloseNav = (e) => toggleMobileNav(false);

  return (
    <header data-show={show} role="banner">
      <div className="container grid-lg hide-lg">
        <div className="columns">
          <section className="navbar-section column col-2 hide-md" aria-hidden>
            <Link
              href="/"
              tabIndex={-1}
              aria-label="The SRHR Maps logo. Links to homepage."
            >
              <Logo className="logo" />
            </Link>
          </section>
          <div className="column col rows">
            <div className="columns" id="header-top-row">
              <section className="col-ml-auto links" role="navigation">
                <GetOutQuick />
              </section>
            </div>
            <div className="columns" id="header-bottom-row">
              <div className="link-container columns">
                <section className="navbar-section column col links">
                  <Link href="/">Home</Link>
                  <Link href="/about">About Us</Link>
                  <Link href="#contact">Contact</Link>
                </section>
                <section className="navbar-section column col-4 col-md-12 links">
                  <Link
                    href={instagramInfo.site}
                    className="tooltip tooltip-bottom hide-md"
                    data-tooltip={instagramInfo.handle}
                    aria-label="Follow SRHR Hubs on Instagram"
                  >
                    <Instagram />
                  </Link>
                  <Link
                    href={twitterInfo.site}
                    className="tooltip tooltip-bottom hide-md"
                    data-tooltip={twitterInfo.handle}
                    aria-label="Follow SRHR Hubs on Twitter"
                  >
                    <Twitter />
                  </Link>
                  <Link href="/map" prefetch={false}>
                    <button className="btn btn-primary" tabIndex={-1}>
                      <Trans i18nKey={"layout.header.use-the-map"}>
                        Use the map
                      </Trans>
                    </button>
                  </Link>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="off-canvas">
        <Link
          href="/"
          tabIndex={-1}
          aria-label="The SRHR Maps logo. Links to homepage."
        >
          <Logo className="logo show-lg" />
        </Link>
        <button
          className="btn btn-action show-lg"
          onClick={handleOpenNav}
          aria-label="Open navigation menu"
        >
          <i className="icon icon-menu"></i>
        </button>
        <nav className={clsx("off-canvas-sidebar", { active: mobileNavOpen })}>
          <div className="off-canvas-content">
            <section>
              <button
                className="btn btn-action"
                onClick={handleCloseNav}
                aria-label="Close navigation menu"
              >
                <i className="icon icon-cross"></i>
              </button>
            </section>
            <section className="links">
              <Link href="/map">Use the map</Link>
              <Link href="/">Home</Link>
              <Link href="/about">About us</Link>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/contact/contact-us">Contact</a>
              <Link href={twitterInfo.site}>SRHR Hubs Twitter</Link>
              <Link href={instagramInfo.site}>SRHR Hubs Instagram</Link>
            </section>
            <section>
              <GetOutQuick />
            </section>
          </div>
        </nav>
        <div className="off-canvas-overlay" onClick={handleCloseNav} />
      </div>
    </header>
  );
};

export default Header;
