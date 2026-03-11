// dbsClient.ts
import axios from "axios";

const DBS_API =
  import.meta.env.MODE === "development"
    ? "/dbs"
    : "https://dbs.roapp.page";

export const dbsClient = axios.create({
  baseURL: DBS_API
});
