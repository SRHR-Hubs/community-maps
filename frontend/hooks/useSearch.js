import { client } from "../lib/meilisearch";

const useSearch = () => {
    return {
        services: client.index('services'),
        facets: client.index('facets'),
        tags: client.index('tags'),
        geodata: client.index('geodata'),
    }
}

export default useSearch;