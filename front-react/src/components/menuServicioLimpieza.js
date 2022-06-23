import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import "./css/menuServicioLimpieza.css";
import "./css/blurPopUp.css";
import PopUp from "./popUp.js";
import "./css/veterinario.scss";
import { FormattedMessage } from "react-intl";

export default function MenuServicioLimpieza() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [estadoPopUp, setEstadoPopUp] = useState(false);
  let navigate = useNavigate();

  const ir = (url) => {
    navigate("/servicios/limpieza/" + url);
  };

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  let desplegarLimpiezas = () => {
    if (loggedIn) {
      ir("listar");
    } else {
      setEstadoPopUp(true);
    }
  };

  return (
    <div className="row">
      <PopUp
        mensaje="Para acceder a esta opción debe iniciar sesión."
        visible={estadoPopUp}
        setVisible={setEstadoPopUp}
      ></PopUp>
      <div className="fondo-menu">
        <div className="fila-menu">
          <h1>
            {" "}
            <FormattedMessage id="ChooseGrooming"></FormattedMessage>
          </h1>
          <div className="row">
            <div
              className="col columna-menu"
              onClick={() => {
                ir("contratar");
              }}
            >
              <div className="icono-menu">
                <img
                  className="imagen-servicio img-fluid"
                  src="https://i.pinimg.com/originals/f5/ad/13/f5ad138715127d421ab0f0329db05756.png"
                  alt="imagen contratar limpieza"
                />

                <button className="button-purple-login white-font">
                  <FormattedMessage id="HireGrooming"></FormattedMessage>
                </button>
              </div>
            </div>
            <div className="col columna-menu">
              <div className="icono-menu" onClick={desplegarLimpiezas}>
                <img
                  className="imagen-servicio img-fluid"
                  src="https://cdn-icons-png.flaticon.com/512/410/410909.png"
                  alt="imagen listar limpiezas"
                />
                <button className="button-purple-login white-font">
                  <FormattedMessage id="MyGroomings"></FormattedMessage>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
