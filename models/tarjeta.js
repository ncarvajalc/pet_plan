const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");

let { Usuario } = require("./user");

class Tarjeta extends Model {}

Tarjeta.init(
  {
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Tarjeta",
  },
);

Usuario.hasMany(Tarjeta, { as: "tarjetas" });
Tarjeta.sync();

module.exports = Tarjeta;
