import { Sequelize } from "sequelize";

import { Logger } from "@/shared/logger";

export const connectDatabase = async (
  config: {
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
  },
  logger: Logger,
) => {
  const sequelize = new Sequelize({
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: Number(config.DB_PORT),
    dialect: "postgres",
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
    logging: true,
  });

  await sequelize.authenticate();
  logger.info("Connection has been established successfully.");

  return sequelize;
};
