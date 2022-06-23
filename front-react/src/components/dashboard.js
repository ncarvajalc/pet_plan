import { FormattedMessage } from "react-intl";
import "./css/dashboard.scss";
import Bar from "./dashboardGrafica.js";

function Dashboard() {
  const data = [
    { item: "Grooming", count: 67 },
    { item: "Veterinary", count: 40 },
    { item: "Training", count: 12 },
    { item: "Daycare", count: 52 },
  ];
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col" style={{ width: "50%" }}>
          <h2>
            <FormattedMessage id="ServicesByType"></FormattedMessage>
          </h2>
          <Bar data={data} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
