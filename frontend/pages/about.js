import { Trans } from "next-i18next";
import PageLayout from "../components/layout/page/PageLayout";

import useServerI18n from "../hooks/useServerI18n";
import { SEO } from "../lib/seo";
import PageService from "../services/PageService";

import Link from "next/link";

import { Users, Grab, FileHeart, HeartHandshake } from "lucide-react";

const AboutPage = ({ slug, title, description }) => {
  const seoInfo = {
    title,
    description,
    canonical: slug,
  };
  const valuesContent = [
    {
      key: "community-service",
      icon: Users,
      subtitle: "Community Service",
      text: "Our map has been built by the community for the community.",
    },
    {
      key: "youth-empowerment",
      icon: Grab,
      subtitle: "Youth Empowerment",
      text: "Validating lived experiences and prioritizing autonomy of youth.",
    },
    {
      key: "education-activism",
      icon: FileHeart,
      subtitle: "Commitment to Education & Activism",
      text: "We’re passionate about change, innovation and responding to community needs.",
    },
    {
      key: "co-creation",
      icon: HeartHandshake,
      subtitle: "Co-creation with our Community",
      text: "Working in tandem with our community to address barriers to SRH related care.",
    },
  ];

  return (
    <>
      <SEO {...seoInfo} />
      <PageLayout id="about">
        <section id="our-mission">
          <h1>
            <Trans i18nKey="pages.about.sections.our-mission.title">
              About SRHR Hubs
            </Trans>
          </h1>
          <h2>
            <Trans i18nKey="pages.about.sections.our-mission.mission-title">
              Our Mission
            </Trans>
          </h2>
          <p>
            <Trans i18nKey="pages.about.sections.our-mission.content">
              Advocating for people to have full control in making informed and
              healthy decisions related to their sexual and reproductive health
              and wellness.
            </Trans>
          </p>
        </section>
        <section id="our-values">
          <h2>
            <Trans i18nKey="pages.about.sections.our-values.title">
              Our Values
            </Trans>
          </h2>
          <div className="s-rounded columns">
            {valuesContent.map(({ key, icon: Icon, subtitle, text }) => {
              const i18nKeyPrefix = `pages.about.sections.our-values.${key}`;
              const subtitleKey = `${i18nKeyPrefix}.subtitle`;
              const contentKey = `${i18nKeyPrefix}.content`;
              return (
                <div className="column col-auto col-sm-12" key={key}>
                  <Icon />
                  <h3><Trans i18nKey={subtitleKey}>{subtitle}</Trans></h3>
                  <p><Trans i18nKey={contentKey}>{text}</Trans></p>
                </div>
              );
            })}
            {/* <div className="column col-auto col-sm-12">Cock</div>
                <div className="column col-auto col-sm-12">and</div>
                <div className="column col-auto col-sm-12">Ball</div>
                <div className="column col-auto col-sm-12">Torture</div> */}
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default AboutPage;

export async function getStaticProps({ params, locale }) {
  const fields = ["slug", "title", "description", "content"];

  const pageProps = await PageService.getPageProps("home", {
    fields,
  });

  return {
    props: {
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
  };
}
