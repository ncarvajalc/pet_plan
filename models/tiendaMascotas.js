const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");

class TiendaMascotas extends Model {}

TiendaMascotas.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "TiendaMascotas",
  },
);

TiendaMascotas.sync();

module.exports = TiendaMascotas;
