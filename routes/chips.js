let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const Chip = require("../models/chip");

const schema = Joi.object({
  numeroId: Joi.number().min(0).required(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Chip.findAll().then((primaryKeys) => {
      res.send(primaryKeys);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Chip.create({
      numeroId: req.body.numeroId,
    }).then((primaryKey) => {
      res.send(primaryKey);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Chip.findByPk(req.params.id).then((primaryKey) => {
      if (primaryKey) {
        res.send(primaryKey);
      } else {
        res.status(404).send("No hay una Chip con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Chip.update(req.body, { where: { id: req.params.id } }).then((response) => {
      if (response[0] !== 0) {
        res.send("Chip actualizada");
      } else {
        res.status(404).send("No hay una Chip con ese id");
      }
    });
  })
  .delete((req, res) => {
    Chip.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una Chip con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
