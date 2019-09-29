import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";

import theme from "./theme.js";
import App from "./App";

import "./index.css";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
