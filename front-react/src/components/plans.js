import "./css/plans.css";
import icon from "./assets/huella.png";
import jwt from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
const urlAddSus = process.env.REACT_APP_RUTA_RAIZ + "/suscripciones";

export default function AddSus(props) {
  const navigate = useNavigate();

  const contratarBronce = () => {
    fetch(urlAddSus, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fechaInicio: Date.now(),
        siguientePago: Date.now(),
        suscripcionUsername: jwt(localStorage.getItem("token")).username,
        planId: 3,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        props.activarSuscripcion();
        navigate("/profile");
      });
  };

  const contratarSilver = () => {
    fetch(urlAddSus, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fechaInicio: Date.now(),
        siguientePago: Date.now(),
        suscripcionUsername: jwt(localStorage.getItem("token")).username,
        planId: 2,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        props.activarSuscripcion();
        navigate("/profile");
      });
  };

  const contratarGold = () => {
    fetch(urlAddSus, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fechaInicio: Date.now(),
        siguientePago: Date.now(),
        suscripcionUsername: jwt(localStorage.getItem("token")).username,
        planId: 1,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        props.activarSuscripcion();
        navigate("/profile");
      });
  };

  return (
    <div className="container">
      <center>
        <h1>
          <FormattedMessage id="ChoosePlan" />
        </h1>
      </center>
      <div className="row justify-content-between">
        <div className=" col col-rounded" id="columna3">
          <center>
            <h2>Bronce</h2>
          </center>
          <ul>
            <li>
              {" "}
              <FormattedMessage id="Bronce1" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Bronce2" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Bronce3" />{" "}
            </li>
          </ul>
          <center>
            <img className="photo" src={icon} alt="Huella" />
            <h2> $14.900 </h2>
            {localStorage.getItem("token") === null ? (
              <a className="btn btn-primary" href="/login" role="button">
                <FormattedMessage id="Buy" />
              </a>
            ) : (
              <button className="btn btn-primary" onClick={contratarBronce}>
                <FormattedMessage id="Buy" />
              </button>
            )}
          </center>
        </div>
        <div className="col col-rounded" id="columna1">
          <center>
            <h2>Silver</h2>
          </center>
          <ul>
            <li>
              {" "}
              <FormattedMessage id="Silver/Gold1" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Silver/Gold2" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Silver3" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Silver/Gold4" />{" "}
            </li>
          </ul>
          <center>
            <img className="photo" src={icon} alt="Huella" />
            <h2> $34.900 </h2>
            {localStorage.getItem("token") === null ? (
              <a className="btn btn-primary" href="/login" role="button">
                <FormattedMessage id="Buy" />
              </a>
            ) : (
              <button className="btn btn-primary" onClick={contratarSilver}>
                <FormattedMessage id="Buy" />
              </button>
            )}
          </center>
        </div>
        <div className="col col-rounded" id="columna2">
          <center>
            <h2>Gold</h2>
          </center>
          <ul>
            <li>
              <FormattedMessage id="Silver/Gold1" />
            </li>
            <li>
              {" "}
              <FormattedMessage id="Silver/Gold2" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Gold3" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Silver/Gold4" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Gold5" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Gold6" />{" "}
            </li>
          </ul>
          <center>
            <img className="photo" src={icon} alt="Huella" />
            <h2> $99.900 </h2>
            {localStorage.getItem("token") === null ? (
              <a className="btn btn-primary" href="/login" role="button">
                <FormattedMessage id="Buy" />
              </a>
            ) : (
              <button className="btn btn-primary" onClick={contratarGold}>
                <FormattedMessage id="Buy" />
              </button>
            )}
          </center>
        </div>
      </div>
    </div>
  );
}
