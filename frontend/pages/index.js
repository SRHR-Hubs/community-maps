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

  return (
    <>
      <SEO {...seoInfo} />
      <PageLayout id="home">
        <section id="search-intro">
          <div className="image-background" />
          <div className="overlay">
            <Link href="/map">
              <h4>
                <Trans i18nKey="pages.home.sections.search-intro.subtitle">
                  A virtual map of sexual and reproductive health services,
                  organizations, and resources.
                </Trans>
              </h4>
              <h1>
                <Trans i18nKey="pages.home.sections.search-intro.title">
                  What are you searching for?
                </Trans>
              </h1>
            </Link>
          </div>
        </section>
        <section id="about">
          <div className="columns">
            <div className="column col-sm-12">
              <h2>
                <Trans i18nKey="pages.home.sections.about.about-the-map">
                  About the Map
                </Trans>
              </h2>
              <div className="image-container">
                <MapPin />
              </div>
              {/* <Image {...otherImages.aboutTheMap} /> */}
              <div className="to-right">
                <Link href="/about#about-the-map">
                  <button className="btn">
                    <Trans i18nKey="pages.home.sections.about.cta">Learn more</Trans> <ChevronRight />
                  </button>
                </Link>
              </div>
            </div>
            <div className="column col-sm-12">
            <h2>
                <Trans i18nKey="pages.home.sections.about.about-the-team">
                  About the team
                </Trans>
              </h2>
              <div className="image-container">
                <HeartHandshake />
              </div>
              <div className="to-right">
                <Link href="/about">
                  <button className="btn">
                  <Trans i18nKey="pages.home.sections.about.cta">Learn more</Trans> <ChevronRight />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* <section id="latest-from-our-blog">
          <h2>
            <Trans i18nKey="pages.home.sections.latest-from-our-blog.title">
              Latest from our blog
            </Trans>
          </h2>
          <BlogRoll />
        </section> */}
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
