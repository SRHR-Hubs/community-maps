import { getServerSideSitemap } from "next-sitemap";
import ServiceService from "../../services/ServiceService";

const Sitemap = () => null;

export async function getServerSideProps(ctx) {
  const now = new Date().toISOString();

  const services = await ServiceService.getAllServices({
    published: true,
    fields: ["slug"],
  });
  const sitemapFields = services.map(({ slug }) => ({
    loc: `${process.env.NEXT_PUBLIC_HOST}/services/${slug}`,
    lastmod: now,
    changefreq: "daily",
    priority: 0.7,
  }));
  return getServerSideSitemap(ctx, sitemapFields);
}

export default Sitemap;
