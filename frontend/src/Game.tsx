import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import {
	DisplayTrapData,
	RoundBeginData,
	RoundEndData,
	SubmitTrapData,
	Trap,
} from "./GameTypes";

import { io, Socket } from "socket.io-client";

const POST_BACKEND_URL = "./idk_where";
const SAMPLE_ROUND_BEGIN_DATA = {
	imgurl: "./cat.webp",
	target: "cat",
};

const Game = (props: any) => {
	const [roundData, setRoundData] = useState<RoundBeginData>(
		SAMPLE_ROUND_BEGIN_DATA
	);
	const [socket, setSocket] = useState<Socket>();

	const [scores, setScores] = useState<{ [key: string]: number }>();
	const [additionalTraps, setAdditionalTraps] = useState<{
		[key: string]: DisplayTrapData;
	}>();

	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		setSocket((prev) =>
			prev === undefined ? io("http://localhost:3000", { port: 3000 }) : prev
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
