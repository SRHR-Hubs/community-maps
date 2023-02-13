import Link from "next/link";
import Logo from "../../../public/logo-alt.svg";

const MapHeader = () => {
  return (
    <header role="banner" className="map-header">
      <section id="logo">
        <Link href="/">
          <Logo className="logo" />
        </Link>
      </section>
      <section className="links">
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>
        <Link href="/#contact">Contact</Link>
      </section>
    </header>
  );
};

export default MapHeader;
