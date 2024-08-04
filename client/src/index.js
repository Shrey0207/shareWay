import React from "react";
import * as ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./pages/App";
import Signup from "./pages/Signup";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

const routing = (
  <Router>
    <div>
      <Routes>
        <Route path="/" Component={App} element={<App />} exact />
        <Route path="/signup" component={Signup} element={<Signup />} />
      </Routes>
    </div>
  </Router>
);

root.render(routing);
