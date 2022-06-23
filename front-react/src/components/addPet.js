import { useState } from "react";
import Joi from "joi";
import jwt from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./css/signUpForm.css";
import husky from "./assets/husky.png";
import { FormattedMessage } from "react-intl";
const urlCrearMascota = process.env.REACT_APP_RUTA_RAIZ + "/mascotas";

export default function AddPet(props) {
  const lan = navigator.language || navigator.userLanguage;

  const getLocale = () => {
    return lan === "en"
      ? "Additional information about your pet that you want us to know"
      : "Comentarios adicionales que quieras dejar acerca de tu mascota";
  };
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [btnPressed, setBtnPressed] = useState(false);
  const [datosIncorrectos, setDatosIncorrectos] = useState("");

  const navigate = useNavigate();

  const schemaNombre = Joi.object({
    nombre: Joi.string().required(),
  });

  const schemaRaza = Joi.object({
    raza: Joi.string().required(),
  });

  const schemaEdad = Joi.object({
    edad: Joi.number().positive().required(),
  });

  const schemaComentarios = Joi.object({
    comentarios: Joi.string().required(),
  });

  const validate = () => {
    const { error: nombreError } = schemaNombre.validate({
      nombre: inputs.nombre,
    });
    const { error: razaError } = schemaRaza.validate({
      raza: inputs.raza,
    });
    const { error: edadError } = schemaEdad.validate({
      edad: inputs.edad,
    });
    const { error: comentariosError } = schemaComentarios.validate({
      comentarios: inputs.comentarios,
    });

    const errores = {
      ...errors,
      nombre: nombreError,
      raza: razaError,
      edad: edadError,
      comentarios: comentariosError,
    };
    setErrors(errores);
  };

  const validateNombre = () => {
    const { error: nombreError } = schemaNombre.validate({
      nombre: inputs.nombre,
    });

    const errores = {
      ...errors,
      nombre: nombreError,
    };
    setErrors(errores);
  };

  const validateRaza = () => {
    const { error: razaError } = schemaRaza.validate({
      raza: inputs.raza,
    });

    const errores = {
      ...errors,
      raza: razaError,
    };
    setErrors(errores);
  };

  const validateEdad = () => {
    const { error: edadError } = schemaEdad.validate({
      edad: inputs.edad,
    });

    const errores = {
      ...errors,
      edad: edadError,
    };
    setErrors(errores);
  };

  const validateComentarios = () => {
    const { error: comentariosError } = schemaComentarios.validate({
      comentarios: inputs.comentarios,
    });
    const errores = {
      ...errors,
      comentarios: comentariosError,
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

  let razaError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.raza && errors.raza.details
          ? errors.raza.details[0].message
          : ""}
      </p>
    </div>
  );
  let edadError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.edad && errors.edad.details
          ? errors.edad.details[0].message
          : ""}
      </p>
    </div>
  );
  let comentariosError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.comentarios && errors.comentarios.details
          ? errors.comentarios.details[0].message
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
      parsedInput.edad = Number.parseInt(parsedInput.edad);
      const decoded = jwt(localStorage.getItem("token"));
      parsedInput.UserUsername = decoded.username;

      fetch(urlCrearMascota, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      }).then((res) => {
        if (res.ok) {
          navigate("/profile");
        } else {
          const errorMsg = res.message;
          setDatosIncorrectos(errorMsg);
        }
      });
    }
    if (!btnPressed) setBtnPressed(true);
  };
  return (
    <div className="row">
      <div className="col-lg-6 col-12 bg-orange text-center">
        <h1 className="title d-sm-block d-lg-none">
          <FormattedMessage id="AddPet" />
        </h1>
        <img src={husky} className="img-fluid husky" alt="Husky" />
      </div>
      <div className="col-lg-6 col-12">
        <div className="row justify-content-center font">
          <div className="col-10 col-lg-8">
            <h1 className="title d-none d-lg-block">
              <FormattedMessage id="AddPet" />
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
                  onChange={handleChange}
                  placeholder="Max"
                  onBlur={validateNombre}
                />
                {nombreError}
              </div>
              <div className="mb-3">
                <label htmlFor="raza" className="form-label">
                  <FormattedMessage id="Breed" />*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="raza"
                  name="raza"
                  onChange={handleChange}
                  placeholder="Puddle"
                  onBlur={validateRaza}
                />
                {razaError}
              </div>
              <div className="mb-3">
                <label htmlFor="edad" className="form-label">
                  <FormattedMessage id="Age" />*
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="edad"
                  name="edad"
                  onChange={handleChange}
                  placeholder="10"
                  onBlur={validateEdad}
                />
                {edadError}
              </div>
              <div className="mb-3">
                <label htmlFor="comentarios" className="form-label">
                  <FormattedMessage id="Comments" />*
                </label>
                <textarea
                  className="form-control"
                  id="comentarios"
                  name="comentarios"
                  rows="3"
                  onChange={handleChange}
                  placeholder={getLocale()}
                  onBlur={validateComentarios}
                />
                {comentariosError}
              </div>
              <div className="form-text">
                <p className="text-danger">{datosIncorrectos}</p>
              </div>
              <button type="submit" className="button-purple-login white-font">
                <FormattedMessage id="AddPet" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
