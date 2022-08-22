import { useState } from "react";
import Canvas from "./Canvas";

const Game = (props: {}) => {
	const [current_image, setCurrentImage] = useState("cat.webp");

	return (
		<>
			<div id="container">
				{(current_image === null && <>Waiting for game to start</>) || (
					<>
						<img
							src={current_image}
							alt=""
							style={{ zIndex: 0, position: "absolute" }}
							draggable={false}
						/>
						<Canvas style={{ zIndex: 1, position: "fixed", top: 0 }} />
					</>
				)}
				<br />
			</div>
		</>
	);
};

export default Game;
