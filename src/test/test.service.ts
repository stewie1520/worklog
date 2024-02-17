import { randomUUID } from "crypto";
import { Container } from "inversify";
import { DataType, newDb } from "pg-mem";
import { Sequelize } from "sequelize";

import { Config } from "@/shared/config";
import { sharedServicesLoader } from "@/shared/services/shared-services.module";
import { DependencyLoader } from "@/types";

export class TestService {
  static createTestContainer(...dependencyLoaders: DependencyLoader[]) {
    const testConfig = new Config({
      DB_NAME: process.env.DB_NAME,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: Number(process.env.DB_PORT),
      JWT_SECRET: process.env.JWT_SECRET,
    });

    const testContainer = new Container();
    testContainer.bind(Config).toConstantValue(testConfig);

    const sequelize = this.connectDb();
    testContainer.bind(Sequelize).toConstantValue(sequelize);

    testContainer.load(
      sharedServicesLoader(testConfig),
      ...dependencyLoaders.map((depLoader) => depLoader(testConfig)),
    );

    return testContainer;
  }

  static connectDb() {
    const db = newDb();

    db.registerExtension("uuid-ossp", (schema) => {
      schema.registerFunction({
        name: "uuid_generate_v4",
        returns: DataType.uuid,
        implementation: randomUUID,
      });
    });

    const sequelize = new Sequelize({
      dialect: "postgres",
      dialectModule: db.adapters.createPg(),
      logging: false,
    });

    return sequelize;
  }
}
