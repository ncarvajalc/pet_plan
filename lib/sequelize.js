const { Sequelize } = require("sequelize");
const fs = require("fs");
const sqlPlanes = fs.readFileSync("./sql/queryPlanes.sql", "utf8");
const sqlUsuarios = fs.readFileSync("./sql/queryUsuarios.sql", "utf8");
const sqlTiendas = fs.readFileSync("./sql/queryTiendas.sql", "utf8");
const sqlMascotas = fs.readFileSync("./sql/queryMascotas.sql", "utf8");

const sequelize = new Sequelize("database", "", "", {
  dialect: "sqlite",
  storage: "./database/database.sqlite",
});

sequelize
  .authenticate()
  .then(() => {
    sequelize.query(sqlUsuarios).then(()=> {}).catch(()=>{});
    sequelize.query(sqlPlanes).then(()=> {}).catch(()=>{});
    sequelize.query(sqlTiendas).then(()=> {}).catch(()=>{});
    sequelize.query(sqlMascotas).then(()=> {}).catch(()=>{});
  });

module.exports = sequelize;
