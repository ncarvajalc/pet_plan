let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let sequelize = require("./lib/sequelize");
let cors = require("cors");
let { Usuario } = require("./models/user");
let TiendaMascotas = require("./models/tiendaMascotas");

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let directionsRouter = require("./routes/direcciones");
let invoicesRouter = require("./routes/facturas");
let plansRouter = require("./routes/planes");
let servicesRouter = require("./routes/servicios");
let vetRouter = require("./routes/veterinarios");
let chipsRouter = require("./routes/chips");
let entrenadoresRouter = require("./routes/entrenadores");
let tiendasMascotasRouter = require("./routes/tiendasMascotas");
let citasRouter = require("./routes/citas");
let mascotasRouter = require("./routes/mascotas");
let tarjetasRouter = require("./routes/tarjetas");

let cuidanderosRouter = require("./routes/cuidanderos");

let resenasRouter = require("./routes/resenas");
let limpiadoresRouter = require("./routes/limpiadores");
let suscripcionesRouter = require("./routes/suscripciones");

let app = express();
app.use(cors());
app.options("*", cors());
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "front-react/build")));

app.use("/", indexRouter);
app.get("/testheroku", (req, res) => {
  res.send("HOLA MUNDO");
});
app.use("/users", usersRouter);
app.use("/direcciones", directionsRouter);
app.use("/facturas", invoicesRouter);
app.use("/planes", plansRouter);
app.use("/servicios", servicesRouter);
app.use("/veterinarios", vetRouter);
app.use("/chips", chipsRouter);
app.use("/tiendasMascotas", tiendasMascotasRouter);
app.use("/mascotas", mascotasRouter);
app.use("/tarjetas", tarjetasRouter);
app.use("/chips", chipsRouter);
app.use("/entrenadores", entrenadoresRouter);
app.use("/citas", citasRouter);

app.use("/cuidanderos", cuidanderosRouter);

app.use("/resenas", resenasRouter);
app.use("/limpiadores", limpiadoresRouter);
app.use("/suscripciones", suscripcionesRouter);

module.exports = app;

/**
 * RELACIONES MANY TO MANY
 */

//Relacion many to many de TiendaMascotas y Usuario
Usuario.belongsToMany(TiendaMascotas, { through: "Tienda_Usuario" });
TiendaMascotas.belongsToMany(Usuario, { through: "Tienda_Usuario" });

sequelize.sync();

module.exports = app;
