import "./assets/index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";

import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<HashRouter>
			<Routes>
				{/* <Route path="/" index element={<Navigate to={"/"} replace />} /> */}
				<Route path="/*" element={<App />} />
			</Routes>
		</HashRouter>
	</React.StrictMode>,
);
