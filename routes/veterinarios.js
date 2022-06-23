let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

let HandlerGenerator = require("../handlegenerator.js");
HandlerGenerator = new HandlerGenerator();

//Modelo
const { Veterinario, hashPassword } = require("../models/veterinario");
const TiendaMascotas = require("../models/tiendaMascotas");

const schema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).max(30).required(),
  name: Joi.string().min(3).max(30).required(),
  documento: Joi.number().positive().required(),
  telefono: Joi.number().positive().required(),
  correo: Joi.string().min(3).max(30).required(),
  codigoProfesionalVerificado: Joi.number().integer().min(0).required(),
  idTiendaMascotas: Joi.number().positive().required(),
});

/* / endpoint*/

router.post("/login", HandlerGenerator.loginVeterinario);

router
  .route("/")
  .get((req, res) => {
    Veterinario.findAll().then((veterinarios) => {
      res.send(veterinarios);
    });
  })
  .post((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let idTiendaMascotas = req.body.idTiendaMascotas;
    TiendaMascotas.findByPk(idTiendaMascotas).then((tienda) => {
      if (!tienda) {
        return res.status(404).send("No hay una tienda con ese id");
      }
    });

    Veterinario.create({
      username: req.body.username,
      password: hashPassword(req.body.password),
      name: req.body.name,
      documento: req.body.documento,
      telefono: req.body.telefono,
      correo: req.body.correo,
      codigoProfesionalVerificado: req.body.codigoProfesionalVerificado,
      idTiendaMascotas: idTiendaMascotas,
    }).then((veterinario) => {
      res.send(veterinario);
    });
  });

/* /id endpoint*/
router
  .route("/:username")
  .get((req, res) => {
    Veterinario.findByPk(req.params.username).then((veterinario) => {
      if (veterinario) {
        res.send(veterinario);
      } else {
        res.status(404).send("No hay un veterinario con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let idTiendaMascotas = req.body.idTiendaMascotas;
    TiendaMascotas.findByPk(idTiendaMascotas).then((tienda) => {
      if (!tienda) {
        return res.status(404).send("No hay una tienda con ese id");
      }
    });

    Veterinario.update(
      {
        username: req.body.username,
        password: hashPassword(req.body.password),
        name: req.body.name,
        documento: req.body.documento,
        telefono: req.body.telefono,
        correo: req.body.correo,
        codigoProfesionalVerificado: req.body.codigoProfesionalVerificado,
        idTiendaMascotas: idTiendaMascotas,
      },
      { where: { username: req.params.username } },
    ).then((response) => {
      if (response[0] !== 0) {
        res.status(200).send("Veterinario actualizado");
      } else {
        res.status(404).send("No hay un veterinario con ese username");
      }
    });
  })
  .delete((req, res) => {
    Veterinario.destroy({ where: { username: req.params.username } }).then(
      (result) => {
        if (result === 0) {
          res.status(404).send("No hay un veterinario con ese login");
        } else {
          res.status(204).send();
        }
      },
    );
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
