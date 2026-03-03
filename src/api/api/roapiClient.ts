import axios from "axios";

export const roapiClient = axios.create({
  baseURL: "/roapi",
});
