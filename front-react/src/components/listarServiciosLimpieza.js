import { useEffect, useState } from "react";
import jwt from "jwt-decode";
import "./css/listarServiciosLimpieza.css";
import PopUp from "./popUp.js";
import { FormattedMessage } from "react-intl";

const urlCitas = process.env.REACT_APP_RUTA_RAIZ + "/citas/";
const urlServicios = process.env.REACT_APP_RUTA_RAIZ + "/servicios/";

export default function ListarServiciosLimpieza() {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [citaACancelar, setCitaACancelar] = useState([]);
  const [visibilidadPopUpCancelarCita, setVisivilidadPopUpCancelarCita] =
    useState("hidden");

  const [citaAReagendar, setCitaAReagendar] = useState([]);
  const [visibilidadPopUpReagendarCita, setVisivilidadPopUpReagendarCita] =
    useState("hidden");

  const [mensajeInformativo, setMensajeInformativo] = useState("");
  const [estadoPopUp, setEstadoPopUp] = useState(false);
  const [redireccionarPopUp] = useState(false);
  const [direccionRedireccionamientoPopUp] = useState("");

  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("citas") === null) setCitas({});
      else setCitas(JSON.parse(localStorage.getItem("citas")));

      if (localStorage.getItem("servicios") === null) setServicios({});
      else setServicios(JSON.parse(localStorage.getItem("servicios")));
    } else {
      const decoded = jwt(localStorage.getItem("token"));
      fetch(urlCitas)
        .then((res) => res.json())
        .then((res) => {
          let citas = {};
          Object.values(res).forEach((cita) => {
            let nueva = {
              id: Number.parseInt(cita.id),
              duracion: Number.parseInt(cita.duracion),
              fecha: cita.fechaInicio,
              comentarios: cita.comentarios,
              idTiendaMascota: cita.idTiendaMascota,
            };
            citas[Number.parseInt(cita.idServicio)] = nueva;
          });
          localStorage.setItem("citas", JSON.stringify(citas));
          setCitas(citas);
        })
        .catch((error) => {
          console.error(error);
        });
      fetch(urlServicios)
        .then((res) => res.json())
        .then((res) => {
          let servicios = {};
          Object.values(res).forEach((servicio) => {
            if (
              (servicio.UserUsername === decoded.username &&
                servicio.tipo === "limpieza") ||
              decoded.role === "admin"
            ) {
              let nuevo = {
                tipo: servicio.tipo,
                descripcion: servicio.descripcion,
                direccion: servicio.direccion,
                username: servicio.UserUsername,
              };
              servicios[Number.parseInt(servicio.id)] = nuevo;
            }
          });
          localStorage.setItem("servicios", JSON.stringify(servicios));
          setServicios(servicios);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  let cancelarCita = (idServicio) => {
    setCitaACancelar(Number.parseInt(idServicio));
    setVisivilidadPopUpCancelarCita("visible");
  };

  let eliminarCita = (idServicio) => {
    fetch(urlCitas + citas[idServicio].id.toString(), {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          eliminarServicio(idServicio);
        } else {
          setMensajeInformativo(
            <FormattedMessage id="ReservationNotDeleted"></FormattedMessage>,
          );
          setEstadoPopUp(true);
        }
      })
      .catch((error) => {
        setMensajeInformativo(
          <FormattedMessage id="ReservationNotDeleted"></FormattedMessage>,
        );
        setEstadoPopUp(true);
      });
  };

  let eliminarServicio = (idServicio) => {
    fetch(urlServicios + idServicio.toString(), {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          setMensajeInformativo(
            <FormattedMessage id="ReservationDeleted"></FormattedMessage>,
          );
          setEstadoPopUp(true);
          delete citas[idServicio];
          delete servicios[idServicio];
        } else {
          setMensajeInformativo(
            <FormattedMessage id="ServiceWasNotDeleted"></FormattedMessage>,
          );
          setEstadoPopUp(true);
        }
      })
      .catch((error) => {
        setMensajeInformativo(
          <FormattedMessage id="ServiceWasNotDeleted"></FormattedMessage>,
        );
        setEstadoPopUp(true);
      });
  };

  let reagendarCita = (idServicio) => {
    setCitaAReagendar(Number.parseInt(idServicio));
    setVisivilidadPopUpReagendarCita("visible");
  };

  let actualizarCita = (idServicio) => {
    const parsedInput = {};
    const decoded = jwt(localStorage.getItem("token"));
    parsedInput.fechaInicio = inputs.fechaSeleccionada;
    parsedInput.duracion = citas[idServicio].duracion;
    parsedInput.comentarios = citas[idServicio].comentarios;
    parsedInput.UserUsername = decoded.username;
    parsedInput.idServicio = idServicio;

    if (parsedInput.fechaInicio === undefined) {
      setVisivilidadPopUpReagendarCita("hidden");
      setMensajeInformativo(
        <FormattedMessage id="InvalidDate"></FormattedMessage> +
        <FormattedMessage id="ReservationWasNotUpdated"></FormattedMessage>,
      );
      setEstadoPopUp(true);
    } else {
      fetch(urlCitas + citas[idServicio].id.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      })
        .then((res) => {
          if (res.status === 200) {
            setVisivilidadPopUpReagendarCita("hidden");
            setMensajeInformativo(
              <FormattedMessage id="ReservationUpdated"></FormattedMessage>,
            );
            setEstadoPopUp(true);
            let citasViejas = citas;
            citasViejas[idServicio].fecha = inputs.fechaSeleccionada;
            setCitas(citasViejas);
          } else {
            setVisivilidadPopUpReagendarCita("hidden");
            setMensajeInformativo(
              (
                <FormattedMessage id="ReservationWasNotUpdated"></FormattedMessage>
              ) +
                ":" +
                res.body,
            );
            setEstadoPopUp(true);
          }
        })
        .catch((error) => {
          setMensajeInformativo(
            <FormattedMessage id="ReservationWasNotUpdated"></FormattedMessage>,
          );
          setEstadoPopUp(true);
        });
    }
  };

  let renderCitas = () => {
    return Object.keys(servicios).map((idServicio) => {
      try {
        return (
          <tr key={"idServicio" + idServicio}>
            <th scope="row">{citas[idServicio].comentarios.split(" ")[2]}</th>
            <td>{citas[idServicio].fecha}</td>
            <td>{citas[idServicio].comentarios.split(" en ")[1]}</td>
            <td>{servicios[idServicio].descripcion}</td>
            <td>
              <div className="row row-botones">
                <div className="col">
                  <button
                    onClick={() => reagendarCita(idServicio)}
                    className="button-purple-login white-font"
                  >
                    <FormattedMessage id="Reschedule"></FormattedMessage>
                  </button>
                </div>
                <div className="col">
                  <button
                    onClick={() => cancelarCita(idServicio)}
                    className="button-purple-login white-font"
                  >
                    <FormattedMessage id="Cancel"></FormattedMessage>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        );
      } catch (error) {
        console.error(
          "Se ha detectado una incongruencia en la BD, no existe cita para el servicio " +
            idServicio,
          error.toString(),
        );
        return <div></div>;
      }
    });
  };

  let renderPopUpConfirmacionCancelarCita = () => {
    return (
      <div
        className="blur-pop-up"
        style={{ visibility: visibilidadPopUpCancelarCita }}
      >
        <div className="cuadro-pop-up">
          <div className="texto-pop-up">
            <FormattedMessage id="CancelReservationConfirmation"></FormattedMessage>
          </div>
          <div className="container">
            <div className="row">
              <div className="col">
                <button
                  onClick={() => {
                    setVisivilidadPopUpCancelarCita("hidden");
                    eliminarCita(citaACancelar);
                  }}
                  type="button"
                  className="btn btn-danger"
                  style={{ margin: "10px" }}
                >
                  <FormattedMessage id="Yes"></FormattedMessage>
                </button>
              </div>
              <div className="col">
                <button
                  onClick={() => setVisivilidadPopUpCancelarCita("hidden")}
                  type="button"
                  className="btn btn-primary"
                  style={{ margin: "10px" }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  let renderPopUpReagendarCita = () => {
    return (
      <div
        className="blur-pop-up"
        style={{ visibility: visibilidadPopUpReagendarCita }}
      >
        <div className="cuadro-pop-up">
          <label htmlFor="fechaSeleccionada" className="texto-pop-up">
            <FormattedMessage id="NewDate"></FormattedMessage>:
          </label>
          <input
            id="fechaSeleccionada"
            name="fechaSeleccionada"
            type="datetime-local"
            className="form-control"
            onChange={handleChange}
          />
          <div className="container">
            <div className="row">
              <div className="col">
                <button
                  onClick={() => {
                    setVisivilidadPopUpReagendarCita("hidden");
                    actualizarCita(citaAReagendar);
                  }}
                  type="button"
                  className="btn btn-primary"
                  style={{ margin: "10px" }}
                >
                  <FormattedMessage id="Reschedule"></FormattedMessage>
                </button>
              </div>
              <div className="col">
                <button
                  onClick={() => setVisivilidadPopUpReagendarCita("hidden")}
                  type="button"
                  className="btn btn-danger"
                  style={{ margin: "10px" }}
                >
                  <FormattedMessage id="Cancel"></FormattedMessage>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <PopUp
        mensaje={mensajeInformativo}
        visible={estadoPopUp}
        setVisible={setEstadoPopUp}
        redireccionar={redireccionarPopUp}
        direccionRedireccionamiento={direccionRedireccionamientoPopUp}
      ></PopUp>
      {renderPopUpConfirmacionCancelarCita()}
      {renderPopUpReagendarCita()}
      <div className="cuadro-fondo">
        <h1>
          <FormattedMessage id="Groomings"></FormattedMessage>
        </h1>
        <div className="tabla-lista-limpiezas">
          <table className="table table-striped">
            <thead key="TablaEncabezado">
              <tr key="Encabezado" style={{ textAlign: "center" }}>
                <th scope="col" key="Pet">
                  <FormattedMessage id="Pet"></FormattedMessage>
                </th>
                <th scope="col" key="Date">
                  <FormattedMessage id="Date"></FormattedMessage>
                </th>
                <th scope="col" key="Place">
                  <FormattedMessage id="Place"></FormattedMessage>
                </th>
                <th scope="col" key="Description">
                  <FormattedMessage id="Description"></FormattedMessage>
                </th>
                <th scope="col" key="Actions" style={{ minWidth: "15%" }}>
                  <FormattedMessage id="Actions"></FormattedMessage>
                </th>
              </tr>
            </thead>
            <tbody key="TablaCuerpo">{renderCitas()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
