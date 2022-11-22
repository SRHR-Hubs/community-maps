import useAPIFetcher from "../hooks/useAPIFetcher";
import qs from "qs";

// TODO: remove dependency on qs, or treat it as a util?

const fetcher = useAPIFetcher();

export default class BlogService {
  static prefix = "/api/posts";

  async get(endpoint, query) {
    const url = `${BlogService.prefix}/${endpoint ?? ""}?${qs.stringify(query, {
      encodeValuesOnly: true,
    })}`;
    const res = await fetcher(url);
    return await res.json();
  }

  /**
   * Get a list of all post IDs for static generation.
   */
  async getAllPostIds() {
    const ids = [];

    const idQuery = {
      fields: ["id"],
    };

    const { data, meta } = await this.get("", idQuery);

    ids.push(...data.map((post) => post.id));

    // should not run if pageCount is 1
    for (let page = 1; page < meta.pagination.pageCount; page++) {
      const query = {
        ...idQuery,
        pagination: { page },
      };
      const { data: newData } = await this.get("", query);
      ids.push(...newData.map((post) => post.id));
    }

    return ids;
  }

  async getPost(id) {
    const query = {
        //TODO
    };

    return await this.get(id, query)
  }
}
