import { useState, useEffect } from "react";
import Login from "./loginForm";
import jwt from "jwt-decode";
import Signup from "./signUpForm";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/app.css";
import AddCard from "./addCard";
import Profile from "./profile";
import OrdenarServicioLimpieza from "./servicioLimpieza";
import Servicios from "./servicios";
import ReagendarEntrenamiento from "./reagendarEntrenamiento";
import ContratarEntrenamiento from "./contratarEntrenmaiento";
import ContratarVeterinario from "./contratarVeterinario";
import ReagendarVeterinario from "./reagendarVeterinario";
import Users from "./users";
import Citas from "./citas";
import Landing from "./landing";
import Planes from "./plans";
import PlanesI from "./plansI";
import CancelChangePlan from "./planA";
import MenuServicioLimpieza from "./menuServicioLimpieza";
import Guarderia from "./contratarGuarderia";
import ReagendarGuarderia from "./reagendarGuarderia";
import ListarServiciosLimpieza from "./listarServiciosLimpieza";
import AddPet from "./addPet";
import Dashboard from "./dashboard";
import PageNotFound from "./notFound";
import { useAuth0 } from "@auth0/auth0-react";
import { FormattedMessage } from "react-intl";
const urlUser = process.env.REACT_APP_RUTA_RAIZ + "/users/";
const urlAddSus = process.env.REACT_APP_RUTA_RAIZ + "/suscripciones";
const urlLogin = process.env.REACT_APP_RUTA_RAIZ + "/users/login";

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading, user } =
    useAuth0();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [tieneSus, setTieneSus] = useState(false);
  const [tipoPlan, setTipoPlan] = useState(0);
  const [profileCompleted, setProfileCompleted] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(urlUser + user.email).then((res) => {
        if (!res.ok) setProfileCompleted(false);
        else {
          fetch(urlLogin, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: user.email,
              password: "admin",
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.success) {
                const token = res.token;
                localStorage.setItem("token", token);
                setProfileCompleted(true);
                const decoded = jwt(localStorage.getItem("token"));
                setRole(decoded.role);
                setUsername(decoded.username);
              }
            });
        }
      });
    }

    if (localStorage.getItem("token") === null) {
      setTieneSus(false);
      setTipoPlan(0);
    } else {
      const decoded = jwt(localStorage.getItem("token"));
      setRole(decoded.role);
      setUsername(decoded.username);
    }
  }, [isAuthenticated, user]);

  const logginSuccess = () => {
    loginWithRedirect();
    const decoded = jwt(localStorage.getItem("token"));
    setRole(decoded.role);
    setUsername(decoded.username);
    buscarSus();
  };

  const logOut = () => {
    localStorage.removeItem("token");
    logout();
    setProfileCompleted(true);
    setRole("");
    setUsername("");
    setTieneSus(false);
    setTipoPlan(0);
  };

  const buscarSus = () => {
    fetch(urlAddSus)
      .then((res) => res.json())
      .then((data) => {
        for (let i in data) {
          let per = data[i]["suscripcionUsername"];
          if (per === username) {
            setTieneSus(true);
            setTipoPlan(data[i]["planId"]);
          }
        }
      });
  };

  const activarSuscripcion = () => {
    setTieneSus(true);
    buscarSus();
  };
  const desactivarSuscripcion = () => {
    setTieneSus(false);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profileCompleted && isAuthenticated) {
    return (
      <BrowserRouter>
        <main className="container-fluid">
          <Routes>
            <Route
              path="/"
              element={<Signup logginSuccess={logginSuccess} />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    );
  }
  return (
    <>
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src={"/assets/logo.svg"} alt="Logo de PetPlan"></img>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <ul className="navbar-nav">
                <li
                  className="nav-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Click here for going to the home page"
                >
                  <Link className="nav-link" to="/">
                    <FormattedMessage id="Home" />
                  </Link>
                </li>
                {isAuthenticated ? (
                  <li
                    className="nav-item"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Click here to see all available services"
                  >
                    <Link className="nav-link" to="/servicios">
                      <FormattedMessage id="Services" />
                    </Link>
                  </li>
                ) : null}
                {isAuthenticated ? (
                  role === "admin" ? (
                    <li
                      className="nav-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Click here to go to the dashboard"
                    >
                      <Link className="nav-link" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                  ) : null
                ) : null}
                <li
                  className="nav-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Click here to see all available plans"
                >
                  {isAuthenticated && tieneSus ? (
                    <Link className="nav-link" to="/planA">
                      <FormattedMessage id="Plans" />
                    </Link>
                  ) : (
                    <Link className="nav-link" to="/planes">
                      <FormattedMessage id="Plans" />
                    </Link>
                  )}
                </li>
                {!isAuthenticated ? (
                  <>
                    <li
                      className="nav-item push"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Click here to go to the sign up page"
                    >
                      <button
                        className="nav-link button-purple"
                        aria-current="page"
                        onClick={() => loginWithRedirect()}
                      >
                        <span className="white-font">
                          <FormattedMessage id="SignUp" />
                        </span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item dropdown push">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#void"
                        id="navbarDropdownMenuLink"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {user ? user.email : ""}
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdownMenuLink"
                      >
                        <li
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Click here to go to your dashboard"
                        >
                          <Link className="dropdown-item" to="/profile">
                            <FormattedMessage id="Profile" />
                          </Link>
                        </li>
                        <li
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Click here to close your session"
                        >
                          <Link
                            className="dropdown-item"
                            to="/"
                            onClick={logOut}
                          >
                            <FormattedMessage id="SignOut" />
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {role === "vet" ? <></> : <></>}
        {role === "admin" ? <></> : <></>}
        <main className="container-fluid">
          <Routes>
            <Route
              path="/"
              element={<Landing isAuthenticated={isAuthenticated} />}
            />
            <Route path="/*" element={<PageNotFound />} />
            <Route
              path="signup"
              element={<Signup logginSuccess={logginSuccess} />}
            />
            <Route
              path="login"
              element={<Login logginSuccess={logginSuccess} />}
            />
            <Route path="servicios" element={<Servicios />} />
            <Route
              path="servicios/entrenamiento"
              element={<ContratarEntrenamiento user={user ? user.email : ""} />}
            />
            <Route
              path="servicios/entrenamiento/:citaId"
              element={<ReagendarEntrenamiento user={user ? user.email : ""} />}
            />
            <Route
              path="servicios/veterinario"
              element={<ContratarVeterinario user={user ? user.email : ""} />}
            />
            <Route
              path="servicios/veterinario/:citaId"
              element={<ReagendarVeterinario user={user ? user.email : ""} />}
            />
            <Route
              path="servicios/guarderia"
              element={<Guarderia user={user ? user.email : ""} />}
            />
            <Route
              path="servicios/guarderia/:citaId"
              element={<ReagendarGuarderia user={user ? user.email : ""} />}
            />
            <Route path="addCard" element={<AddCard />} />
            <Route
              path="servicios/limpieza"
              element={<MenuServicioLimpieza />}
            />
            <Route
              path="servicios/limpieza/contratar"
              element={<OrdenarServicioLimpieza />}
            />
            <Route
              path="servicios/limpieza/listar"
              element={<ListarServiciosLimpieza />}
            />
            <Route path="profile" element={<Profile logoutFn={logOut} />} />
            <Route
              path="planes"
              element={<Planes activarSuscripcion={activarSuscripcion} />}
            />
            <Route path="planesI" element={<PlanesI />} />
            <Route
              path="planA"
              element={
                <CancelChangePlan
                  tipoPlan={tipoPlan}
                  desactivarSuscripcion={desactivarSuscripcion}
                />
              }
            />
            <Route path="usuarios" element={<Users />} />
            <Route path="citas" element={<Citas />} />
            <Route path="addPet" element={<AddPet />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <div className="fat-footer" id="fat-footer">
          <aside className="extra-footer" id="extra-footer">
            <div className="container">
              <div className="row">
                <div className="col-sm">
                  <center>
                    <b>
                      <FormattedMessage id="Services" />
                    </b>
                  </center>
                </div>
                <div className="col-sm">
                  <center>
                    <b>
                      <FormattedMessage id="Plans" />
                    </b>
                  </center>
                </div>
                <div className="col-sm">
                  <center>
                    <b>
                      <FormattedMessage id="Accounts" />
                    </b>
                  </center>
                </div>
              </div>
            </div>
          </aside>
          <footer className="standard-footer" id="standard-footer">
            <div className="container">
              <div className="row">
                <div className="col-sm">
                  <center>
                    {isAuthenticated ? (
                      <>
                        <a href="/servicios/limpieza">
                          <small className="text-muted">
                            <FormattedMessage id="Grooming" />
                          </small>
                        </a>
                        <br></br>
                        <a href="/servicios/veterinario">
                          <small className="text-muted">
                            <FormattedMessage id="Veterinary" />
                          </small>
                        </a>
                        <br></br>
                        <a href="/servicios/guarderia">
                          <small className="text-muted">
                            <FormattedMessage id="Daycare" />
                          </small>
                        </a>
                        <br></br>
                        <a href="/servicios/entrenamiento">
                          <small className="text-muted">
                            <FormattedMessage id="Training" />
                          </small>
                        </a>
                      </>
                    ) : (
                      <>
                        <small className="text-muted">
                          <FormattedMessage id="Grooming" />
                        </small>
                        <br></br>
                        <small className="text-muted">
                          <FormattedMessage id="Veterinary" />
                        </small>
                        <br></br>
                        <small className="text-muted">
                          <FormattedMessage id="Daycare" />
                        </small>
                        <br></br>
                        <small className="text-muted">
                          <FormattedMessage id="Training" />
                        </small>
                        <br></br>
                      </>
                    )}
                  </center>
                </div>
                <div className="col-sm">
                  <center>
                    {isAuthenticated ? (
                      <>
                        <small className="text-muted">Gold</small>
                        <br></br>
                        <small className="text-muted">Silver</small>
                        <br></br>
                        <small className="text-muted">Bronce</small>
                      </>
                    ) : (
                      <>
                        <a href="/planes">
                          <small className="text-muted">Gold</small>
                        </a>
                        <br></br>
                        <a href="/planes">
                          <small className="text-muted">Silver</small>
                        </a>
                        <br></br>
                        <a href="/planes">
                          <small className="text-muted">Bronce</small>
                        </a>
                      </>
                    )}
                  </center>
                </div>
                <div className="col-sm">
                  <center>
                    {isAuthenticated ? (
                      <>
                        <small className="text-muted">
                          <FormattedMessage id="SignUp" />
                        </small>
                        <br></br>
                        <small className="text-muted">Login</small>
                        <br></br>
                        <a href="/profile">
                          <small className="text-muted">
                            <FormattedMessage id="Profile" />
                          </small>
                        </a>
                      </>
                    ) : (
                      <>
                        <a href="#signUp" onClick={() => loginWithRedirect()}>
                          <small className="text-muted">
                            <FormattedMessage id="SignUp" />
                          </small>
                        </a>
                        <br></br>
                        <a href="#logIn" onClick={() => loginWithRedirect()}>
                          <small className="text-muted">Login</small>
                        </a>
                        <br></br>
                        <small className="text-muted">
                          <FormattedMessage id="Profile" />
                        </small>
                      </>
                    )}
                  </center>
                </div>
              </div>
            </div>
            <center>
              <p>© 2022 - Programacion con tecnologias web</p>
            </center>
          </footer>
        </div>
      </BrowserRouter>
    </>
  );
}
