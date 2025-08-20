import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface EmpresaAttributes {
  id: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
}

// Interface para ID opcional
type EmpresaCreationAttributes = Optional<EmpresaAttributes, 'id'>;

// Definição da classe do modelo
class Empresa extends Model<EmpresaAttributes, EmpresaCreationAttributes> implements EmpresaAttributes {
  public id!: number;
  public razao_social!: string;
  public nome_fantasia!: string;
  public cnpj!: string;
}

Empresa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    razao_social: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    nome_fantasia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'empresa',
    timestamps: false,
  }
);

export default Empresa;
