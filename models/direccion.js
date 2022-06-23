const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
const TiendaMascotas = require("./tiendaMascotas");
let { Usuario } = require("./user");

class Direccion extends Model {}

Direccion.init(
  {
    departamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    via: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numeroPrincipal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    letraPrincipal: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    bisPrincipal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    cardinalidadPrincipal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numeroSecundaria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    letraSecundaria: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    complementoSecundaria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cardinalidadSecundaria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Direccion",
  }
);

Usuario.hasMany(Direccion, {as : "direcciones"});
TiendaMascotas.hasOne(Direccion, { foreignKey: "tiendaId" });
Direccion.sync();

module.exports = Direccion;
