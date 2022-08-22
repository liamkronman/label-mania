import "./App.css";
import React from "react";
import Game from "./Game";
import { io } from "socket.io-client";

function App() {
	const URL = "http://localhost:3000";
	const socket = io(URL, { autoConnect: false });

	socket.connect();
	socket.on("hello", (x: string) => console.log(x));

	return <Game />;
}

export default App;
