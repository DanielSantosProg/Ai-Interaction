import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

// Interface para as colunas do modelo
interface ConfigAttributes {
  id: number;
  id_empresa: number;
  db_server: string;
  db_database: string;
  db_user: string;
  db_password: string;
  db_port: number;
  fileDirectory: string;
  api_key: string;
}

// Interface para ID opcional
type ConfigCreationAttributes = Optional<ConfigAttributes, 'id'>;

// Definição da classe do modelo
class Config extends Model<ConfigAttributes, ConfigCreationAttributes> implements ConfigAttributes {
  public id!: number;
  public id_empresa!: number;
  public db_server!: string;
  public db_database!: string;
  public db_user!: string;
  public db_password!: string;
  public db_port!: number;
  public fileDirectory!: string;
  public api_key!: string;
}

Config.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    db_server: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    db_database: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    db_user: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    db_password: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    db_port: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileDirectory: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    api_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'config',
    timestamps: false,
  }
);

export default Config;