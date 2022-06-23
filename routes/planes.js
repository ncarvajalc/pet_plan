let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const Plan = require("../models/plan");

const schema = Joi.object({
  nombre: Joi.string().required(),
  descripcion: Joi.string().required(),
  precio: Joi.number().integer().min(0).required(),
  descuento: Joi.number().integer().min(0).required(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Plan.findAll().then((plans) => {
      res.send(plans);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Plan.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      descuento: req.body.descuento,
    }).then((plan) => {
      res.send(plan);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Plan.findByPk(req.params.id).then((plan) => {
      if (plan) {
        res.send(plan);
      } else {
        res.status(404).send("No hay un plan con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Plan.update(req.body, { where: { id: req.params.id } }).then((response) => {
      if (response[0] !== 0) {
        res.send("Plan actualizado");
      } else {
        res.status(404).send("No hay un plan con ese id");
      }
    });
  })
  .delete((req, res) => {
    Plan.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay un plan con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
