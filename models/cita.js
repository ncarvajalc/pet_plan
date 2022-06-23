const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
const TiendaMascotas = require("./tiendaMascotas");

class Cita extends Model {}

Cita.init(
  {
    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comentarios: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idServicio: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Cita",
  },
);

TiendaMascotas.hasMany(Cita, { foreignKey: "idTiendaMascotas" });
Cita.sync();

module.exports = Cita;
