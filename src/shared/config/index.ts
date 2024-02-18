import { config as dotenvConfig } from "dotenv";
import { injectable } from "inversify";
import Vault from "node-vault";
import { z } from "zod";

const schema = z.object({
  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.preprocess(Number, z.number()),
  JWT_SECRET: z.string(),
  GCP_CREDENTIALS: z.any(),
});

@injectable()
export class Config {
  readonly DB_NAME!: string;
  readonly DB_USERNAME!: string;
  readonly DB_PASSWORD!: string;
  readonly DB_HOST!: string;
  readonly DB_PORT!: number;

  readonly JWT_SECRET!: string;
  readonly GCP_CREDENTIALS!: Record<string, string>;

  constructor(envs: Record<string, unknown>) {
    const parsedProcessEnv = schema.safeParse(envs);
    if (!parsedProcessEnv.success) {
      throw new Error(parsedProcessEnv.error.message);
    }

    Object.assign(this, parsedProcessEnv.data);
  }

  public get isTest() {
    return process.env.NODE_ENV === "test";
  }

  public get isDev() {
    return process.env.NODE_ENV === "development";
  }
}

export const loadConfig = async () => {
  dotenvConfig({ path: "../.env" });
  const envs = await readVaults();
  return new Config(envs);
};

/**
 * Extracts environment variables from vault
 */
const readVaults = async (): Promise<z.infer<typeof schema>> => {
  try {
    const roleId = process.env.VAULT_ROLE_ID;
    const secretId = process.env.VAULT_SECRET_ID;

    const vault = Vault({
      apiVersion: "v1",
      endpoint: process.env.VAULT_ADDR,
    });

    const login = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });

    vault.token = login.auth.client_token;

    const [{ data: pgEnv }, { data: commonEnv }, { data: gcpKey }] =
      await Promise.all([
        vault.read("kv/data/pg/webapp"),
        vault.read("kv/data/common/webapp"),
        vault.read("kv/data/gcp/key"),
      ]);

    return {
      DB_NAME: pgEnv.db_name,
      DB_USERNAME: pgEnv.db_username,
      DB_PASSWORD: pgEnv.db_password,
      DB_HOST: pgEnv.db_host,
      DB_PORT: pgEnv.db_port,
      JWT_SECRET: commonEnv.jwt_secret,
      GCP_CREDENTIALS: gcpKey,
    };
  } catch (e: unknown) {
    console.error("Error extracting env from vault", (e as Error).message);
    throw e;
  }
};
