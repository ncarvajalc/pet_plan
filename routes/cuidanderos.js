let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const Cuidandero = require("../models/cuidandero");
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

router
  .route("/")
  .get((req, res) => {
    Cuidandero.findAll().then((invoices) => {
      res.send(invoices);
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

    Cuidandero.create({
      username: req.body.username,
      nombre: req.body.nombre,
      password: hashPassword(req.body.password),
      documento: req.body.documento,
      telefono: req.body.telefono,
      correo: req.body.correo,
      codigoProfesionalVerificado: req.body.codigoProfesionalVerificado,
      idTiendaMascotas: idTiendaMascotas,
    }).then((primaryKey) => {
      res.send(primaryKey);
    });
  });

/* /id endpoint*/
router
  .route("/:username")
  .get((req, res) => {
    Cuidandero.findByPk(req.params.username).then((primaryKey) => {
      if (primaryKey) {
        res.send(primaryKey);
      } else {
        res.status(404).send("No hay un cuidandero con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Cuidandero.update(req.body, {
      where: { username: req.params.username },
    }).then((response) => {
      if (response[0] !== 0) {
        res.send("Cuidandero actualizado");
      } else {
        res.status(404).send("No hay un cuidandero con ese id");
      }
    });
  })
  .delete((req, res) => {
    Cuidandero.destroy({ where: { username: req.params.username } }).then(
      (result) => {
        if (result === 0) {
          res.status(404).send("No hay un cuidandero con ese id");
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
