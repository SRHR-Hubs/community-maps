import PageLayout from "../components/layout/page/PageLayout";
import { Trans } from "next-i18next";
import { Markdown, serialize } from "../lib/mdx-remote";

import { SEO } from "../lib/seo";
import PageService from "../services/PageService";
import useServerI18n from "../hooks/useServerI18n";

import InstagramFeed from "../components/layout/feed/InstagramFeed";
import { instagram } from "../config/next-seo.config";
import Link from "next/link";
import BlogRoll from "../components/blog/BlogRoll";

const IndexPage = ({ slug, title, description, content }) => {
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
        <section id="latest-from-our-blog">
          <h2>
            <Trans i18nKey="pages.home.sections.latest-from-our-blog.title">
              Latest from our blog
            </Trans>
          </h2>
          <BlogRoll />
        </section>
        <section id="latest-from-our-insta">
          <h2>
            <Trans i18nKey="pages.home.sections.latest-from-our-insta.title">
              Latest from our Insta <Link href={instagram.site}>@SRHRMap</Link>
            </Trans>
          </h2>
          {/* <InstagramFeed /> */}
        </section>
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ params, locale }) {
  const fields = ["slug", "title", "description", "content"];

  const page = await PageService.getPageBySlug("home", {
    fields,
  });

  return {
    props: {
      ...page,
      ...(await useServerI18n(locale)),
    },
  };
}

export default IndexPage;
