import { useEffect, useState } from "react";
import jwt from "jwt-decode";

import { FormattedMessage } from "react-intl";

import "./css/servicioLimpieza.css";
import PopUp from "./popUp";

const urlMascotas = process.env.REACT_APP_RUTA_RAIZ + "/mascotas/";
const urlTiendas = process.env.REACT_APP_RUTA_RAIZ + "/tiendasMascotas/";
const urlServicios = process.env.REACT_APP_RUTA_RAIZ + "/servicios/";
const urlCitas = process.env.REACT_APP_RUTA_RAIZ + "/citas/";

const lan = navigator.language || navigator.userLanguage;

const serviciosIngles = [
  "Bath",
  "Haircut",
  "Nail Cutting",
  "Dental Cleaning",
  "Anti-Flee Bath",
  "Aromatherapy",
];

const serviciosEspanol = [
  "Baño",
  "Corte de pelo",
  "Corte de uñas",
  "Limpieza dental",
  "Baño anti-pulgas",
  "Aromaterapia",
];

const getServicios = () => {
  return lan.indexOf("en") !== -1 ? serviciosIngles : serviciosEspanol;
};

const servicios = getServicios();

const precios = [34000, 22900, 14900, 27900, 64900, 45900];

const imagenes = [
  "https://images.vexels.com/media/users/3/128739/isolated/preview/97d204bf983245053464d9abe151232f-icono-de-ducha-plana-verde.png",
  "https://cdn-icons-png.flaticon.com/512/32/32069.png",
  "https://www.petkomipelu.com/wp-content/uploads/2017/08/corte-de-uñas1.png",
  "https://www.farmaciacanadasroquetas.es/wp-content/uploads/2019/07/dental_blu_border-1.png",
  "https://cdn-icons-png.flaticon.com/512/2138/2138370.png",
  "https://cdn-icons-png.flaticon.com/512/1986/1986348.png",
];

const serviciosSeleccionados = {
  Baño: false,
  "Corte de pelo": false,
  "Corte de uñas": false,
  "Limpieza dental": false,
  "Baño anti-pulgas": false,
  Aromaterapia: false,
};

const formatToCurrency = (amount) => {
  return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

function CuadroServicioLimpieza(props) {
  const [seleccionado, setSeleccionado] = useState(false);
  const [stringClaseCuadro, setStringClaseCuadro] = useState("cuadro-servicio");

  let alternarSeleccionServicio = () => {
    if (!seleccionado) {
      setStringClaseCuadro("cuadro-servicio-seleccionado");
      setSeleccionado(true);
      serviciosSeleccionados[props.nombre] = true;
    } else {
      setStringClaseCuadro("cuadro-servicio");
      setSeleccionado(false);
      serviciosSeleccionados[props.nombre] = false;
    }
    props.actualizarTotal();
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-4">
      <div
        onClick={() => {
          alternarSeleccionServicio();
        }}
        className={stringClaseCuadro}
      >
        <div className="titulo-servicio">{props.nombre}</div>
        <div className="precio-servicio">{props.precio}</div>
        <img
          src={props.imagen}
          alt={"imagen del servicio " + props.nombre}
          className="img-fluid"
          style={{
            maxHeight: "64px",
            marginTop: "30px",
            textAlign: "center",
          }}
        />
      </div>
    </div>
  );
}

export default function OrdenarServicioLimpieza() {
  const [mensajeInformativo, setMensajeInformativo] = useState("");
  const [estadoPopUp, setEstadoPopUp] = useState(false);
  const [redireccionarPopUp, setRedireccionarPopUp] = useState(false);
  const [
    direccionRedireccionamientoPopUp,
    setDireccionRedireccionamientoPopUp,
  ] = useState("");

  const [inputs, setInputs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [mascotasDueño, setMascotasDueño] = useState([]);
  const [lugaresDisponibles, setLugaresDisponibles] = useState({});

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      setLoggedIn(false);
    } else {
      if (!navigator.onLine) {
        if (localStorage.getItem("mascotas") === null) setMascotasDueño([]);
        else setMascotasDueño(localStorage.getItem("mascotas"));

        if (localStorage.getItem("tiendas") === null) setLugaresDisponibles([]);
        else setLugaresDisponibles(localStorage.getItem("tiendas"));
      } else {
        setLoggedIn(true);
        const decoded = jwt(localStorage.getItem("token"));
        fetch(urlMascotas)
          .then((res) => res.json())
          .then((res) => {
            let listaMascotas = [];
            Object.values(res).forEach((mascota) => {
              if (mascota.UserUsername === decoded.username) {
                listaMascotas.push(mascota.nombre);
              }
            });
            if (listaMascotas.length === 0) {
              setMensajeInformativo(<FormattedMessage id="AtLeastOnePet" />);
              setRedireccionarPopUp(true);
              setDireccionRedireccionamientoPopUp("/addPet");
              setEstadoPopUp(true);
            }
            localStorage.setItem("mascotas", listaMascotas);
            setMascotasDueño(listaMascotas);
          })
          .catch((error) => {
            console.error(error);
          });
        fetch(urlTiendas)
          .then((res) => res.json())
          .then((res) => {
            let listaTiendas = {};
            Object.values(res).forEach((tienda) => {
              listaTiendas[tienda.nombre] = tienda.id;
            });
            localStorage.setItem("tiendas", listaTiendas);
            setLugaresDisponibles(listaTiendas);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, []);

  const actualizarTotal = () => {
    let total = 0;
    Object.keys(servicios).forEach((i) => {
      if (serviciosSeleccionados[servicios[i]]) total += precios[i];
    });
    setTotalAPagar(total);
  };

  let renderServiciosDeLimpieza = () => {
    return Object.keys(servicios).map((i) => {
      return (
        <CuadroServicioLimpieza
          key={servicios[i]}
          nombre={servicios[i]}
          precio={formatToCurrency(precios[i])}
          imagen={imagenes[i]}
          actualizarTotal={actualizarTotal}
        ></CuadroServicioLimpieza>
      );
    });
  };

  let enlistarLugares = () => {
    return Object.keys(lugaresDisponibles).map((lugar) => {
      return <option key={lugar.id}>{lugar}</option>;
    });
  };
  let enlistarMascotas = () => {
    return Object.values(mascotasDueño).map((mascota) => {
      return <option key={mascota.id}>{mascota}</option>;
    });
  };

  let renderCuadroFormulario = () => {
    if (!loggedIn) {
      return (
        <div className="cuadro-formulario" key="cuadro-formulario">
          <div className="texto-total-a-pagar" key="texto-total-a-pagar">
            <FormattedMessage id="TotalCheckout"></FormattedMessage>
            {":" + formatToCurrency(totalAPagar)}
          </div>
          <div
            className="texto-login-requerido"
            style={{
              marginTop: "30px",
            }}
          >
            <p>
              <FormattedMessage id="LoginRequired"></FormattedMessage>
            </p>
          </div>
        </div>
      );
    }

    const handleChange = (event) => {
      setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      const parsedInput = {};
      const decoded = jwt(localStorage.getItem("token"));
      let descripcion = "";

      Object.keys(servicios).forEach((act) => {
        if (serviciosSeleccionados[servicios[act]]) {
          descripcion +=
            servicios[act] + " - " + formatToCurrency(precios[act]) + ",";
        }
      });
      descripcion += "TOTAL: " + formatToCurrency(totalAPagar);

      parsedInput.tipo = "limpieza";
      parsedInput.descripcion = descripcion;
      parsedInput.UserUsername = decoded.username;

      if (
        inputs.mascotaSeleccionada === undefined ||
        inputs.lugarSeleccionado === undefined ||
        inputs.mascotaSeleccionada.toString() === "---" ||
        inputs.lugarSeleccionado.toString() === "---"
      ) {
        setMensajeInformativo(
          <FormattedMessage id="SelectPetAndPlace"></FormattedMessage>,
        );
        setEstadoPopUp(true);
      } else {
        fetch(urlServicios, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedInput),
        })
          .then((res) => res.json())
          .then((servicio) => {
            if (servicio.error) {
              setMensajeInformativo("Error (1): " + servicio.error.toString());
              setEstadoPopUp(true);
            } else {
              const parsedInput2 = {};
              parsedInput2.fechaInicio = inputs.fechaSeleccionada;
              let cantidadServicios = 0;
              Object.values(serviciosSeleccionados).forEach((act) => {
                if (act) cantidadServicios++;
              });
              parsedInput2.duracion = 60 * cantidadServicios + "";
              parsedInput2.comentarios =
                "Servicio para " +
                inputs.mascotaSeleccionada +
                " en " +
                inputs.lugarSeleccionado;
              parsedInput2.UserUsername = decoded.username;
              parsedInput2.idServicio = servicio.id;
              //parsedInput2.idTiendaMascotas = lugaresDisponibles[inputs.lugarSeleccionado]
              fetch(urlCitas, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedInput2),
              })
                .then((res) => res.json())
                .then((cita) => {
                  if (cita.error) {
                    setMensajeInformativo(
                      "Error (2): " + cita.error.toString(),
                    );
                    setEstadoPopUp(true);
                  } else {
                    setMensajeInformativo(
                      <FormattedMessage id="ReservationSuccesful"></FormattedMessage>,
                    );
                    setRedireccionarPopUp(true);
                    setDireccionRedireccionamientoPopUp("/");
                    setEstadoPopUp(true);
                  }
                })
                .catch((error) => {
                  if (
                    error.toString() ===
                    "SyntaxError: Unexpected token m in JSON at position 11"
                  ) {
                    setMensajeInformativo(
                      <FormattedMessage id="SelectAService"></FormattedMessage>,
                    );
                    setEstadoPopUp(true);
                  } else if (
                    error.toString() ===
                    "SyntaxError: Unexpected token i in JSON at position 14"
                  ) {
                    setMensajeInformativo(
                      <FormattedMessage id="SelectADate"></FormattedMessage>,
                    );
                    setEstadoPopUp(true);
                  } else {
                    console.error(error);
                    setMensajeInformativo("Error: " + error.toString());
                    setEstadoPopUp(true);
                  }
                });
            }
          })
          .catch((error) => {
            console.error(error);
            setMensajeInformativo("Error: " + error.toString());
            setEstadoPopUp(true);
          });
      }
    };

    return (
      <div className="cuadro-formulario">
        <div className="texto-total-a-pagar">
          <FormattedMessage id="TotalCheckout"></FormattedMessage>
          {": " + formatToCurrency(totalAPagar)}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group col-sm-12 col-md-6 col-lg-4">
              <div className="seccion-formulario">
                <label
                  key="MascotaSeleccionadaLabel"
                  htmlFor="mascotaSeleccionada"
                >
                  <FormattedMessage id="GroomingFor" />:
                </label>
                <select
                  key="MascotaSeleccionadaselect"
                  name="mascotaSeleccionada"
                  className="form-control"
                  id="mascotaSeleccionada"
                  onChange={handleChange}
                >
                  <option key={"inicial"}> --- </option>
                  {enlistarMascotas()}
                </select>
              </div>
            </div>
            <div className="form-group col-sm-12 col-md-6 col-lg-4">
              <div className="seccion-formulario">
                <label htmlFor="fechaSeleccionada">
                  <FormattedMessage id="Date" />:
                </label>
                <input
                  id="fechaSeleccionada"
                  name="fechaSeleccionada"
                  type="datetime-local"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group col-sm-12 col-md-6 col-lg-4">
              <div className="seccion-formulario">
                <label key="lugarSeleccionadoLabel" htmlFor="lugarSeleccionado">
                  <FormattedMessage id="Place" />:
                </label>
                <select
                  key="lugarSeleccionadoSelect"
                  name="lugarSeleccionado"
                  className="form-control"
                  id="lugarSeleccionado"
                  onChange={handleChange}
                >
                  <option key={"otroInicial"}> --- </option>
                  {enlistarLugares()}
                </select>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            <FormattedMessage id="Schedule" />
          </button>
        </form>
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

      <div className="containter">
        <div
          key="fila_contenedora"
          className="row"
          style={{ backgroundColor: "#E7E4F2" }}
        >
          <h1>
            <FormattedMessage id="ChooseGroomingServices" />
          </h1>
          {renderServiciosDeLimpieza()}
          {renderCuadroFormulario()}
        </div>
      </div>
    </div>
  );
}
