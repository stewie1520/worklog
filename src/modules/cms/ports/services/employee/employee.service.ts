import { randomUUID } from "crypto";
import { inject, injectable } from "inversify";

import { Logger } from "@/shared/logger";
import { PasswordService } from "@/shared/services/password.service";
import { JwtTokenService, TokenService } from "@/shared/services/token.service";

import { Employee } from "../../../models/employee.model";
import { EmployeeRepository } from "../../repositories/employee.repository";

@injectable()
export class EmployeeService {
  constructor(
    @inject(EmployeeRepository) private employeeRepository: EmployeeRepository,
    @inject(PasswordService) private passwordService: PasswordService,
    @inject(TokenService) private tokenService: JwtTokenService,
    @inject(Logger) private logger: Logger,
  ) {}

  public async signInWithPassword(email: string, password: string) {
    try {
      const user = await this.employeeRepository.getUserByEmail(email);
      if (!user) {
        return {
          ok: false,
          message: "User not found",
        };
      }

      if (
        !(await this.passwordService.comparePassword(password, user.password))
      ) {
        return {
          ok: false,
          message: "Invalid password",
        };
      }

      const token = await this.tokenService.signToken({ id: user.id });
      return {
        ok: true,
        data: {
          token,
        },
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        message: "Error signing in",
      };
    }
  }

  public async signUpWithPassword(
    email: string,
    password: string,
    name: string,
  ) {
    try {
      const user = await this.employeeRepository.getUserByEmail(email);
      if (user) {
        return {
          ok: false,
          message: "User already exists",
        };
      }

      const hashedPassword = await this.passwordService.hashPassword(password);

      const newUser = await this.employeeRepository.createUser(
        new Employee({
          id: randomUUID(),
          name,
          email,
          password: hashedPassword,
        }),
      );

      const token = await this.tokenService.signToken({ id: newUser.id });
      return {
        ok: true,
        data: {
          token,
        },
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        message: "Error signing up",
      };
    }
  }

  public async getPrivateEmployeeData(id: string) {
    try {
      const user = await this.employeeRepository.getUserById(id);
      if (!user) {
        return {
          ok: false,
          message: "User not found",
        };
      }

      return {
        ok: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        message: "Error getting user data",
      };
    }
  }
}
