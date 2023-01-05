import fetcher from "../hooks/fetch";
export default class BlogService {
  static prefix = "/api/blog";

  static async get(endpoint, args) {
    const url = `${this.prefix}/${endpoint}`;
    return fetcher(url, args);
  }

  /**
   * Get a list of all post IDs for static generation.
   */
  static async getAllPosts(params) {
    const { fields = ["slug"] } = params ?? {};

    const result = [];

    const query = {
      fields,
    };

    let next = null;

    do {
      const { results, meta } = await this.get("", { query });
      result.push(...results);
      next = meta.next;
    } while (next !== null);

    return result;
  }

  static async getPostBySlug(slug, options) {
    const query = {
      slug,
      ...options,
    };

    const { results, meta } = await this.get("", { query });

    if (meta?.count !== 1) {
      throw Error("Getting blog post by slug failed.");
    }

    const [post] = results;

    return post;
  }
}
