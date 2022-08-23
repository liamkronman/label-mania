import axios from "axios";
import { useRef, useState } from "react";
import Canvas from "./Canvas";
import {
	DisplayTrapData,
	RoundBeginData,
	RoundEndData,
	SubmitTrapData,
	Trap,
} from "./GameTypes";

const POST_BACKEND_URL = "./idk_where";
const SAMPLE_ROUND_BEGIN_DATA = {
	imgurl: "./cat.webp",
	target: "cat",
};

const Game = (props: any) => {
	const [roundData, setRoundData] = useState<RoundBeginData>(
		SAMPLE_ROUND_BEGIN_DATA
	);
	const [scores, setScores] = useState<{ [key: string]: number }>();
	const [additionalTraps, setAdditionalTraps] = useState<{
		[key: string]: DisplayTrapData;
	}>();

	const imgRef = useRef<HTMLImageElement>(null);

	function requestNewRound() {
		axios.get(POST_BACKEND_URL).then((value) => {
			const data: RoundBeginData = value.data;
			setRoundData(data);
		});
	}

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
						/>
					</>
				)) || <>Waiting for game to start</>}
				<br />
			</div>
		</>
	);
};

export default Game;
