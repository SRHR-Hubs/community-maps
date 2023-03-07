import { useContext } from "react";
import { OmnisearchContext } from "../context/providers/OmnisearchProvider";

const useOmnisearch = () => useContext(OmnisearchContext);

export default useOmnisearch;
