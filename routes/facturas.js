let express = require("express");
let router = express.Router();

//Manejo de esquemas
const Joi = require("joi");

//Modelo
const Factura = require("../models/factura");
const Servicio = require("../models/servicio");
const { Usuario } = require("../models/user");

const schema = Joi.object({
  nit: Joi.string().length(10).required(),
  fecha: Joi.date().required(),
  nombreFacturante: Joi.string().required(),
  valor: Joi.number().positive().required(),
  descuento: Joi.number().min(0).max(1).required(),
  impuesto: Joi.number().min(0).max(1).required(),
  total: Joi.number().positive().required(),
  cufe: Joi.string().required(),
  UserUsername: Joi.string().required(),
  servicioId: Joi.number().required(),
});

/* / endpoint*/

router
  .route("/")
  .get((req, res) => {
    Factura.findAll().then((invoices) => {
      res.send(invoices);
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

    let servicioId = req.body.servicioId;
    Servicio.findByPk(servicioId).then((servicio) => {
      if (!servicio) {
        return res.status(404).send("No hay un servicio con ese id");
      }
    });

    Factura.create({
      nit: req.body.nit,
      fecha: req.body.fecha,
      nombreFacturante: req.body.nombreFacturante,
      valor: req.body.valor,
      descuento: req.body.descuento,
      impuesto: req.body.impuesto,
      total: req.body.total,
      cufe: req.body.cufe,
      UserUsername: username,
      servicioId: servicioId,
    }).then((invoice) => {
      res.send(invoice);
    });
  });

/* /id endpoint*/
router
  .route("/:id")
  .get((req, res) => {
    Factura.findByPk(req.params.id).then((invoice) => {
      if (invoice) {
        res.send(invoice);
      } else {
        res.status(404).send("No hay una factura con ese id");
      }
    });
  })
  .put((req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Factura.update(req.body, { where: { id: req.params.id } }).then(
      (response) => {
        if (response[0] !== 0) {
          res.send("Factura actualizada");
        } else {
          res.status(404).send("No hay una factura con ese id");
        }
      },
    );
  })
  .delete((req, res) => {
    Factura.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una factura con ese id");
      } else {
        res.status(204).send();
      }
    });
  });
function validate(body) {
  return schema.validate(body);
}

module.exports = router;
