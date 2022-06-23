import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import entreBanner from "./assets/entrenamientoBanner.png";
import DateTimePicker from "react-datetime-picker";
import { useNavigate } from "react-router";
import "./css/entrenamiento.scss";
const urlServicio = process.env.REACT_APP_RUTA_RAIZ + "/servicios";
const urlCita = process.env.REACT_APP_RUTA_RAIZ + "/citas";

function ReagendarEntrenamiento() {
  let { citaId } = useParams();
  const [entrenamiento, setEntrenamiento] = useState({});
  const [fecha, setFecha] = useState(new Date());
  let navigate = useNavigate();
  const ir = (url = "") => {
    navigate("/servicios/entrenamiento/" + url);
  };
  const cambiarFecha = (e) => {
    setFecha(e);
  };
  useEffect(() => {
    let cita = {};
    let servicio = {};

    fetch(urlCita + "/" + citaId)
      .then((res) => res.json())
      .then((result) => {
        cita = result;
        return fetch(urlServicio + "/" + cita.idServicio);
      })
      .then((res) => res.json())
      .then((result) => {
        servicio = result;
        let entrenamientoPrep = {
          ...servicio,
          ...cita,
        };
        setEntrenamiento(entrenamientoPrep);
        setFecha(new Date(cita.fechaInicio));
      })
      .catch(console.error);
  }, [citaId]);
  const actualizarCita = () => {
    const citaActualizar = {
      fechaInicio: fecha.toISOString(),
      duracion: entrenamiento.duracion,
      comentarios: entrenamiento.comentarios,
      UserUsername: entrenamiento.UserUsername,
      idServicio: entrenamiento.idServicio,
    };

    fetch(urlCita + "/" + citaId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(citaActualizar),
    }).then((res) => {
      ir(citaId);
    });
  };
  const eliminarCita = () => {
    fetch(urlCita + "/" + citaId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((el) => {
      ir();
    });
  };
  return (
    <div className="contenedor-entrenamiento">
      <h1>Reagenda tu entrenamiento</h1>
      <div className="img">
        <img src={entreBanner} alt="" />
      </div>
      <div className="form">
        <h5>Tipo</h5>
        <p>{entrenamiento.tipo}</p>
        <h5>Descripcion</h5>
        <p>{entrenamiento.descripcion}</p>

        <h5>Duracion</h5>
        <p>{entrenamiento.duracion}</p>
        <h5>Comentarios</h5>
        <p>{entrenamiento.comentarios}</p>
        <h5>Fecha y Hora</h5>
        <DateTimePicker
          minDate={new Date()}
          onChange={cambiarFecha}
          value={fecha}
        />
      </div>
      <div className="botones">
        <button className="btn btn-morado" onClick={actualizarCita}>
          Re-agendar Servicio
        </button>
        <button onClick={eliminarCita} className="btn btn-morado">
          Eliminar Cita
        </button>
      </div>
    </div>
  );
}

export default ReagendarEntrenamiento;
