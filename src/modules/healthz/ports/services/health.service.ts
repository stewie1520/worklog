import { inject, injectable } from "inversify";
import { Sequelize } from "sequelize";

@injectable()
export class HealthService {
  constructor(@inject(Sequelize) private readonly db: Sequelize) {}

  public async checkLive() {
    return {
      ok: true,
      message: "Service is live",
    };
  }

  public async checkReady() {
    const dbOk = await this.db
      .authenticate({ retry: { max: 3 } })
      .then(() => true)
      .catch(() => false);

    if (!dbOk) {
      return {
        ok: false,
        message: "Database is not healthy",
      };
    }

    return {
      ok: true,
      message: "Service is ready",
    };
  }
}
