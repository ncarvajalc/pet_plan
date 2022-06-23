let express = require("express");
let router = express.Router();
const { Usuario, hashPassword } = require("../models/user");

let HandlerGenerator = require("../handlegenerator.js");
HandlerGenerator = new HandlerGenerator();

const Joi = require("joi");
const Tarjeta = require("../models/tarjeta");
const Mascota = require("../models/mascota");

const Servicio = require("../models/servicio");

//Modelo
const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  nombre: Joi.string().required(),
  documento: Joi.number().integer().min(0),
  telefono: Joi.number().integer().min(0).required(),
  correo: Joi.string().required(),
  role: Joi.string(),
});

/* GET users listing. */
router.post("/login", HandlerGenerator.login).post("/signup", (req, res) => {
  Usuario.findByPk(req.body.username).then((user) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (!user) {
      Usuario.create({
        username: req.body.username,
        password: hashPassword(req.body.password),
        nombre: req.body.nombre,
        documento: req.body.documento,
        telefono: req.body.telefono,
        correo: req.body.correo,
        role: req.body.role,
        img: null,
      }).then((new_user) => {
        res.send(new_user);
      });
    } else {
      return res
        .status(400)
        .send({ error: "Ya existe un usuario con ese correo" });
    }
  });
});

router.route("/").get((req, res) => {
  Usuario.findAll().then((usuarios) => {
    res.status(200).send(usuarios);
  });
});

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Usuario.findByPk(req.params.id, {
      include: [
        {
          model: Tarjeta,
          as: "tarjetas",
        },
        {
          model: Mascota,
          as: "mascotas",
        },
        {
          model: Servicio,
          as: "servicios",
        },
      ],
    }).then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send("No hay un usuario con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    req.body.password = hashPassword(req.body.password);
    Usuario.update(req.body, { where: { username: req.params.id } }).then(
      (response) => {
        if (response[0] !== 0) {
          res.send("Usuario actualizado");
        } else {
          res.status(404).send("No hay un usuario con ese id");
        }
      },
    );
  })
  .delete((req, res) => {
    Usuario.destroy({ where: { username: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay un usuario con ese id");
      } else {
        res.status(204).send();
      }
    });
  });

function validate(body) {
  return schema.validate(body);
}
module.exports = router;
