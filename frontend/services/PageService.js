import fetcher from '../hooks/fetch'

export default class PageService {
    static prefix = '/api/pages';

    static async get(endpoint, args) {
        const url = `${this.prefix}/${endpoint}`;
        return fetcher(url, args);
    }

    static async getAllPages(params) {
        // const {}
    }
}