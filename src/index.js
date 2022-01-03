import React from "react";
import ReactDOM from "react-dom";
import "../src/sass/style.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App";
import ErrorBoundary from "./assets/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <ErrorBoundary>
    <React.StrictMode>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </React.StrictMode>
  </ErrorBoundary>,
  document.getElementById('root')
);