let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");
const Chip = require("../models/chip");

//Modelo
const Mascota = require("../models/mascota");
const { Usuario } = require("../models/user");

const schema = Joi.object({
  nombre: Joi.string().required(),
  raza: Joi.string().required(),
  edad: Joi.number().positive().required(),
  comentarios: Joi.string(),
  UserUsername: Joi.string().required(),
  ChipId: Joi.number(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Mascota.findAll()
      .then((mascotas) => {
        res.send(mascotas);
      })
      .catch((err) => res.send(err));
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let username = req.body.UserUsername;
    let numeroId = req.body.ChipId;
    let arregloPromesas = [Usuario.findByPk(username), Chip.findByPk(numeroId)];
    Promise.all(arregloPromesas).then((promesas) => {
      if (!promesas[0]) {
        return res.status(404).send("No hay un usuario con ese username");
      }

      if (!promesas[1]) {
        return res.status(404).send("No hay un Chip con ese id");
      }
    });

    Mascota.create({
      nombre: req.body.nombre,
      raza: req.body.raza,
      edad: req.body.edad,
      comentarios: req.body.comentarios,
      UserUsername: username,
      ChipId: numeroId,
      img: null,
    }).then((primaryKey) => {
      res.send(primaryKey);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Mascota.findByPk(req.params.id).then((primaryKey) => {
      if (primaryKey) {
        res.send(primaryKey);
      } else {
        res.status(404).send("No hay una mascota con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Mascota.update(req.body, { where: { id: req.params.id } }).then(
      (response) => {
        if (response[0] !== 0) {
          res.send("Mascota actualizada");
        } else {
          res.status(404).send("No hay un mascota con ese id");
        }
      },
    );
  })
  .delete((req, res) => {
    Mascota.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay un mascota con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
