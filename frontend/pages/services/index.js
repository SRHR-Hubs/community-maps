import PageLayout from "../../components/layout/page/PageLayout";
import ServiceService from "../../services/ServiceService";
import Link from "next/link";
import PaginationMenu from "../../components/pagination/menu/PaginationMenu";
import useServerI18n from "../../hooks/useServerI18n";


const ServicesHome = ({ services, page, totalPages }) => {
  page = parseInt(page);

  return (
    <PageLayout id="services">
      <h1>Services home</h1>
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
  );
};

export async function getServerSideProps({ query, locale }) {
  const { page = 1 } = query;
  const { results: services, meta } = await ServiceService.getPage(page, {
    fields: ["slug", "name"],
    // published: true,
  });

  const { total_pages: totalPages } = meta;

  return {
    props: {
      page,
      services,
      totalPages,
      ...(await useServerI18n(locale))
    },
  };
}

export default ServicesHome;
