let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi").extend(require("@joi/date"));

//Modelo
const Resena = require("../models/resena");
const { Usuario } = require("../models/user");
const Servicio = require("../models/servicio");

const schema = Joi.object({
  puntuacion: Joi.number().positive().required(),
  comentario: Joi.string().min(5).max(300).required(),
  fecha: Joi.date().format("DD-MM-YYYY HH:mm:ss ZZ"),
  usernameUsuario: Joi.string().required(),
  idServicio: Joi.number().positive().required(),
});

router
  .route("/")
  .get((req, res) => {
    Resena.findAll().then((resenas) => {
      res.send(resenas);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let username = req.body.usernameUsuario;
    Usuario.findByPk(username)
      .then((user) => {
        if (!user) {
          return res.status(404).send("No hay un usuario con ese username");
        } else {
          let idServicio = req.body.idServicio;
          Servicio.findByPk(idServicio)
            .then((servicio) => {
              if (!servicio) {
                return res.status(404).send("No hay un servicio con ese id");
              } else {
                Resena.create({
                  puntuacion: req.body.puntuacion,
                  comentario: req.body.comentario,
                  fecha: require("moment")(
                    req.body.fecha,
                    "DD-MM-YYYY HH:mm:ss ZZ",
                  ).format(),
                  usernameUsuario: username,
                  idServicio: idServicio,
                }).then((resena) => {
                  res.send(resena);
                });
              }
            })
            .catch(() => {
              return res.status(404).send("No hay un servicio con ese id");
            });
        }
      })
      .catch(() => {
        return res.status(404).send("No hay un usuario con ese username");
      });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Resena.findByPk(req.params.id).then((resena) => {
      if (resena) {
        res.send(resena);
      } else {
        res.status(404).send("No hay una resena con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let username = req.body.usernameUsuario;
    Usuario.findByPk(username).then((user) => {
      if (!user) {
        return res.status(404).send("No hay un usuario con ese username");
      }
    });

    Resena.update(
      {
        puntuacion: req.body.puntuacion,
        comentario: req.body.comentario,
        fecha: require("moment")(
          req.body.fecha,
          "DD-MM-YYYY HH:mm:ss ZZ",
        ).format(),
        usernameUsuario: username,
      },
      { where: { id: req.params.id } },
    ).then((response) => {
      if (response[0] !== 0) {
        res.send("Resena actualizada");
      } else {
        res.status(404).send("No hay una resena con ese id");
      }
    });
  })
  .delete((req, res) => {
    Resena.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una resena con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
