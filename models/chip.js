const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");
//let { Mascota } = require("./mascota");
//TODO: Revisar
class Chip extends Model {}

Chip.init(
  {
    numeroId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Chip",
  },
);

Chip.sync();

module.exports = Chip;
