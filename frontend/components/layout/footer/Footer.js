import Logo from "../../../public/logo.svg";
import Link from "next/link";
import { useMemo } from "react";
import { Trans } from "next-i18next";

const Footer = (props) => {
  const date = useMemo(() => new Date());

  const year = useMemo(() => date.getFullYear(), [date]);

  return (
    <footer role="contentinfo">
      <div className="container grid-xl">
        <p id="land-acknowledgement">
          <Trans i18nKey="layout.footer.land-acknowledgement">
            SRHR Hubs would like to acknowledge that our work is done on the
            ancestral and unceded territory of many indigenous peoples across
            Turtle Island, also called North America, who have cared for the
            lands on which we work for time immemorial.
          </Trans>
        </p>
        <div className="columns border-top">
          <div className="column col-4 hide-md">
            <Logo className="logo" />
          </div>
          <div className="column col-md-12">
            <ul className="links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="column col-md-12">
            <ul className="links">
              <li>
                <Link href="/join-us">Join our team</Link>
              </li>
              <li>
                <Link href="/accessibility">Accessibility</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms-of-service">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="column col-md-12">&copy; SRHR Hubs {year}.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
