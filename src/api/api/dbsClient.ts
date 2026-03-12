import axios from "axios";

export const dbsClient = axios.create({
  baseURL: "/dbs",
});
