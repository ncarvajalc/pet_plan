const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
class Usuario extends Model { }

Usuario.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documento: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "User",
  },
);

function hashPassword(password) {
  let hash = 0,
    i,
    chr;
  if (password.length === 0) {
    return hash;
  }
  for (i = 0; i < password.length; i++) {
    chr = password.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

module.exports = { Usuario, hashPassword };

Usuario.sync();
