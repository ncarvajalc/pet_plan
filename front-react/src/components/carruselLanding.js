import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "./css/landing.scss";
import opinion1Es from "./assets/opinion1-es.png";
import opinion2Es from "./assets/opinion2-es.png";
import opinion3Es from "./assets/opinion3-es.png";
import opinion1En from "./assets/opinion1-en.png";
import opinion2En from "./assets/opinion2-en.png";
import opinion3En from "./assets/opinion3-en.png";

function CarruselLanding() {
  const lan = navigator.language || navigator.userLanguage;

  const imagenesIngles = [opinion1En, opinion2En, opinion3En];
  const imagenesEspanol = [opinion1Es, opinion2Es, opinion3Es];

  const getImagenes = () => {
    return lan.indexOf("en") !== -1 ? imagenesIngles : imagenesEspanol;
  };

  const imagenes = getImagenes();

  return (
    <Carousel
      autoPlay="true"
      infiniteLoop="true"
      interval="5000"
      showStatus="false"
      showIndicators="false"
      renderThumbs={() => {}}
      dynamicHeight="false"
    >
      <div>
        <ElementoCarrousel imagen={imagenes[0]}></ElementoCarrousel>
      </div>
      <div>
        <ElementoCarrousel imagen={imagenes[1]}></ElementoCarrousel>
      </div>
      <div>
        <ElementoCarrousel imagen={imagenes[2]}></ElementoCarrousel>
      </div>
    </Carousel>
  );
}

class ElementoCarrousel extends Component {
  render() {
    return (
      <div>
        <img
          className="img-perfil"
          src={this.props.imagen}
          alt={this.props.imagen}
        ></img>
      </div>
    );
  }
}

export default CarruselLanding;
