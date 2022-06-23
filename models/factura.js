const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
const Servicio = require("./servicio");
let { Usuario } = require("./user");

class Factura extends Model {}

Factura.init(
  {
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nombreFacturante: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    descuento: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    impuesto: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cufe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Factura",
  },
);

Usuario.hasMany(Factura, { as: "facturas" });
Servicio.hasOne(Factura, { foreignKey: "servicioId" });

Factura.sync();

module.exports = Factura;
