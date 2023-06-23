import { Trans } from "next-i18next";
import PageLayout from "../components/layout/page/PageLayout";

import useServerI18n from "../hooks/useServerI18n";
import { SEO } from "../lib/seo";
import PageService from "../services/PageService";

import Link from "next/link";
// import BlogRoll from "../components/blog/BlogRoll";
import { instagram } from "../config/next-seo.config";
import { getBlurUrl } from "../lib/cloudinary";
import InstagramFeed from "../components/layout/feed/InstagramFeed";
import SponsorGrid from "../components/sections/about/SponsorGrid";
import isProduction from "../hooks/isProduction";
import Image from "../components/image";
import toImageProps from "../hooks/toImageProps";
import { ChevronRight, HeartHandshake, MapPin } from "lucide-react";
import { UndrawIcon, useUndraw } from "../lib/undraw";

const IndexPage = ({
  slug,
  title,
  description,
  sponsorImages,
  otherImages,
}) => {
  const seoInfo = {
    title,
    description,
    canonical: slug,
  };

  useUndraw();

  return (
    <>
      <SEO {...seoInfo} />
      <PageLayout id="home">
        <section id="hero">
          <div className="columns">
            <div className="column col-7 col-md-12">
              <span className="subtitle">Welcome to</span>
              <h1>Sexual and Reproductive Health and Rights (SRHR) Hubs</h1>
              <p>
                We provide a living, breathing, virtual map that details{" "}
                <strong>
                  sexual and reproductive health services in Canada.
                </strong>
              </p>
              <a className="btn btn-primary cta">Visit the map</a>
            </div>
            <div className="column col hide-md">
              <UndrawIcon name="Online test"/>
            </div>
          </div>
        </section>
        <section id="about-the-project">
          <div className="columns round-card">
            <div className="column col-8 col-md-12">
              <h2>About the project</h2>
              <p>
                SRHR Hubs was born out of the intense service shortages and
                limited information available to those seeking Sexual and
                Reproductive Health services during the height of the COVID-19
                pandemic.
              </p>
              <a href="" className="btn btn-secondary">Learn more</a>
            </div>
            <div className="column col hide-md">
              <UndrawIcon name="Map dark" />
            </div>
          </div>
        </section>
        <section id="about-us">
          <div className="columns">
            <div className="column col-5 col-md-12">
              <h2>About us</h2>
              <div className="hide-md">
                <UndrawIcon name="Team"/>
              </div>
            </div>
            <div className="column col col-md-12 round-card">
              <h3>Our Vision</h3>
              <p>For all people to have full control to make informed decisions about their sexual and reproductive health and wellness.</p>
              <h3>Our Mission</h3>
              <p>To advocate for and advance Sexual and Reproductive Health and Rights.</p>
              <a href="" className="btn btn-primary">Learn more</a>
            </div>
          </div>
        </section>
        <section id="latest-from-our-insta">
          <h2>
            <Trans i18nKey="pages.home.sections.latest-from-our-insta.title">
              Latest from our Insta <Link href={instagram.site}>@SRHRMap</Link>
            </Trans>
          </h2>
          {isProduction() && <InstagramFeed />}
        </section>
        <section id="our-sponsors">
          <h2>
            <Trans i18nKey="pages.home.sections.our-sponsors.title">
              Funded by:
            </Trans>
          </h2>
          <SponsorGrid sponsorImages={sponsorImages} />
        </section>
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ params, locale }) {
  const fields = ["slug", "title", "description", "content"];

  const pageProps = await PageService.getPageProps("home", {
    fields,
  });

  const sponsorImages = {
    goc: {
      name: "Government of Canada",
      imageData: await getBlurUrl("sponsors/canada-2"),
    },
    oxfam: {
      name: "Oxfam Canada",
      imageData: await getBlurUrl("sponsors/oxfam_lphpla"),
    },
    soc: {
      name: "School of Cities at the University of Toronto",
      imageData: await getBlurUrl("sponsors/soc_tr0svv"),
    },
    yic: {
      name: "Youth Impact Challenge",
      imageData: await getBlurUrl("sponsors/yic_qhppmk"),
    },
  };

  const otherImages = {
    aboutTheMap: toImageProps({
      ...(await getBlurUrl("media/map_screenshot.png")),
      alt: "A screenshot of the Community Map in action, with dark green map markers dotting a map of Toronto.",
    }),
    aboutTheTeam: toImageProps({
      ...(await getBlurUrl("branding/banner_torrk9")),
      alt: "A banner that reads 'SRHR Hubs'.",
    }),
  };

  return {
    props: {
      ...pageProps,
      ...(await useServerI18n(locale)),
      sponsorImages,
      otherImages,
    },
    revalidate: 10,
  };
}

export default IndexPage;
