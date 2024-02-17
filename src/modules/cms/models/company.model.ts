import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import { Employee } from "./employee.model";
import { Project } from "./project.model";

export class Company extends Model<
  InferAttributes<Company>,
  InferCreationAttributes<Company>
> {
  declare id: string;
  declare name: string;
  declare baseDomain: string;
  declare ownerId: ForeignKey<Employee["id"]>;

  declare owner?: NonAttribute<Employee>;

  declare projects?: NonAttribute<Project[]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {
    projects: Association<Company, Project>;
  };
}

export const initCompany = (db: Sequelize) => {
  Company.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      baseDomain: {
        type: new DataTypes.STRING(128),
        unique: true,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "companies",
      sequelize: db,
    },
  );
};
