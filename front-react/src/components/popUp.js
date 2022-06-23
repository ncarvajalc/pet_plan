import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/menuServicioLimpieza.css";
import "./css/blurPopUp.css";
import { FormattedMessage } from "react-intl";

/*
POPUP que aparece en el centro de la pantalla para dar un mensaje, los props son:
mensaje: String que contiene el mensaje a desplegar
visible: true or false, muestra o oculta el componente
setVisible: funcion para cambiar de estado visible a no visible
redireccionar: true or false si se desea hacer redirecciona a direccionRedireccionamiento
direccionRedireccionamiento: string con la direccion a la que se desea redireccionar
*/
export default function PopUp(props) {
  const [estadoVisibilidad, setEstadoVisibilidad] = useState("hidden");

  let navigate = useNavigate();

  useEffect(() => {
    if (props.visible) {
      setEstadoVisibilidad("visible");
    } else {
      setEstadoVisibilidad("hidden");
    }
  }, [estadoVisibilidad, props.visible]);
  let regresarAInicio = () => {
    if (props.redireccionar) {
      navigate(props.direccionRedireccionamiento);
    }
  };
  return (
    <div className="blur-pop-up" style={{ visibility: estadoVisibilidad }}>
      <div className="cuadro-pop-up">
        <div className="texto-pop-up">{props.mensaje}</div>
        <button
          onClick={() => {
            props.setVisible(false);
            regresarAInicio();
          }}
          type="button"
          className="btn btn-primary"
          style={{ margin: "10px" }}
        >
          <FormattedMessage id="GotIt"></FormattedMessage>
        </button>
      </div>
    </div>
  );
}
