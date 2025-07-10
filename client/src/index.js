import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// If you are using React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you are using React 17 or below, use this instead:
// ReactDOM.render(<App />, document.getElementById('root'));