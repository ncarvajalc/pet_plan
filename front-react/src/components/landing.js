import React from "react";
import PlanesI from "./plansI";
import "./css/landing.scss";
import husky from "./assets/landing/1.png";
import perritos from "./assets/landing/perritos.png";
import limpieza from "./assets/landing/limpieza.svg";
import veterinario from "./assets/landing/veterinario.svg";
import guarderia from "./assets/landing/guarderia.svg";
import entrenamiento from "./assets/landing/entrenamiento.svg";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { FormattedMessage } from "react-intl";
import CarruselLanding from "./carruselLanding";

function Landing({ isAuthenticated }) {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();

  const goLogin = () => {
    if (isAuthenticated) navigate("/planes");
    else loginWithRedirect();
  };

  const goSignUp = () => {
    if (isAuthenticated) navigate("/planes");
    else loginWithRedirect();
  };
  return (
    <>
      <div className="row">
        <div className="col-12 first">
          <div className="content row">
            <div className="col-lg-6 left">
              <div className="texto-landing">
                <h1>PetPlan</h1>
                <p>
                  <FormattedMessage id="Welcome1" />
                </p>
                <button className="btn btn-morado" onClick={goLogin}>
                  <FormattedMessage id="Explore" />
                </button>
              </div>
            </div>
            <div className="right col-lg-6">
              <img className="husky-landing" src={husky} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 second">
          <div className="row">
            <h2>
              <FormattedMessage id="Services" />
            </h2>
          </div>
          <div className="row justify-content-evenly">
            <div className="col-5 col-lg-3 text-center">
              <img className="service" src={limpieza} alt="limpieza"></img>
              <p>
                <FormattedMessage id="Grooming" />
              </p>
            </div>
            <div className="col-5 col-lg-3 text-center ">
              <img
                className="service"
                src={veterinario}
                alt="veterinario"
              ></img>
              <p>
                <FormattedMessage id="Veterinary" />
              </p>
            </div>
            <div className="col-5 col-lg-3  text-center">
              <img className="service" src={guarderia} alt="guardería"></img>
              <p>
                <FormattedMessage id="Daycare" />
              </p>
            </div>
            <div className="col-5 col-lg-3  text-center">
              <img
                className="service"
                src={entrenamiento}
                alt="entrenamiento"
              ></img>
              <p>
                <FormattedMessage id="Training" />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 third">
          <div className="content row">
            <h2>
              <FormattedMessage id="AboutUs" />
            </h2>

            <div className="right col-lg-6">
              <img className="husky-landing" src={perritos} alt="" />
            </div>
            <div className="col-lg-6 left">
              <div className="texto-landing">
                <h1>
                  <FormattedMessage id="YPLU" />
                </h1>
                <p>
                  <FormattedMessage id="Welcome2" />
                </p>
                <button className="btn btn-morado" onClick={goLogin}>
                  <FormattedMessage id="Explore" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 fourth">
          <h2 className="title-plans">
            <FormattedMessage id="Plans" />
          </h2>
          <PlanesI />
          <div className="row">
            <h2 className="title-plans">
              <FormattedMessage id="Comments" />
            </h2>
          </div>
          <CarruselLanding></CarruselLanding>
        </div>
      </div>
      <div className="row fifth">
        <div className="col-12 text-center">
          <h2>
            <FormattedMessage id="WantToKnowMore" />
          </h2>
          <p>
            {" "}
            <FormattedMessage id="StartExperience" />
          </p>
          <button className="btn btn-morado" onClick={goSignUp}>
            <FormattedMessage id="Start" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Landing;
