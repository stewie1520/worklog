import winston from "winston";

import { Config } from "../config";

const { combine, timestamp, json, errors } = winston.format;

export const createLogger = (config: Config) => {
  const devMode = config.isDev || config.isTest;

  return winston.createLogger({
    level: devMode ? "debug" : "info",
    format: combine(errors({ stack: true }), timestamp(), json()),
    transports: [...(devMode ? [new winston.transports.Console()] : [])],
  });
};

export class Logger extends winston.Logger {}
