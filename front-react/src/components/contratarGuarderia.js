import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import perro from "./assets/perroGuarderia.png";
import "./css/servicioGuarderia.scss";
import { Breadcrumbs, Typography, Link } from "@mui/material";

const urlServicio = process.env.REACT_APP_RUTA_RAIZ + "/servicios";
const urlCita = process.env.REACT_APP_RUTA_RAIZ + "/citas";
const duracion = 60;
const descServicio = "Se ha agendado exitosamente";

export default function Guarderia({ user }) {
  const [direccion, setDireccion] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [comentarios, setComentarios] = useState("");
  let navigate = useNavigate();

  const ir = (url) => {
    navigate("/servicios/guarderia/" + url);
  };

  const cambiarDireccion = (e) => {
    e.preventDefault();
    setDireccion(e.target.value);
  };

  const cambiarComentarios = (e) => {
    e.preventDefault();
    setComentarios(e.target.value);
  };

  const cambiarFecha = (e) => {
    setFecha(e);
  };

  const goBack = () => {
    navigate("/servicios");
  };

  const crearServicioCita = () => {
    let servicio = {
      tipo: "Guarderia",
      descripcion: descServicio,
      UserUsername: user,
    };

    let cita = {
      fechaInicio: fecha.toISOString(),
      duracion: duracion,
      comentarios: comentarios,
      UserUsername: user,
    };

    localStorage.getItem("token") === null
      ? navigate("/login")
      : fetch(urlServicio, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicio),
        })
          .then((response) => response.json())
          .then((result) => {
            let idServicio = result.id;
            cita.idServicio = idServicio;
            return fetch(urlCita, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(cita),
            });
          })
          .then((response) => response.json())
          .then((result) => {
            setDireccion("");
            setComentarios("");
            setFecha(new Date());
            ir(result.id);
          })
          .catch((err) => console.log(err));
  };

  return (
    <div className="row">
      <div className="contenedor-guarderia">
        <div>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/servicios">
              <FormattedMessage id="Services" />
            </Link>
            <Typography color="text.primary">
              <FormattedMessage id="Training" />
            </Typography>
          </Breadcrumbs>
        </div>
        <h1>
          <FormattedMessage id="ScheduleNursery" />
        </h1>
        <div className="img">
          <img src={perro} className="img-fluid" alt="Dogs in pet nursery" />
        </div>
        <div className="form">
          <h5>
            <FormattedMessage id="Address" />
          </h5>
          <input
            type="text"
            className="form-control"
            placeholder="Direccion"
            onChange={cambiarDireccion}
            value={direccion}
          />
          <h5>
            <FormattedMessage id="Comments" />
          </h5>
          <input
            type="text"
            className="form-control"
            placeholder="Comentarios"
            onChange={cambiarComentarios}
          />
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
          <button className="btn btn-morado" onClick={crearServicioCita}>
            <FormattedMessage id="ScheduleService" />
          </button>
          <button className="btn btn-morado" onClick={goBack}>
            <FormattedMessage id="Cancel" />
          </button>
        </div>
      </div>
    </div>
  );
}
