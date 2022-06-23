import "./css/planA.css";
import fotoPlanA from "./assets/fotoplanA.png";
import jwt from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
const urlPlanes = process.env.REACT_APP_RUTA_RAIZ + "/planes";
const urlAddSus = process.env.REACT_APP_RUTA_RAIZ + "/suscripciones";

export default function CancelChangePlan(props) {
  const tipoPlan = props.tipoPlan;
  const [tipoPlanStr, setTipoPlanStr] = useState("Cargando...");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(urlPlanes)
      .then((res) => res.json())
      .then((planes) => {
        return planes.find((plan) => plan.id === tipoPlan);
      })
      .then((planesFiltrados) => {
        setTipoPlanStr(planesFiltrados.nombre);
      });
  }, [tipoPlan]);

  async function del() {
    const response = await fetch(urlAddSus);
    const data = await response.json();
    let idRes = -1;

    for (var i in data) {
      let per = data[i]["suscripcionUsername"];
      if (per === jwt(localStorage.getItem("token")).username) {
        idRes = data[i]["id"];
      }
    }
    fetch(urlAddSus + "/" + idRes, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      props.desactivarSuscripcion();
      navigate("/profile");
    });
  }

  async function can() {
    const response = await fetch(urlAddSus);
    const data = await response.json();
    let idRes = -1;

    for (var i in data) {
      let per = data[i]["suscripcionUsername"];
      if (per === jwt(localStorage.getItem("token")).username) {
        idRes = data[i]["id"];
      }
    }
    fetch(urlAddSus + "/" + idRes, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      navigate("/planes");
    });
  }

  return (
    <div className="container">
      <center>
        <img className="photo" src={fotoPlanA} alt="foto plan" id="fotoplan" />
        <h1>
          <FormattedMessage id="ActualPlan" />
        </h1>
        <h2>{tipoPlanStr} </h2>
      </center>
      <div className="row justify-content-between">
        <center>
          {" "}
          <h3>
            <FormattedMessage id="Change/cancelPlan" />
          </h3>
          <button className="rounded" id="change-button" onClick={can}>
            <FormattedMessage id="ChangePlan" />
          </button>
          <button className="rounded" id="cancel-button" onClick={del}>
            <FormattedMessage id="CancelPlan" />
          </button>
        </center>
      </div>
    </div>
  );
}
