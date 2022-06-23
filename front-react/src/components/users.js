import { useEffect, useState } from "react";
//import "./css/users.css";
const urlUsers = process.env.REACT_APP_RUTA_RAIZ + "/users";

export default function Users() {
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
    <>
      <div id="fondo">
        <h1>Usuarios - Total: {users.length}</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Mascota</th>
              <th scope="col">Suscripción</th>
              <th scope="col">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr>
                <td>{user.nombre}</td>
                <td>mascota</td>
                <td>Suscripcion</td>
                <td>
                  <button id="button-morado" aria-current="page">
                    +
                  </button>
                </td>
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
    </>
  );
}
