import "./App.css";
import React from "react";
import Canvas from "./Canvas";

function App() {
	return (
		<div id="container">
			<img
				src={"./cat.webp"}
				alt=""
				style={{ zIndex: 0, position: "absolute" }}
				draggable={false}
			/>
			<Canvas style={{ zIndex: 1, position: "fixed", top: 0 }} />
			<br />
		</div>
	);
}

export default App;
