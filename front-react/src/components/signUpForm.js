import { useState } from "react";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import "./css/signUpForm.css";
import husky from "./assets/husky.png";
import { useAuth0 } from "@auth0/auth0-react";
import { FormattedMessage } from "react-intl";
const urlSignup = process.env.REACT_APP_RUTA_RAIZ + "/users/signup";
const urlLogin = process.env.REACT_APP_RUTA_RAIZ + "/users/login";

export default function Signup(props) {
  const { user: usuario } = useAuth0();
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [btnPressed, setBtnPressed] = useState(false);

  const navigate = useNavigate();

  const schemaNombre = Joi.object({
    nombre: Joi.string().required(),
  });

  const schemaTelefono = Joi.object({
    telefono: Joi.number().min(1000000000).max(4000000000).required(),
  });

  const validate = () => {
    console.log("Inputs", inputs);
    console.log("Errors", errors);
    const { error: nombreError } = schemaNombre.validate({
      nombre: inputs.nombre,
    });
    const { error: telefonoError } = schemaTelefono.validate({
      telefono: inputs.telefono,
    });
    const errores = {
      ...errors,
      nombre: nombreError,
      telefono: telefonoError,
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

  const validatePhone = () => {
    const { error: telefonoError } = schemaTelefono.validate({
      telefono: inputs.telefono,
    });
    const errores = {
      ...errors,
      telefono: telefonoError,
    };
    setErrors(errores);
  };

  let nombreError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.nombre && errors.nombre.details
          ? errors.nombre.details[0].message
          : ""}
      </p>
    </div>
  );

  let telefonoError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.telefono && errors.telefono.details
          ? errors.telefono.details[0].message
          : ""}
      </p>
    </div>
  );

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validate();
    const e = Object.values(errors).filter((x) => x !== undefined);
    if (e.length === 0) {
      const parsedInput = { ...inputs };
      parsedInput.telefono = Number.parseInt(parsedInput.telefono);
      parsedInput.correo = usuario.email;
      parsedInput.username = parsedInput.correo;
      parsedInput.role = "estandar";
      parsedInput.password = "admin";

      fetch(urlSignup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      })
        .then((res) => res.json())
        .then((userRes) => {
          fetch(urlLogin, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: parsedInput.username,
              password: parsedInput.password,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              const token = res.token;
              localStorage.setItem("token", token);
              props.logginSuccess();
              navigate("/profile");
            });
        });
    }
    if (!btnPressed) setBtnPressed(true);
  };
  return (
    <div className="row">
      <div className="col-lg-6 col-12 bg-orange text-center">
        <h1 className="title d-sm-block d-lg-none">
          <FormattedMessage id="CompleteProfile" />
        </h1>
        <img src={husky} className="img-fluid husky" alt="Husky" />
      </div>
      <div className="col-lg-6 col-12">
        <div className="row justify-content-center font">
          <div className="col-10 col-lg-8">
            <h1 className="title d-none d-lg-block">
              <FormattedMessage id="CompleteProfile" />
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  <FormattedMessage id="FullName" />*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  placeholder="Jhon Smith"
                  onChange={handleChange}
                  onBlur={validateName}
                />
                {nombreError}
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  <FormattedMessage id="PhoneNumber" />*
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  onChange={handleChange}
                  onBlur={validatePhone}
                  placeholder="3150000000"
                />
                {telefonoError}
              </div>
              <button type="submit" className="button-purple-login white-font">
                <FormattedMessage id="CompleteProfile" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
