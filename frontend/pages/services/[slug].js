import Link from "next/link";
import { Trans } from "next-i18next";
import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import ServiceService from "../../services/ServiceService";
import PageService from "../../services/PageService";
import { Markdown, serialize } from "../../lib/mdx-remote";

const ServiceDetailPage = ({
  service: {
    name,
    location,
    website,
    description,
    blurb,
    slug,
    hours,
    socials,
    email,
    tags,
  },
}) => {
  const seoInfo = {
    title: name,
    description: blurb,
    canonical: "/services/" + slug,
  };

  const showTags = 10;
  const unshownTags = Math.max(0, tags.length - showTags);

  // const showContact = [website, email, socials].some(Boolean)

  return (
    <>
      <SEO {...seoInfo} />
      <PageLayout id="service-detail">
        {/* <div className="columns"> */}
        <section id="details">
          <Link href="/map" prefetch={false}>
            <Trans i18nKey="pages.service-detail.back-to-map">
              Return to map
            </Trans>
          </Link>
          <h1>{name}</h1>
          {location && <p className="address">{location.address}</p>}
          {website && <Link href={website}>{website}</Link>}
          {description && (
            <div className="accordion">
              <input
                type="checkbox"
                name="accordion-checkbox"
                id="details-description"
              />
              <label htmlFor="details-description" className="accordion-header">
                <i className="icon icon-arrow-right mr-2" />
                <h2>
                  <Trans i18nKey="pages.service-detail.sections.details.description">
                    About this Service
                  </Trans>
                </h2>
              </label>
              <div className="accordion-body">
                <Markdown {...description} />
              </div>
            </div>
          )}
          {hours && (
            <div className="accordion">
              <input
                type="checkbox"
                name="accordion-checkbox"
                id="details-hours"
              />
              <label htmlFor="details-hours" className="accordion-header">
                <i className="icon icon-arrow-right mr-2" />
                <h2>
                  <Trans i18nKey="pages.service-detail.sections.details.hours">
                    Hours of Operation
                  </Trans>
                </h2>
              </label>
              <div className="accordion-body">
                <ul>
                  {hours.map(([k, v]) => (
                    <li key={k}>
                      <strong>{k}</strong> {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* {showContact && (
              <div className="accordion">
                <input
                  type="checkbox"
                  name="accordion-checkbox"
                  id="details-contact"
                  hidden
                />
                <label htmlFor="details-contact" className="accordion-header">
                  <i className="icon icon-arrow-right mr-2" />
                  <h2>
                    <Trans>Hours of Operation</Trans>
                  </h2>
                </label>
                <div className="accordion-body">
                  <ul>
                    {Object.entries(hours).map(([k, v]) => (
                      <li key={k}>
                        <strong>{k}</strong> {v}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )} */}
        </section>
        <section id="tags">
          <h2>
            <Trans i18nKey="pages.service-detail.sections.tags.title">
              Tags related to this service:
            </Trans>
          </h2>
          <ul>
            {Object.entries(tags)
              .slice(0, showTags)
              .map(([translation_id, values]) => (
                <li key={`${translation_id}`}>
                  <strong>
                    <Trans i18nKey={`tags.${translation_id}`}>
                      {translation_id}
                    </Trans>
                  </strong>
                  : {values.join(", ")}
                </li>
              ))}
            {unshownTags > 0 && <em>and {unshownTags} others</em>}
          </ul>
        </section>
        {/* </div> */}
      </PageLayout>
    </>
  );
};

export default ServiceDetailPage;

export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  const service = await ServiceService.getServiceBySlug(slug);
  const pageProps = await PageService.getPageProps("service-detail");

  service.description = await serialize(service.description);

  console.log(service.hours)

  return {
    props: {
      service,
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const fields = ["name", "slug"];
  const services = await ServiceService.getAllServices({
    fields,
    published: true,
  });
  const paths = services.map(({ slug }) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
}
