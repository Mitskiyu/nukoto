import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import nukoEmbarrassed from "./assets/images/nukoEmbarrassed.gif";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Toaster
			theme="dark"
			richColors
			closeButton
			style={{
				fontFamily: "Kodenmachou, sans-serif",
			}}
			position={window.innerWidth < 640 ? "top-center" : "top-right"}
			icons={{
				error: <img src={nukoEmbarrassed} alt="nuko cat embarrassed" />,
			}}
		/>
		<App />
	</StrictMode>,
);
