import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface UserAttributes {
  id?: number;
  id_empresa: number;
  nome: string;
  cargo: string;
  tipo_usuario: string; 
  senha?: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public id_empresa!: number;
  public nome!: string;
  public cargo!: string;
  public tipo_usuario!: string;
  public senha!: string;
}

User.init(
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
        references: {
            model: 'empresa',
            key: 'id',
        },
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cargo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tipo_usuario: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'usuario',
    timestamps: false,
  }
);

export default User;