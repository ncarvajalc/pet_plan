import { useState } from "react";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import "./css/loginForm.css";
const urlLogin = process.env.REACT_APP_RUTA_RAIZ + "/users/login";

export default function Login(props) {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [btnPressed, setBtnPressed] = useState(false);
  const [datosIncorrectos, setDatosIncorrectos] = useState("");

  const navigate = useNavigate();

  const schemaUsername = Joi.object({
    username: Joi.string().min(4).required(),
  });

  const schemaPassword = Joi.object({
    password: Joi.string().min(3).required(),
  });

  const validate = () => {
    const { error: usernameError } = schemaUsername.validate({
      username: inputs.username,
    });
    const { error: passwordError } = schemaPassword.validate({
      password: inputs.password,
    });

    const errores = {
      ...errors,
      username: usernameError,
      password: passwordError,
    };
    setErrors(errores);
  };

  let usernameError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.username && errors.username.details && btnPressed
          ? errors.username.details[0].message
          : ""}
      </p>
    </div>
  );

  let passwordError = (
    <div className="form-text">
      <p className="text-danger">
        {errors.password && errors.password.details && btnPressed
          ? errors.password.details[0].message
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
      fetch(urlLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputs.username,
          password: inputs.password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            const token = res.token;
            localStorage.setItem("token", token);
            props.logginSuccess();
            navigate("/profile");
          } else {
            const errorMsg = res.message;
            setDatosIncorrectos(errorMsg);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (!btnPressed) setBtnPressed(true);
  };
  return (
    <div className="row justify-content-center bg-orange">
      <div className="col-lg-4 col-md-6 col-11 centered-form text-center">
        <h1 className="title"> Iniciar sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label"></label>
            <input
              type="email"
              className="form-control"
              id="username"
              aria-describedby="usernameHelp"
              name="username"
              placeholder="Correo"
              onChange={handleChange}
            />
            {usernameError}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label"></label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {passwordError}
            <div className="form-text">
              <p className="text-danger">{datosIncorrectos}</p>
            </div>
          </div>
          <button type="submit" className="button-purple-login white-font">
            Acceder
          </button>
        </form>
        <div className="unregistered">
          <p>
            ¿Aún no estás en PetPlan?&nbsp;
            <button
              className="register-link"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
