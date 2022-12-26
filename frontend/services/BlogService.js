import useAPIFetcher from "../hooks/useAPIFetcher";
import useQuery from "../hooks/useQuery";

const fetcher = useAPIFetcher();
const q = useQuery();

export default class BlogService {
  static prefix = "/api/blog";

  static async get(endpoint, query) {
    const url = `${this.prefix}/${endpoint}?${q(query)}`;
    const res = await fetcher(url);
    return await res.json();
  }

  /**
   * Get a list of all post IDs for static generation.
   */
  static async getAllPostIds() {
    const ids = [];

    let page = 1;

    const idQuery = {
      fields: "id",
      page,
    };

    const { results: data, meta } = await this.get("", idQuery);

    ids.push(...data.map((post) => post.id));

    // should not run if pageCount is 1
    for (page; page < meta.total_pages; page++) {
      const query = {
        ...idQuery,
        page
      };
      const { results: newData } = await this.get("", query);
      ids.push(...newData.map((post) => post.id));
    }

    return ids;
  }

  static async getPost(id) {
    const query = {
      //TODO
    };

    return await this.get(id, query);
  }
}
