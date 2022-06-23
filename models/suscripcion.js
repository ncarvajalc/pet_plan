const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
let { Usuario } = require("./user");

class Suscripcion extends Model { }

Suscripcion.init(
  {
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    siguientePago: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Suscripcion",
  },
);

Usuario.hasOne(Suscripcion, { as: "suscripcion" });

Suscripcion.sync();

module.exports = Suscripcion;
