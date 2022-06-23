let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const Cita = require("../models/cita");
const Servicio = require("../models/servicio");
const { Usuario } = require("../models/user");

const schema = Joi.object({
  fechaInicio: Joi.date().required(),
  duracion: Joi.number().positive().required(),
  comentarios: Joi.string().required(),
  UserUsername: Joi.string().required(),
  idServicio: Joi.number().positive().required(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Cita.findAll().then((citas) => {
      res.send(citas);
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

    let idServicio = req.body.idServicio;
    Servicio.findByPk(idServicio).then((servicio) => {
      if (!servicio) {
        return res.status(404).send("No hay un servicio con ese id");
      }
    });

    Cita.create({
      fechaInicio: req.body.fechaInicio,
      duracion: req.body.duracion,
      comentarios: req.body.comentarios,
      UserUsername: username,
      idServicio: idServicio,
    }).then((appointment) => {
      res.send(appointment);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Cita.findByPk(req.params.id).then((appointment) => {
      if (appointment) {
        res.send(appointment);
      } else {
        res.status(404).send("No hay una cita con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Cita.update(req.body, { where: { id: req.params.id } }).then((response) => {
      if (response[0] !== 0) {
        res.send("Cita actualizada");
      } else {
        res.status(404).send("No hay una cita con ese id");
      }
    });
  })
  .delete((req, res) => {
    Cita.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una cita con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
