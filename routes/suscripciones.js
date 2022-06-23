let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");
const { Plan } = require("../models/plan");

//Modelo
const Suscripcion = require("../models/suscripcion");
const { User } = require("../models/user");

const schema = Joi.object({
  fechaInicio: Joi.date().required(),
  siguientePago: Joi.date().required(),
  suscripcionUsername: Joi.string().required(),
  planId: Joi.number().positive().required(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Suscripcion.findAll().then((invoices) => {
      res.send(invoices);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Suscripcion.create({
      fechaInicio: req.body.fechaInicio,
      siguientePago: req.body.siguientePago,
      suscripcionUsername: req.body.suscripcionUsername,
      planId: req.body.planId,
    }).then((invoice) => {
      res.send(invoice);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Suscripcion.findByPk(req.params.id).then((primaryKey) => {
      if (primaryKey) {
        res.send(primaryKey);
      } else {
        res.status(404).send("No hay una suscripcion con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Suscripcion.update(req.body, { where: { id: req.params.id } }).then(
      (response) => {
        if (response[0] !== 0) {
          res.send("Suscripcion actualizada");
        } else {
          res.status(404).send("No hay una suscripcion con ese id");
        }
      },
    );
  })
  .delete((req, res) => {
    Suscripcion.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una suscripcion con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;

