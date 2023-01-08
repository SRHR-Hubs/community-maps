import logo from "../../../public/logo.svg";
import NextImage from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const Footer = (props) => {
  const date = new Date();

  const year = useMemo(() => date.getFullYear(), [date]);

  return (
    <footer>
      <div className="container">
        <div className="columns border-top">
            <div className="column col-4 hide-md">
              <NextImage className="logo" src={logo} />
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
                  <Link href="/terms-and-conditions">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
            <div className="column col-md-12">
              &copy; SRHR Hubs {year}
            </div>
                  </div>
        </div>
    </footer>
  );
};

export default Footer;
