const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
const Suscripcion = require("./suscripcion");

class Plan extends Model {}

Plan.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Plan",
  },
);

Plan.hasOne(Suscripcion, { as: "plan" });

Plan.sync();

module.exports = Plan;
