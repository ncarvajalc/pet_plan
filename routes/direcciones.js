let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const Direccion = require("../models/direccion");
const TiendaMascotas = require("../models/tiendaMascotas");
const { Usuario } = require("../models/user");

const schema = Joi.object({
  departamento: Joi.string().required(),
  ciudad: Joi.string().required(),
  via: Joi.string().required(),
  numeroPrincipal: Joi.number().integer().min(0).required(),
  letraPrincipal: Joi.string().max(1),
  bisPrincipal: Joi.bool().required(),
  complementoPrincipal: Joi.string().max(1),
  cardinalidadPrincipal: Joi.string(),
  numeroSecundaria: Joi.number().integer().min(0).required(),
  letraSecundaria: Joi.string().max(1),
  complementoSecundaria: Joi.number().integer().min(0).required(),
  cardinalidadSecundaria: Joi.string(),
  UserUsername: Joi.string(),
  tiendaId: Joi.number(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Direccion.findAll().then((directions) => {
      res.send(directions);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let username = req.body.UserUsername;
    let tiendaId = req.body.tiendaId;

    if (tiendaId && username) {
      return res
        .status(404)
        .send(
          "No puede haber una dirección de una tienda y un usuario al tiempo",
        );
    } else if (tiendaId) {
      TiendaMascotas.findByPk(tiendaId).then((tienda) => {
        if (!tienda) {
          return res.status(404).send("No hay una tienda con ese id");
        }
      });
    } else if (username) {
      Usuario.findByPk(username).then((user) => {
        if (!user) {
          return res.status(404).send("No hay un usuario con ese username");
        }
      });
    }
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Direccion.create({
      departamento: req.body.departamento,
      ciudad: req.body.ciudad,
      via: req.body.via,
      numeroPrincipal: req.body.numeroPrincipal,
      letraPrincipal: req.body.letraPrincipal,
      bisPrincipal: req.body.bisPrincipal,
      complementoPrincipal: req.body.complementoPrincipal,
      cardinalidadPrincipal: req.body.cardinalidadPrincipal,
      numeroSecundaria: req.body.numeroSecundaria,
      letraSecundaria: req.body.letraSecundaria,
      complementoSecundaria: req.body.complementoSecundaria,
      cardinalidadSecundaria: req.body.cardinalidadSecundaria,
      UserUsername: username,
      tiendaId: tiendaId,
    }).then((direction) => {
      res.send(direction);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Direccion.findByPk(req.params.id).then((direction) => {
      if (direction) {
        res.send(direction);
      } else {
        res.status(404).send("No hay una dirección con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Direccion.update(req.body, { where: { id: req.params.id } }).then(
      (response) => {
        if (response[0] !== 0) {
          res.send("Dirección actualizada");
        } else {
          res.status(404).send("No hay una dirección con ese id");
        }
      },
    );
  })
  .delete((req, res) => {
    Direccion.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una dirección con ese id");
      } else {
        res.status(204).send();
      }
    });
  });

function validate(body) {
  return schema.validate(body);
}

module.exports = router;
