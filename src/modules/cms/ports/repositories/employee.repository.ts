import { injectable } from "inversify";

import { Employee } from "../../models/employee.model";

@injectable()
export abstract class EmployeeRepository {
  public abstract getUserByEmail(email: string): Promise<Employee | null>;
  public abstract createUser(data: Employee): Promise<Employee>;
  public abstract getUserById(id: string): Promise<Employee | null>;
}
