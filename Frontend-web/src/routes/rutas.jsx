import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pages from "../modules/cajon/pages/Pages";

export default function Rutas() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path="/about" element={<div>About Page</div>} />
      </Routes>
    </Router>
  );
}
