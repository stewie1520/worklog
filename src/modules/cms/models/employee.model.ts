import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Employee extends Model<
  InferAttributes<Employee>,
  InferCreationAttributes<Employee>
> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initEmployee = (db: Sequelize) => {
  Employee.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(128),
        unique: true,
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "employees",
      sequelize: db,
    },
  );
};
