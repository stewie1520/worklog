import { injectable } from "inversify";

import { Employee } from "../../models/employee.model";
import { EmployeeRepository } from "../../ports/repositories/employee.repository";

@injectable()
export class SequelizeEmployeeRepository extends EmployeeRepository {
  public getUserByEmail(email: string): Promise<Employee | null> {
    return Employee.findOne({ where: { email } });
  }

  public createUser(data: Employee): Promise<Employee> {
    return data.save();
  }

  public getUserById(id: string): Promise<Employee | null> {
    return Employee.findByPk(id);
  }
}
