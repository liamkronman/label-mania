import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import {
	DisplayTrapData,
	RoundBeginData,
	RoundEndData,
	SubmitTrapData,
	Trap,
} from "../types/GameTypes";
import { useNavigate } from "react-router-dom";

import { io, Socket } from "socket.io-client";

const POST_BACKEND_URL = "./idk_where";

const Game = (props: any) => {
	const navigate = useNavigate();
	const [roundData, setRoundData] = useState<RoundBeginData>();
	const [socket, setSocket] = useState<Socket>();

	const [scores, setScores] = useState<{ [key: string]: number }>();
	const [additionalTraps, setAdditionalTraps] = useState<{
		[key: string]: DisplayTrapData;
	}>();
	
	const [accessToken, setAccessToken] = useState<any>(null);
	
	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			setAccessToken(localStorage.getItem("accessToken"));
		} else {
			navigate("../login");
		}
	}, []);

	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		setSocket((prev) =>
			prev === undefined ? io("http://159.223.143.90", { port: 3000 }) : prev
		);
		if (socket !== undefined) {
			socket.on("connect", () => {
				console.log("Connected; Socket connection status:", socket.connected); // true
			});
			socket.on("connect_error", (err) => {
				console.log(`connect_error due to ${err.message}`);
			});
			socket.on("disconnect", () => {
				console.log(
					"Disconnected; Socket connection status:",
					socket.connected
				); // false
			});

			socket.on("debug", (data) => {
				console.log("Debug:", data);
			});
			socket.on("begin_game", (data) => {
				console.log("Game has begun!");
				setScores(data.scores);
			});
			socket.on("begin_round", (data) => {
				console.log("Round has begun!");
				setRoundData(data);
				setAdditionalTraps(undefined);
			});
			socket.on("end_round", (data) => {
				console.log("Round has ended!");
				setScores(data.scores);
				setAdditionalTraps(data.traps);
			});
		}
	}, [socket]);

	function submitTrap(trap: Trap) {
		const data: SubmitTrapData = {
			...trap,
		};
		axios.post(POST_BACKEND_URL, data).then((value) => {
			const response: RoundEndData = value.data; // todo: make sure this works
			setScores(response.scores);
			setAdditionalTraps(response.traps);
		});
	}

	return (
		<>
			<div id="container">
				{(roundData !== undefined && (
					<>
						<h1>Trap the {roundData.target}!</h1>
						<img
							src={roundData.imgurl}
							alt=""
							style={{ zIndex: 0, position: "absolute" }}
							draggable={false}
							ref={imgRef}
						/>
						<Canvas
							style={{ zIndex: 1, position: "absolute", top: 0 }}
							submitTrap={submitTrap}
							imgRef={imgRef}
							additionalTraps={additionalTraps}
						/>
					</>
				)) || <>Waiting for game to start</>}
				<br />
			</div>
		</>
	);
};

export default Game;
