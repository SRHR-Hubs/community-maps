import Link from "next/link";
import PageLayout from "../../components/layout/page/PageLayout";
import PaginationMenu from "../../components/pagination/menu/PaginationMenu";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import PageService from "../../services/PageService";
import ServiceService from "../../services/ServiceService";

const ServicesHome = ({ services, page, totalPages, title, slug }) => {
  page = parseInt(page);

  return (
    <>
      <SEO title={title} canonical={slug} />
      <PageLayout id={slug} renderContactSection={false}>
        <h1>{title}</h1>
        <ul role="list">
          {services.map(({ slug, name }) => (
            <li key={slug}>
              <Link href={`/services/${slug}`}>{name}</Link>
            </li>
          ))}
        </ul>
        <PaginationMenu
          pathname="/services"
          page={page}
          totalPages={totalPages}
        />
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ query, locale }) {
  const { page = 1 } = query ?? {};
  const { results: services, meta } = await ServiceService.getPage(page, {
    fields: ["slug", "name"],
    published: true,
  });

  const { total_pages: totalPages } = meta;

  const pageProps = await PageService.getPageProps("services");

  return {
    props: {
      page,
      services,
      totalPages,
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
    revalidate: 10,
  };
}

export default ServicesHome;
