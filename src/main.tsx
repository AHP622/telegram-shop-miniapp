import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// HashRouter (not BrowserRouter) on purpose: when this build is hosted as
// static files from a Supabase Storage public bucket (no server-side
// rewrites available), routes like /product/:id must live after a # so a
// direct link always resolves to index.html.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
