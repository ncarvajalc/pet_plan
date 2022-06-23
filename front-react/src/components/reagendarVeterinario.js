import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import entreBanner from "./assets/veterinarioBanner.png";
import DateTimePicker from "react-datetime-picker";
import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";
import "./css/veterinario.scss";
const urlServicio = process.env.REACT_APP_RUTA_RAIZ + "/servicios";
const urlCita = process.env.REACT_APP_RUTA_RAIZ + "/citas";

function ReagendarVeterinario() {
  let { citaId } = useParams();
  const [veterinario, setVeterinario] = useState({});
  const [fecha, setFecha] = useState(new Date());
  let navigate = useNavigate();
  const ir = (url = "") => {
    navigate("/servicios/veterinario/" + url);
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
        let veterinarioPrep = {
          ...servicio,
          ...cita,
        };
        setVeterinario(veterinarioPrep);
        setFecha(new Date(cita.fechaInicio));
      })
      .catch(console.error);
  }, [citaId]);
  const actualizarCita = () => {
    const citaActualizar = {
      fechaInicio: fecha.toISOString(),
      duracion: veterinario.duracion,
      comentarios: veterinario.comentarios,
      UserUsername: veterinario.UserUsername,
      idServicio: veterinario.idServicio,
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
    <div className="contenedor-veterinario">
      <h1>
        <FormattedMessage id="ReScheduleYourVet" />
      </h1>
      <div className="img">
        <img src={entreBanner} alt="" />
      </div>
      <div className="form">
        <h5>
          <FormattedMessage id="Type" />
        </h5>
        <p>{veterinario.tipo}</p>
        <h5>
          <FormattedMessage id="Description" />
        </h5>
        <p>{veterinario.descripcion}</p>

        <h5>
          <FormattedMessage id="Duration" />
        </h5>
        <p>{veterinario.duracion}</p>
        <h5>
          <FormattedMessage id="Comments" />
        </h5>
        <p>{veterinario.comentarios}</p>
        <h5>
          <FormattedMessage id="DateAndHour" />
        </h5>
        <DateTimePicker
          minDate={new Date()}
          onChange={cambiarFecha}
          value={fecha}
        />
      </div>
      <div className="botones">
        <button className="btn btn-morado" onClick={actualizarCita}>
          <FormattedMessage id="ReScheduleService" />
        </button>
        <button onClick={eliminarCita} className="btn btn-morado">
          <FormattedMessage id="DeleteAppointment" />
        </button>
      </div>
    </div>
  );
}

export default ReagendarVeterinario;
