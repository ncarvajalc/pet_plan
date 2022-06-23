import React, { useState } from "react";
import entreBanner from "./assets/entrenamientoBanner.png";
import DateTimePicker from "react-datetime-picker";
import { useNavigate } from "react-router";
import "./css/entrenamiento.scss";

import { Breadcrumbs, Typography, Link } from "@mui/material";
import { FormattedMessage } from "react-intl";
const urlServicio = process.env.REACT_APP_RUTA_RAIZ + "/servicios";
const urlCita = process.env.REACT_APP_RUTA_RAIZ + "/citas";
const duracion = 60;
const descServicio = "Se ha agendado exitosamente";

function ContratarEntrenmaiento({ user }) {
  const [direccion, setDireccion] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [comentarios, setComentarios] = useState("");
  let navigate = useNavigate();
  const ir = (url) => {
    navigate("/servicios/entrenamiento/" + url);
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
  const crearServicioCita = () => {
    let servicio = {
      tipo: "Entrenamiento",
      descripcion: descServicio,
      UserUsername: user,
    };

    let cita = {
      fechaInicio: fecha.toISOString(),
      duracion: duracion,
      comentarios: comentarios,
      UserUsername: user,
    };

    fetch(urlServicio, {
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
      <div className="contenedor-entrenamiento">
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
        <h1>Agenda un entrenamiento</h1>
        <div className="img">
          <img src={entreBanner} alt="" />
        </div>
        <div className="form">
          <h5>Direccion</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Direccion"
            onChange={cambiarDireccion}
            value={direccion}
          />
          <h5>Comentarios</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Comentarios"
            onChange={cambiarComentarios}
          />
          <h5>Fecha y Hora</h5>
          <DateTimePicker
            minDate={new Date()}
            onChange={cambiarFecha}
            value={fecha}
          />
        </div>
        <div className="botones">
          <button className="btn btn-morado" onClick={crearServicioCita}>
            Agendar Servicio
          </button>
          <button className="btn btn-morado">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ContratarEntrenmaiento;
