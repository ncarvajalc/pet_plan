let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const Servicio = require("../models/servicio");
const { Usuario } = require("../models/user");

const schema = Joi.object({
  tipo: Joi.string().required(),
  descripcion: Joi.string().required(),
  UserUsername: Joi.string().required(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Servicio.findAll().then((services) => {
      res.send(services);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let username = req.body.UserUsername;

    if (username) {
      Usuario.findByPk(username).then((user) => {
        if (!user) {
          return res.status(404).send("No hay un usuario con ese username");
        }
      });
    }

    Servicio.create({
      tipo: req.body.tipo,
      descripcion: req.body.descripcion,
      UserUsername: username,
      direccion: null,
    }).then((servicio) => {
      res.send(servicio);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Servicio.findByPk(req.params.id).then((servicio) => {
      if (servicio) {
        res.send(servicio);
      } else {
        res.status(404).send("No hay un servicio con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Servicio.update(req.body, { where: { id: req.params.id } }).then(
      (response) => {
        if (response[0] !== 0) {
          res.send("Servicio actualizado");
        } else {
          res.status(404).send("No hay un servicio con ese id");
        }
      },
    );
  })
  .delete((req, res) => {
    Servicio.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay un servicio con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
