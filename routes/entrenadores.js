let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

let HandlerGenerator = require("../handlegenerator.js");
HandlerGenerator = new HandlerGenerator();

//Modelo
const { Entrenador, hashPassword } = require("../models/entrenador");
const TiendaMascotas = require("../models/tiendaMascotas");

const schema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).max(30).required(),
  name: Joi.string().min(3).max(30).required(),
  documento: Joi.number().positive().required(),
  telefono: Joi.number().positive().required(),
  correo: Joi.string().min(3).max(30).required(),
  codigoProfesionalVerificado: Joi.number().integer().min(0).required(),
  idTiendaMascotas: Joi.number().positive().required(),
});

/* / endpoint*/

router.post("/login", HandlerGenerator.loginEntrenador);

router
  .route("/")
  .get((req, res) => {
    Entrenador.findAll().then((entrenadores) => {
      res.send(entrenadores);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let idTiendaMascotas = req.body.idTiendaMascotas;
    TiendaMascotas.findByPk(idTiendaMascotas).then((tienda) => {
      if (!tienda) {
        return res.status(404).send("No hay una tienda con ese id");
      }
    });

    Entrenador.create({
      username: req.body.username,
      password: hashPassword(req.body.password),
      name: req.body.name,
      documento: req.body.documento,
      telefono: req.body.telefono,
      correo: req.body.correo,
      codigoProfesionalVerificado: req.body.codigoProfesionalVerificado,
      idTiendaMascotas: idTiendaMascotas,
    }).then((entrenador) => {
      res.send(entrenador);
    });
  });

/* /id endpoint*/
router
  .route("/:username")
  .get((req, res) => {
    Entrenador.findByPk(req.params.username).then((entrenador) => {
      if (entrenador) {
        res.send(entrenador);
      } else {
        res.status(404).send("No hay un entrenador con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let idTiendaMascotas = req.body.idTiendaMascotas;
    TiendaMascotas.findByPk(idTiendaMascotas).then((tienda) => {
      if (!tienda) {
        return res.status(404).send("No hay una tienda con ese id");
      }
    });

    Entrenador.update(
      {
        username: req.body.username,
        password: hashPassword(req.body.password),
        name: req.body.name,
        documento: req.body.documento,
        telefono: req.body.telefono,
        correo: req.body.correo,
        codigoProfesionalVerificado: req.body.codigoProfesionalVerificado,
        idTiendaMascotas: idTiendaMascotas,
      },
      { where: { username: req.params.username } },
    ).then((response) => {
      if (response[0] !== 0) {
        res.status(200).send("Entrenador actualizado");
      } else {
        res.status(404).send("No hay un entrenador con ese username");
      }
    });
  })
  .delete((req, res) => {
    Entrenador.destroy({ where: { username: req.params.username } }).then(
      (result) => {
        if (result === 0) {
          res.status(404).send("No hay un entrenador con ese login");
        } else {
          res.status(204).send();
        }
      },
    );
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
