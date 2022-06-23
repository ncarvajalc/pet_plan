let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const Tarjeta = require("../models/tarjeta");
const { Usuario } = require("../models/user");

const schema = Joi.object({
  numero: Joi.number().positive().required(),
  fechaVencimiento: Joi.date().required(),
  nombre: Joi.string().required(),
  cvv: Joi.number().min(100).max(999).required(),
  UserUsername: Joi.string().required(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Tarjeta.findAll().then((tarjetas) => {
      res.send(tarjetas);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let username = req.body.UserUsername;
    Usuario.findByPk(username).then((user) => {
      if (!user) {
        return res.status(404).send("No hay un usuario con ese username");
      }
    });

    Tarjeta.create({
      numero: req.body.numero,
      fechaVencimiento: req.body.fechaVencimiento,
      nombre: req.body.nombre,
      cvv: req.body.cvv,
      UserUsername: username,
    }).then((tarjeta) => {
      res.send(tarjeta);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Tarjeta.findByPk(req.params.id).then((tarjeta) => {
      if (tarjeta) {
        res.send(tarjeta);
      } else {
        res.status(404).send("No hay una tarjeta con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Tarjeta.update(req.body, { where: { id: req.params.id } }).then(
      (response) => {
        if (response[0] !== 0) {
          res.send("Tarjeta actualizada");
        } else {
          res.status(404).send("No hay una tarjeta con ese id");
        }
      },
    );
  })
  .delete((req, res) => {
    Tarjeta.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una tarjeta con ese id");
      } else {
        res.status(204).send();
      }
    });
  });

function validate(body) {
  return schema.validate(body);
}

module.exports = router;
