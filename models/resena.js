const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
let { Usuario } = require("./user");
let Servicio = require("./servicio");

class Resena extends Model {}

Resena.init(
  {
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Reseña",
  },
);

Usuario.hasMany(Resena, { foreignKey: "usernameUsuario", as: "reseñas"});
Servicio.hasMany(Resena, { foreignKey: "idServicio" });

module.exports = Resena;
