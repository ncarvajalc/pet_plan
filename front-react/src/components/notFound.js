import "./css/notFound.scss";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="not-found">
      <h1>
        404 <FormattedMessage id="NotFound" />
      </h1>
      <p>
        <Link to="/">
          <FormattedMessage id="GoHome" />
        </Link>
      </p>
    </div>
  );
}
