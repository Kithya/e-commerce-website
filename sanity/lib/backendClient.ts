import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("SANITY_API_TOKEN is not set");
}

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});
