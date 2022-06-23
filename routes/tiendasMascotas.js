let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const TiendaMascotas = require("../models/tiendaMascotas");

const schema = Joi.object({
  nombre: Joi.string().min(10).required(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    TiendaMascotas.findAll().then((primaryKeys) => {
      res.send(primaryKeys);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    TiendaMascotas.create({
      nombre: req.body.nombre,
    }).then((primaryKey) => {
      res.send(primaryKey);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    TiendaMascotas.findByPk(req.params.id).then((primaryKey) => {
      if (primaryKey) {
        res.send(primaryKey);
      } else {
        res.status(404).send("No hay una tiendaMascotas con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    TiendaMascotas.update(req.body, { where: { id: req.params.id } }).then(
      (response) => {
        if (response[0] !== 0) {
          res.send("TiendaMascotas actualizada");
        } else {
          res.status(404).send("No hay una tiendaMascotas con ese id");
        }
      },
    );
  })
  .delete((req, res) => {
    TiendaMascotas.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una tiendaMascotas con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
