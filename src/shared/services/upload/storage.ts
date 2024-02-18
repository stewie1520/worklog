import { Storage } from "@google-cloud/storage";

import { Config } from "@/shared/config";

export const createStorage = (config: Config) => {
  return new Storage({
    credentials: config.GCP_CREDENTIALS,
  });
};
