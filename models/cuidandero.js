const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
const TiendaMascotas = require("./tiendaMascotas");

class Cuidandero extends Model {}

Cuidandero.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
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
    modelName: "Limpiador",
  },
);

TiendaMascotas.hasMany(Cuidandero, { foreignKey: "idTiendaMascotas" });

Cuidandero.sync();

module.exports = Cuidandero;
