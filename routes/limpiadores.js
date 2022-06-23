let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

let HandlerGenerator = require("../handlegenerator.js");
HandlerGenerator = new HandlerGenerator();

//Modelo
const Limpiador = require("../models/limpiador");
const TiendaMascotas = require("../models/tiendaMascotas");
const { hashPassword } = require("../models/user");

const schema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  nombre: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).max(30).required(),
  documento: Joi.number().positive().required(),
  telefono: Joi.number().positive().required(),
  correo: Joi.string().min(3).max(30).required(),
  codigoProfesionalVerificado: Joi.number().positive().required(),
  idTiendaMascotas: Joi.number().positive().required(),
});

/* / endpoint*/

router.post("/login", HandlerGenerator.loginLimpiador);

router
  .route("/")
  .get((req, res) => {
    Limpiador.findAll().then((limpiadores) => {
      res.send(limpiadores);
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

    Limpiador.create({
      username: req.body.username,
      nombre: req.body.nombre,
      password: hashPassword(req.body.password),
      documento: req.body.documento,
      telefono: req.body.telefono,
      correo: req.body.correo,
      codigoProfesionalVerificado: req.body.codigoProfesionalVerificado,
      idTiendaMascotas: idTiendaMascotas,
    }).then((limpiador) => {
      res.send(limpiador);
    });
  });

/* /id endpoint*/
router
  .route("/:username")
  .get((req, res) => {
    Limpiador.findByPk(req.params.username).then((limpiador) => {
      if (limpiador) {
        res.send(limpiador);
      } else {
        res.status(404).send("No hay un limpiador con ese username");
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

    Limpiador.update(
      {
        username: req.body.username,
        nombre: req.body.nombre,
        password: hashPassword(req.body.password),
        documento: req.body.documento,
        telefono: req.body.telefono,
        correo: req.body.correo,
        codigoProfesionalVerificado: req.body.codigoProfesionalVerificado,
        idTiendaMascotas: idTiendaMascotas,
      },
      { where: { username: req.params.username } },
    ).then((response) => {
      if (response[0] !== 0) {
        res.status(200).send("Limpiador actualizado");
      } else {
        res.status(404).send("No hay un limpiador con ese username");
      }
    });
  })
  .delete((req, res) => {
    Limpiador.destroy({ where: { username: req.params.username } }).then(
      (result) => {
        if (result === 0) {
          res.status(404).send("No hay un limpiador con ese login");
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
