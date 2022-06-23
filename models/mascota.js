const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
const Chip = require("./chip");
let { Usuario } = require("./user");

class Mascota extends Model {}

Mascota.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    raza: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comentarios: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Mascota",
  },
);
Usuario.hasMany(Mascota, { as: "mascotas" });
Mascota.belongsTo(Chip);

Mascota.sync();

module.exports = Mascota;
