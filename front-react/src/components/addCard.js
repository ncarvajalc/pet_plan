import { useState } from "react";
import Joi from "joi";
import jwt from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./css/addCard.css";
import card from "./assets/card.png";
import { FormattedMessage } from "react-intl";
const urlAddCard = process.env.REACT_APP_RUTA_RAIZ + "/tarjetas";

export default function AddCard(props) {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [btnPressed, setBtnPressed] = useState(false);

  const navigate = useNavigate();

  const schemaNombre = Joi.object({
    nombre: Joi.string().required(),
  });

  const schemaNumero = Joi.object({
    numero: Joi.number().min(1000000000000000).max(9999999999999999).required(),
  });
  const schemaCVV = Joi.object({
    cvv: Joi.number().min(100).max(999).required(),
  });
  const schemaMM = Joi.object({
    mm: Joi.number().min(1).max(12).required(),
  });
  const schemaYY = Joi.object({
    yy: Joi.number()
      .min(Number.parseInt(new Date().getFullYear().toString().slice(2)))
      .max(99)
      .required(),
  });

  let nombreError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.nombre && errors.nombre.details
          ? errors.nombre.details[0].message
          : ""}
      </p>
    </div>
  );
  let numeroError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.numero && errors.numero.details
          ? errors.numero.details[0].message
          : ""}
      </p>
    </div>
  );
  let cvvError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.cvv && errors.cvv.details ? errors.cvv.details[0].message : ""}
      </p>
    </div>
  );
  let mmError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.mm && errors.mm.details ? errors.mm.details[0].message : ""}
      </p>
    </div>
  );
  let yyError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.yy && errors.yy.details ? errors.yy.details[0].message : ""}
      </p>
    </div>
  );

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const validate = () => {
    const { error: nombreError } = schemaNombre.validate({
      nombre: inputs.nombre,
    });
    const { error: cvvError } = schemaCVV.validate({ cvv: inputs.cvv });
    const { error: numeroError } = schemaNumero.validate({
      numero: inputs.numero,
    });
    const { error: mmError } = schemaMM.validate({ mm: inputs.mm });
    const { error: yyError } = schemaYY.validate({ yy: inputs.yy });
    const errores = {
      ...errors,
      nombre: nombreError,
      numero: numeroError,
      cvv: cvvError,
      mm: mmError,
      yy: yyError,
    };
    setErrors(errores);
  };

  const validateName = () => {
    const { error: nombreError } = schemaNombre.validate({
      nombre: inputs.nombre,
    });
    const errores = {
      ...errors,
      nombre: nombreError,
    };
    setErrors(errores);
  };

  const validateNumber = () => {
    const { error: numeroError } = schemaNumero.validate({
      numero: inputs.numero,
    });

    const errores = {
      ...errors,
      numero: numeroError,
    };
    setErrors(errores);
  };

  const validateCVV = () => {
    const { error: cvvError } = schemaCVV.validate({ cvv: inputs.cvv });
    const errores = {
      ...errors,
      cvv: cvvError,
    };
    setErrors(errores);
  };
  const validateMMYY = () => {
    const { error: mmError } = schemaMM.validate({ mm: inputs.mm });
    const { error: yyError } = schemaYY.validate({ yy: inputs.yy });
    const errores = {
      ...errors,
      mm: mmError,
      yy: yyError,
    };
    setErrors(errores);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validate();
    const e = Object.values(errors).filter((x) => x !== undefined);
    if (e.length === 0) {
      const parsedInput = { ...inputs };
      parsedInput.fechaVencimiento = `${new Date()
        .getFullYear()
        .toString()
        .slice(0, 2)}${parsedInput.yy}/${parsedInput.mm}`;
      const decoded = jwt(localStorage.getItem("token"));
      parsedInput.UserUsername = decoded.username;
      delete parsedInput.mm;
      delete parsedInput.yy;

      fetch(urlAddCard, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      })
        .then((res) => {
          if (res.ok) navigate("/profile");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (!btnPressed) setBtnPressed(true);
  };
  return (
    <div className="row">
      <div className="col-lg-6 col-12 bg-orange text-center">
        <h1 className="title d-sm-block d-lg-none">
          <FormattedMessage id="AddCard" />
        </h1>
        <img src={card} className="img-fluid husky" alt="Husky" />
      </div>
      <div className="col-lg-6 col-12">
        <div className="row justify-content-center font">
          <div className="col-10 col-lg-8">
            <h1 className="title d-none d-lg-block">
              <FormattedMessage id="AddCard" />
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  <FormattedMessage id="CardName" />*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  onChange={handleChange}
                  placeholder="Jhon Smith"
                  onBlur={validateName}
                />
                {nombreError}
              </div>
              <div className="mb-3">
                <label htmlFor="numero" className="form-label">
                  <FormattedMessage id="CardNumber" />*
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="numero"
                  name="numero"
                  onChange={handleChange}
                  placeholder="1234 1234 1234 1234"
                  onBlur={validateNumber}
                />
                {numeroError}
              </div>
              <div className="mb-3">
                <label htmlFor="cvv" className="form-label">
                  CVV*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cvv"
                  name="cvv"
                  onChange={handleChange}
                  placeholder="999"
                  onBlur={validateCVV}
                />
                {cvvError}
              </div>
              <label className="form-label">
                <FormattedMessage id="ExpirationDate" />*
              </label>
              <div className="input-group mb-3">
                <select
                  className="form-select"
                  id="mm"
                  name="mm"
                  aria-label="mm"
                  onChange={handleChange}
                >
                  <option defaultValue={"MM"}>MM</option>
                  <option value={"1"}>1</option>
                  <option value={"2"}>2</option>
                  <option value={"3"}>3</option>
                  <option value={"4"}>4</option>
                  <option value={"5"}>5</option>
                  <option value={"6"}>6</option>
                  <option value={"7"}>7</option>
                  <option value={"8"}>8</option>
                  <option value={"9"}>9</option>
                  <option value={"10"}>10</option>
                  <option value={"11"}>11</option>
                  <option value={"12"}>12</option>
                </select>
                <input
                  type="number"
                  className="form-control"
                  id="yy"
                  name="yy"
                  placeholder="YY"
                  onChange={handleChange}
                  onBlur={validateMMYY}
                />
              </div>
              {mmError}
              {yyError}
              <button type="submit" className="button-purple-login white-font">
                <FormattedMessage id="AddCard" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
