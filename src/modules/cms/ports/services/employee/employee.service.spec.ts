import { Container } from "inversify";
import { Sequelize } from "sequelize";

import { TestService } from "@/test/test.service";

import { loadDependencies, loadModels } from "../../../cms.module";
import { EmployeeService } from "./employee.service";

describe(EmployeeService.name, () => {
  let testContainer: Container;
  let dataSource: Sequelize;

  beforeAll(async () => {
    testContainer = TestService.createTestContainer(loadDependencies);
    dataSource = testContainer.get(Sequelize);
    loadModels(dataSource);
    await dataSource.sync({ force: true });
  });

  describe("signUpWithPassword", () => {
    it("should be able to sign up with password", async () => {
      const service = testContainer.get(EmployeeService);
      const params = {
        email: "email",
        password: "password",
        name: "test",
      };
      await service.signUpWithPassword(
        params.email,
        params.password,
        params.name,
      );

      const employee = await dataSource.models.Employee.findOne({
        where: { email: params.email },
      });

      expect(employee).toBeDefined();
    });

    it("should throw error if email is already taken", async () => {
      const service = testContainer.get(EmployeeService);
      const params = {
        email: "email",
        password: "password",
        name: "test",
      };

      await service.signUpWithPassword(
        params.email,
        params.password,
        params.name,
      );

      const result = await service.signUpWithPassword(
        params.email,
        "password",
        "test",
      );

      expect(result.ok).toBe(false);
    });
  });

  afterAll(async () => {
    await dataSource.close();
  });
});
