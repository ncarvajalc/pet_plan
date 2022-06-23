import { useState } from "react";

export default function CitasGuarderia(props) {
  const url = "/users";
  const [citas, setCitas] = useState([]);

  //TODO En la ruta de citas no se pueden filtrar por usuario

  return (
    <div className="row">
      <h1>Aqui van las citas del usuario</h1>
    </div>
  );
}
