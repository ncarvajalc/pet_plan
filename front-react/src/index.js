import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/app";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { IntlProvider } from "react-intl";
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./auth_config.json";
import history from "./utils/history";
import localeEsMessages from "./locales/es";
import localeEnMessages from "./locales/en";

const lan = navigator.language || navigator.userLanguage;

const getLocale = () => {
  console.log(lan);
  return lan.indexOf("en") !== -1 ? localeEnMessages : localeEsMessages;
};
// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <IntlProvider locale={lan} messages={getLocale()}>
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </IntlProvider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
