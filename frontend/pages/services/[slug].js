import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import ServiceService from "../../services/ServiceService";

const ServiceDetailPage = (props) => {
  return (
    <PageLayout>
      {Object.entries(props).map(([key, val]) => (
        <div key={key}>
          <em>{key}:</em>
          {val?.toString()}
        </div>
      ))}
    </PageLayout>
  );
};

export default ServiceDetailPage;

export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  const service = await ServiceService.getServiceBySlug(slug);

  return {
    props: {
      ...service,
      ...(await useServerI18n(locale)),
    },
  };
}

export async function getStaticPaths() {
  const services = await ServiceService.getAllServices({ published: true });
  const paths = services.map(({ slug }) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
}
