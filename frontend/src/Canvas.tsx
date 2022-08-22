import React, { useRef, useEffect, useState } from "react";

interface PositionData {
	currX: number | null;
	currY: number | null;
	fixedX: number | null;
	fixedY: number | null;
	finalX: number | null;
	finalY: number | null;
}

const Canvas = (props: any) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [position, setPosition] = useState<PositionData>({
		currX: null,
		currY: null,
		fixedX: null,
		fixedY: null,
		finalX: null,
		finalY: null,
	});

	useEffect(() => {
		document.addEventListener("mousemove", (e) => {
			setPosition((prev) => ({ ...prev, currX: e.clientX, currY: e.clientY }));
		});
		document.addEventListener("mousedown", (e) => {
			setPosition((prev) =>
				prev.finalX == null
					? {
							...prev,
							fixedX: e.clientX,
							fixedY: e.clientY,
							finalX: null,
							finalY: null,
					  }
					: prev
			);
		});
		document.addEventListener("mouseup", (e) => {
			setPosition((prev) =>
				prev.fixedX !== null &&
				prev.fixedY !== null &&
				prev.finalX === null &&
				prev.finalY === null
					? { ...prev, finalX: e.clientX, finalY: e.clientY }
					: prev
			);
		});
	}, [position.fixedX, position.fixedY, position.finalX, position.finalY]);

	useEffect(() => {
		if (
			((position.currX !== null && position.currY !== null) ||
				(position.finalX !== null && position.finalY !== null)) &&
			(position.fixedX || position.fixedX === 0) &&
			(position.fixedY || position.fixedY === 0)
		) {
			if (canvasRef.current === null) return;
			const canvas: HTMLCanvasElement = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (ctx === null) return;
			ctx.canvas.width = window.innerWidth;
			ctx.canvas.height = window.innerHeight;

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.fillStyle = "#000";
			ctx.beginPath();
			if (
				position.finalX !== null &&
				position.finalY !== null &&
				position.fixedX !== null &&
				position.fixedY !== null
			) {
				ctx.rect(
					position.fixedX - canvas.getBoundingClientRect().left, // todo: changes if you scroll
					position.fixedY - canvas.getBoundingClientRect().top,
					position.finalX - position.fixedX,
					position.finalY - position.fixedY
				);
			} else if (
				position.fixedX !== null &&
				position.fixedY !== null &&
				position.currX !== null &&
				position.currY !== null
			) {
				ctx.rect(
					position.fixedX - canvas.getBoundingClientRect().left,
					position.fixedY - canvas.getBoundingClientRect().top,
					position.currX - position.fixedX,
					position.currY - position.fixedY
				);
			}
			ctx.stroke();
		}
	}, [
		position.currX,
		position.currY,
		position.finalX,
		position.finalY,
		position.fixedX,
		position.fixedY,
	]);

	return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
