import { useEffect, useState } from "react";
//import "./css/users.css";
const urlUsers = process.env.REACT_APP_RUTA_RAIZ + "/users";

export default function Citas() {
  const [users, setUsers] = useState([{}]);
  useEffect(() => {
    fetch(urlUsers)
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div className="row">
      <div id="fondo">
        <h1>Citas de Hoy</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Mascota</th>
              <th scope="col">Hora</th>
              <th scope="col">Servicio</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr>
                <td>{user.nombre}</td>
                <td>mascotaX</td>
                <td>10:00 am</td>
                <td>Limpieza</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="carrules-botones">
          <div
            className="btn-toolbar"
            role="toolbar"
            aria-label="Toolbar with button groups"
          >
            <div className="btn-group" role="group" aria-label="Third group">
              <button
                type="button"
                className="btn btn-secondary"
                id="button-morado"
              >
                &#171;
              </button>
            </div>
            <div className="btn-group" role="group" aria-label="Third group">
              <button
                type="button"
                className="btn btn-secondary"
                id="button-morado"
              >
                &#60;
              </button>
            </div>
            <div className="btn-group" role="group" aria-label="Third group">
              <button
                type="button"
                className="btn btn-secondary"
                id="button-morado"
              >
                1
              </button>
            </div>
            <div className="btn-group" role="group" aria-label="Third group">
              <button
                type="button"
                className="btn btn-secondary"
                id="button-morado"
              >
                &#62;
              </button>
            </div>
            <div className="btn-group" role="group" aria-label="Third group">
              <button
                type="button"
                className="btn btn-secondary"
                id="button-morado"
              >
                &#187;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
