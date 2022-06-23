import { Link } from "react-router-dom";
import "./css/servicioLimpieza.css";

const urlServicioLimpieza = "/servicios/limpieza";
const urlServicioVeterinario = "/servicios/veterinario";
const urlServicioEntrenamiento = "/servicios/entrenamiento";

export default function BarraTiposServicios(props) {
  return (
    <div className="row">
      <div className="barra-tipos-servicios">
        <div className="container contenedor-botones" style={{ width: "40%" }}>
          <div className="row">
            <div
              className="boton-seleccionado col"
              style={{ marginTop: "10px" }}
            >
              <div
                className="texto-boton-seleccionado"
                style={{ marginTop: "5px" }}
              >
                <Link
                  className="texto-boton-seleccionado"
                  to={urlServicioLimpieza}
                  style={{ color: "inherit" }}
                >
                  Limpieza
                </Link>
              </div>
            </div>
            <div className="col" style={{ marginTop: "10px" }}>
              <div className="texto-boton" style={{ marginTop: "5px" }}>
                <Link
                  className="texto-boton"
                  to={urlServicioVeterinario}
                  style={{ color: "inherit" }}
                >
                  Veterinario
                </Link>
              </div>
            </div>
            <div className="col" style={{ marginTop: "10px" }}>
              <div className="texto-boton" style={{ marginTop: "5px" }}>
                <Link
                  className="texto-boton"
                  to={urlServicioEntrenamiento}
                  style={{ color: "inherit" }}
                >
                  Entrenamiento
                </Link>
              </div>
            </div>
            <div className="col" style={{ marginTop: "10px" }}>
              <div className="texto-boton" style={{ marginTop: "5px" }}>
                <Link
                  className="texto-boton"
                  to={urlServicioEntrenamiento}
                  style={{ color: "inherit" }}
                >
                  Guarderia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
