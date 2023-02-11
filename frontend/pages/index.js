import { Trans } from "next-i18next";
import PageLayout from "../components/layout/page/PageLayout";

import useServerI18n from "../hooks/useServerI18n";
import { SEO } from "../lib/seo";
import PageService from "../services/PageService";

import Link from "next/link";
// import BlogRoll from "../components/blog/BlogRoll";
import { instagram } from "../config/next-seo.config";
import { getBlurUrl } from "../lib/cloudinary";
import InstagramFeed from '../components/layout/feed/InstagramFeed'
import SponsorGrid from "../components/sections/about/SponsorGrid";
import isProduction from "../hooks/isProduction";

const IndexPage = ({ slug, title, description, sponsorImages }) => {
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
          <p>A virtual map of sexual and reproductive health services, organizations, and resources in the GTA.</p>
          <h1>What are you searching for?</h1>
        </section>
        <section id="about">
          <div className="columns">
            <div className="column col-sm-12">
              <h2>About the Map</h2>
            </div>
            <div className="column col-sm-12">
              <h2>About the team</h2>
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
      imageData: await getBlurUrl("sponsors/canada_az4xia"),
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

  return {
    props: {
      ...pageProps,
      ...(await useServerI18n(locale)),
      sponsorImages,
    },
    revalidate: 10,
  };
}

export default IndexPage;
