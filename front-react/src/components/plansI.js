import "./css/plans.css";
import icon from "./assets/huella.png";
import { FormattedMessage } from "react-intl";

export default function AddSus(props) {
  return (
    <div className="container">
      <div className="row justify-content-between">
        <div className="col col-rounded" id="columna3">
          <center>
            <h2>Bronce</h2>
          </center>
          <ul>
            <li>
              <FormattedMessage id="Bronce1" />
            </li>
            <li>
              {" "}
              <FormattedMessage id="Bronce2" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Bronce3" />{" "}
            </li>
          </ul>
          <center>
            <img className="photo" src={icon} alt="Huella" />
            <h2> $14.900 </h2>
          </center>
        </div>
        <div className="col col-rounded" id="columna1">
          <center>
            <h2>Silver</h2>
          </center>
          <ul>
            <li>
              {" "}
              <FormattedMessage id="Silver/Gold1" />{" "}
            </li>
            <li>
              <FormattedMessage id="Silver/Gold2" />
            </li>
            <li>
              {" "}
              <FormattedMessage id="Silver3" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Silver/Gold4" />{" "}
            </li>
          </ul>
          <center>
            <img className="photo" src={icon} alt="Huella" />
            <h2> $34.900 </h2>
          </center>
        </div>
        <div className="col col-rounded" id="columna2">
          <center>
            <h2>Gold</h2>
          </center>
          <ul>
            <li>
              <FormattedMessage id="Silver/Gold1" />
            </li>
            <li>
              <FormattedMessage id="Silver/Gold2" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Gold3" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Silver/Gold4" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Gold5" />{" "}
            </li>
            <li>
              {" "}
              <FormattedMessage id="Gold6" />{" "}
            </li>
          </ul>
          <center>
            <img className="photo" src={icon} alt="Huella" />
            <h2> $99.900 </h2>
          </center>
        </div>
      </div>
    </div>
  );
}
