import Empresa from './Empresa';
import User from './User';
import Config from './Config';

// Uma Empresa pode ter muitos Usuários
Empresa.hasMany(User, {
  foreignKey: 'id_empresa',
  as: 'usuarios',
});

// Um Usuário pertence a uma Empresa
User.belongsTo(Empresa, {
  foreignKey: 'id_empresa',
  as: 'empresa',
});

// Uma Empresa pode ter uma Configuração
Empresa.hasOne(Config, {
  foreignKey: 'id_empresa',
  as: 'configuracao',
});

// Uma Configuração pertence a uma Empresa
Config.belongsTo(Empresa, {
  foreignKey: 'id_empresa',
  as: 'empresa',
});

export { Empresa, User, Config };
