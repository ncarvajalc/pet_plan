const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
const Cita = require("./cita");
let { Usuario } = require("./user");

class Servicio extends Model {}

Servicio.init(
  {
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Servicio",
  },
);

Usuario.hasMany(Servicio, { as: "servicios" });
Servicio.hasMany(Cita, { foreignKey: "idServicio" });

module.exports = Servicio;
