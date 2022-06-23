const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");

class Entrenador extends Model {}

Entrenador.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigoProfesionalVerificado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Entrenador",
  }
);

Entrenador.sync();

function hashPassword(password) {
  let hash = 0,
      i,
      chr;
  if (password.length === 0) {return hash;}
  for (i = 0; i < password.length; i++) {
      chr = password.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

module.exports = { Entrenador, hashPassword };