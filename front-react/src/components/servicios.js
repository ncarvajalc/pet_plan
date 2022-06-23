import React from "react";
import { useNavigate } from "react-router";
import limpiezaImg from "./assets/limpieza.svg";
import entrenamientoImg from "./assets/entrenamiento.svg";
import veterinarioImg from "./assets/veterinario.svg";
import guarderiaImg from "./assets/guarderia.png";

import "./css/servicios.scss";
import { FormattedMessage } from "react-intl";
function Servicios() {
  let navigate = useNavigate();
  const ir = (url) => {
    navigate("/servicios/" + url);
  };
  return (
    <div className="row">
      <center>
        <h1>
          <FormattedMessage id="ChooseService" />
        </h1>
      </center>
      <div className="contenedor-servicios">
        <div className="cajita" onClick={() => ir("limpieza")}>
          <div className="icono">
            <img src={limpiezaImg} alt="" />
          </div>
          <p>
            <FormattedMessage id="Grooming" />
          </p>
        </div>
        <div className="cajita" onClick={() => ir("veterinario")}>
          <div className="icono">
            <img src={veterinarioImg} alt="" />
          </div>
          <p>
            <FormattedMessage id="Veterinary" />
          </p>
        </div>
        <div className="cajita" onClick={() => ir("entrenamiento")}>
          <div className="icono">
            <img src={entrenamientoImg} alt="" />
          </div>
          <p>
            <FormattedMessage id="Training" />
          </p>
        </div>
        <div className="cajita" onClick={() => ir("guarderia")}>
          <div className="icono">
            <img src={guarderiaImg} alt="Perro" />
          </div>
          <p>
            <FormattedMessage id="Daycare" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Servicios;
