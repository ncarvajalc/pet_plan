import React, { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import { useNavigate, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import perro from "./assets/perroGuarderia.png";
import "./css/servicioGuarderia.scss";

const urlServicio = process.env.REACT_APP_RUTA_RAIZ + "/servicios";
const urlCita = process.env.REACT_APP_RUTA_RAIZ + "/citas";

export default function ReagendarGuarderia() {
  let { citaId } = useParams();
  const [guarderia, setGuarderia] = useState({});
  const [fecha, setFecha] = useState(new Date());
  let navigate = useNavigate();

  const ir = (url = "") => {
    navigate("/servicios/guarderia/" + url);
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
        let guarderiaPrep = {
          ...servicio,
          ...cita,
        };
        setGuarderia(guarderiaPrep);
        setFecha(new Date(cita.fechaInicio));
      })
      .catch(console.error);
  }, [citaId]);

  const actualizarCita = () => {
    const citaActualizar = {
      fechaInicio: fecha.toISOString(),
      duracion: guarderia.duracion,
      comentarios: guarderia.comentarios,
      UserUsername: guarderia.UserUsername,
      idServicio: guarderia.idServicio,
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
    <div className="contenedor-guarderia">
      <h1>
        <FormattedMessage id="ReScheduleNursery" />
      </h1>
      <div className="img">
        <img src={perro} alt="Dogs in pet nursery" />
      </div>
      <div className="form">
        <h5>
          <FormattedMessage id="Type" />
        </h5>
        <p>{guarderia.tipo}</p>
        <h5>
          <FormattedMessage id="Description" />
        </h5>
        <p>{guarderia.descripcion}</p>

        <h5>
          <FormattedMessage id="Duration" />
        </h5>
        <p>
          {guarderia.duracion} <FormattedMessage id="Minutes" />
        </p>
        <h5>
          <FormattedMessage id="Comments" />
        </h5>
        <p>{guarderia.comentarios}</p>
        <h5>
          <FormattedMessage id="DateAndTime" />
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
