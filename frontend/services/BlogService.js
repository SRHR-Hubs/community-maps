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
