import fetcher from "../hooks/fetch";
import { serialize } from "../lib/mdx-remote";
export default class BlogService {
  static prefix = "/api/blog";

  static async get(endpoint, args) {
    const url = `${this.prefix}/${endpoint}`;
    return fetcher(url, args);
  }

  /**
   * Get a list of all post IDs for static generation.
   */
  static async getAllPosts(params = {}) {
    const { fields = ["slug"] } = params;

    const result = [];

    const query = {
      fields,
      ...params,
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
      ...options,
    };

    const post = await this.get(slug, { query });

    if (!post) {
      throw Error("Getting blog post by slug failed.");
    }

    return post;
  }

  static async getPageProps(slug, query) {
    const post = await this.getPostBySlug(slug, query);
    post.content = await serialize(post.content);
    return {
      ...post,
    }
  }
}
