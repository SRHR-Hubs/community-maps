import { serialize } from "../lib/mdx-remote";
import fetcher from "../hooks/fetch";

export default class PageService {
  static prefix = "/api/pages";

  static async get(endpoint, args) {
    const url = `${this.prefix}/${endpoint}`;
    return fetcher(url, args);
  }

  static async getPage(page, params = {}) {
    const query = {
      ...params,
      page,
    };

    return this.get("", { query });
  }

  static async getAllPages(params = {}) {
    const result = [];

    let totalPages = Infinity;

    for (let page = 1; page <= totalPages; page++) {
      const { results, meta } = await this.getPage(page, params);
      result.push(...results);
      if (page === 1) {
        totalPages = meta.total_pages;
      }
    }

    return result;
  }

  static async getPageBySlug(slug, options) {
    const query = {
      ...options,
    };

    const page = await this.get(slug, { query });

    if (!page) {
      throw Error(`Getting page with slug ${slug} failed.`);
    }

    return page;
  }

  static async getPageProps(slug, query) {
    const page = await this.getPageBySlug(slug, query);
    if (page.content) {
      const { content } = page;

      // NOTE: as of ES2015, objects with string keys <<should>>
      // keep their insertion order:
      // https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order

      page.content = {};
      for (const [section_id, text] of Object.entries(content)) {
        if (section_id.endsWith("content")) {
          page.content[section_id] = await serialize(text);
        } else {
          // page.content[section_id] = text;
        }
      }
    }
    return {
      ...page,
    };
  }
}
