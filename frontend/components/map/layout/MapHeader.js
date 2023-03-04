import Link from "next/link";
import Logo from "../../../public/logo-alt.svg";
import { useTranslation } from "next-i18next";

const MapHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="map-header hide-md">
      <section id="logo">
        <Link
          href="/"
          aria-label={t(
            "assistive.label.logo",
            "A secondary variant of the SRHR Map logo, linking back to the homepage."
          )}
        >
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
