import axios from "axios";
import { useState } from "react";
import { setSyntheticTrailingComments } from "typescript";
import Canvas from "./Canvas";

const POST_BACKEND_URL = "./idk_where";
type USERID_TYPE = number;

interface InitData {
	userid: USERID_TYPE;
}

interface RoundData {
	// All the information client needs to begin the round
	imgurl: string;
	target: string;
}

interface Trap {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

interface DisplayTrapData extends Trap {}

interface SubmitTrapData extends Trap {}

interface RoundEndData {
	scores: { [key: string]: number };
	traps: { [key: string]: DisplayTrapData };
}

const Game = (props: {}) => {
	const [roundData, setRoundData] = useState<RoundData>();
	const [scores, setScores] = useState<{ [key: string]: number }>();
	const [additionalTraps, setAdditionalTraps] = useState<{
		[key: string]: DisplayTrapData;
	}>();

	function newRound(data: RoundData) {
		setRoundData(data);
	}

	function submitTrap(
		top: number,
		right: number,
		bottom: number,
		left: number
	) {
		const data: SubmitTrapData = {
			top: top,
			right: right,
			bottom: bottom,
			left: left,
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
						/>
						<Canvas
							style={{ zIndex: 1, position: "fixed", top: 0 }}
							submitTrap={submitTrap}
						/>
					</>
				)) || <>Waiting for game to start</>}
				<br />
			</div>
		</>
	);
};

export default Game;
