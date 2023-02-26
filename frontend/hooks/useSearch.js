import { client } from "../lib/meilisearch";

const useSearch = () => {
    return {
        services: client.index('services'),
        facets: client.index('facets')
    }
}

export default useSearch;