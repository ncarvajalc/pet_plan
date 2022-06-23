import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./css/profile.scss";

import card from "./assets/smallCard.png";
import userProfile from "./assets/userprofile.png";
import pet from "./assets/pet.png";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
const urlUser = process.env.REACT_APP_RUTA_RAIZ + "/users/";
const urlCita = process.env.REACT_APP_RUTA_RAIZ + "/citas/";

export default function Profile({ logoutFn }) {
  const [user, setUser] = useState({});
  const [tarjetas, setTarjetas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  let navigate = useNavigate();

  const ir = (url, servicio) => {
    navigate(`/servicios/${servicio.toLowerCase()}/${url}`);
  };

  const { user: usuario } = useAuth0();
  useEffect(() => {
    fetch(urlUser + usuario.email)
      .then((res) => res.json())
      .then((user) => {
        setUser(user);
        setTarjetas(user.tarjetas);
        setMascotas(user.mascotas);
        // user.servicios
        // Sacando los id's de los Servicios para filtar las citas después
        let idServ = user.servicios.reduce((result, item) => {
          return result.concat(item.id);
        }, []);

        fetch(urlCita)
          .then((res) => res.json())
          .then((citas) => {
            let citasUser = citas.filter((cita) =>
              idServ.includes(cita.idServicio),
            );
            citasUser = citasUser.map((cita) => {
              let servicio = user.servicios.find(
                (servicio) => servicio.id === cita.idServicio,
              );
              return {
                tipo: servicio.tipo,
                descripcion: servicio.descripcion,
                ...cita,
              };
            });
            setCitas(citasUser);
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [usuario]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="row">
      <div className="contenedor">
        <div className="left">
          <h1>Perfil</h1>
          <div className="datos-basicos">
            {user.img ? (
              <img src={user.img} alt="Foto de perfil" />
            ) : (
              <img src={userProfile} alt="Foto de perfil" />
            )}

            <div className="data">
              <h5>Nombre</h5>
              <p>{user.nombre}</p>
            </div>
            <div className="data">
              <h5>Rol</h5>
              <p>{user.role}</p>
            </div>
            <div className="data">
              <h5>Correo</h5>
              <p>{user.correo}</p>
            </div>
            <div className="data">
              <h5>Teléfono</h5>
              <p>{user.telefono}</p>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => {
                logoutFn();
                navigate("/");
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className="right">
          <div className="citas">
            <h2>Últimas Citas</h2>
            {citas.length === 0 ? (
              <p className="no-cards-text">No tienes citas por el momento</p>
            ) : null}
            {citas.map((cita) => (
              <div
                className="citas-container"
                onClick={() => {
                  ir(cita.id, cita.tipo);
                }}
              >
                <div key={cita.id} className="cita-item">
                  <div className="cita-item-col">{cita.tipo}</div>
                  <div className="cita-item-col">
                    {new Date(cita.fechaInicio).toLocaleString()}
                  </div>
                  <div className="cita-item-col">{cita.descripcion}</div>
                  <div className="cita-item-col">{cita.duracion} Min</div>
                </div>
              </div>
            ))}
          </div>
          <h2>Mis Mascotas</h2>
          {mascotas.length === 0 ? (
            <p className="no-cards-text">
              Ups... Parece que no tienes mascotas. Agrega una para vivir la
              experiencia PetPlan completa
            </p>
          ) : null}
          <div className="mascotas">
            {mascotas.map((mascota) => (
              <div key={mascota.id} className="mascota">
                <div className="img">
                  {mascota.img ? (
                    <img src={mascota.img} alt="Foto de perfil" />
                  ) : (
                    <img src={pet} alt="Foto de perfil" />
                  )}
                </div>

                <div className="nombre">
                  <p>{mascota.nombre}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="boton-mascotas">
            <Link className="btn button-purple-add-card" to="/addPet">
              <span className="white-font">Añadir mascota +</span>
            </Link>
          </div>
          <h2>Tarjetas</h2>
          {tarjetas.length === 0 ? (
            <p className="no-cards-text">
              Ups... Parece que no tienes tarjetas. Agrega una para vivir la
              experiencia PetPlan completa
            </p>
          ) : null}

          <div className="row tarjetas">
            {tarjetas.map((tarjeta) => (
              <div
                className="col-12 col-sm-6 col-lg-4 purple-card text-center"
                key={tarjeta.id}
              >
                <img
                  className="card-img"
                  src={card}
                  alt={`Card ${tarjeta.id}`}
                ></img>
                <p className="card-number">
                  **** **** **** {(" " + tarjeta.numero).slice(-4)}
                </p>
              </div>
            ))}
          </div>
          <div className="boton-mascotas">
            <Link className="btn button-purple-add-card" to="/addCard">
              <span className="white-font"> Agregar tarjeta + </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
