import React, { useEffect, useRef, useState } from "react";
import { DisplayTrapData, Trap } from "../types/GameTypes";

interface PositionData {
	currX: number | null;
	currY: number | null;
	fixedX: number | null;
	fixedY: number | null;
	finalX: number | null;
	finalY: number | null;
}

const Canvas = (props: any) => {
	const submitTrap = props.submitTrap;
	const additionalTraps: { [key: string]: DisplayTrapData } | undefined =
		props.additionalTraps;
	const imgRef: React.RefObject<HTMLImageElement> = props.imgRef;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [position, setPosition] = useState<PositionData>({
		currX: null,
		currY: null,
		fixedX: null,
		fixedY: null,
		finalX: null,
		finalY: null,
	});

	function toRelCoords(trap: Trap) {
		// Proportion of image
		const imgRect = imgRef.current?.getBoundingClientRect();
		const canvasRect = canvasRef.current?.getBoundingClientRect();
		if (imgRect === undefined || canvasRect === undefined) return null;
		return {
			top: (trap.top + canvasRect.y - imgRect.y) / imgRect.height,
			bottom: (trap.bottom + canvasRect.y - imgRect.y) / imgRect.height,
			left: (trap.left + canvasRect.x - imgRect.x) / imgRect.width,
			right: (trap.right + canvasRect.x - imgRect.x) / imgRect.width,
		};
	}

	function toAbsCoords(trap: Trap) {
		// Relative to canvas
		const imgRect = imgRef.current?.getBoundingClientRect();
		const canvasRect = canvasRef.current?.getBoundingClientRect();
		if (imgRect === undefined || canvasRect === undefined) return null;
		console.log(trap);
		console.log(imgRect);
		return {
			top: trap.top * imgRect.height - canvasRect.y + imgRect.y,
			bottom: trap.bottom * imgRect.height - canvasRect.y + imgRect.y,
			left: trap.left * imgRect.width - canvasRect.x + imgRect.x,
			right: trap.right * imgRect.width - canvasRect.x + imgRect.x,
		};
	}

	// todo: bug: If you right click & inspect element, you can be be dragging without having clicked
	useEffect(() => {
		document.addEventListener("mousemove", (e) => {
			setPosition((prev) => {
				const canvasRect = canvasRef.current?.getBoundingClientRect();
				if (canvasRect === undefined) return prev; // todo: throw error
				return {
					...prev,
					currX: e.clientX - canvasRect.x,
					currY: e.clientY - canvasRect.y,
				};
			});
		});
		document.addEventListener("mousedown", (e) => {
			setPosition((prev) => {
				if (prev.finalX == null) {
					// to ensure you cannot redraw the box
					const canvasRect = canvasRef.current?.getBoundingClientRect();
					if (canvasRect === undefined) return prev; // todo: throw error
					return {
						...prev,
						fixedX: e.clientX - canvasRect.x,
						fixedY: e.clientY - canvasRect.y,
						finalX: null,
						finalY: null,
					};
				}
				return prev;
			});
		});
		document.addEventListener("mouseup", (e) => {
			setPosition((prev) => {
				if (
					prev.fixedX !== null &&
					prev.fixedY !== null &&
					prev.finalX === null &&
					prev.finalY === null
				) {
					const canvasRect = canvasRef.current?.getBoundingClientRect();
					if (canvasRect === undefined) return prev; // todo: throw error
					return {
						...prev,
						finalX: e.clientX - canvasRect.x,
						finalY: e.clientY - canvasRect.y,
					};
				}
				return prev;
			});
		});
	}, [position.fixedX, position.fixedY, position.finalX, position.finalY]);

	useEffect(() => {
		if (canvasRef.current === null) return;
		const canvas: HTMLCanvasElement = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (ctx === null) return;
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#2228";
		ctx.fillStyle = "#8888";

		if (
			((position.currX !== null && position.currY !== null) ||
				(position.finalX !== null && position.finalY !== null)) &&
			(position.fixedX || position.fixedX === 0) &&
			(position.fixedY || position.fixedY === 0)
		) {
			/* Player's trap */
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.beginPath();
			if (
				position.finalX !== null &&
				position.finalY !== null &&
				position.fixedX !== null &&
				position.fixedY !== null
			) {
				ctx.fillRect(
					position.fixedX, // todo: changes if you scroll
					position.fixedY,
					position.finalX - position.fixedX,
					position.finalY - position.fixedY
				);
				ctx.rect(
					position.fixedX,
					position.fixedY,
					position.finalX - position.fixedX,
					position.finalY - position.fixedY
				);
			} else if (
				position.fixedX !== null &&
				position.fixedY !== null &&
				position.currX !== null &&
				position.currY !== null
			) {
				ctx.fillRect(
					position.fixedX,
					position.fixedY,
					position.currX - position.fixedX,
					position.currY - position.fixedY
				);
				ctx.rect(
					position.fixedX,
					position.fixedY,
					position.currX - position.fixedX,
					position.currY - position.fixedY
				);
			}
			ctx.stroke();
			ctx.closePath();
		}

		/* Opponents' traps */

		ctx.fillStyle = "#f837";
		if (additionalTraps !== undefined)
			for (const [, val] of Object.entries(additionalTraps)) {
				const trap = toAbsCoords(val);
				console.log(trap);
				if (trap === null) continue; // todo: Throw an error

				ctx.beginPath();
				if (val.strokeStyle) ctx.strokeStyle = val.strokeStyle;
				else ctx.strokeStyle = "#f83f";
				ctx.rect(
					trap.left,
					trap.top,
					trap.right - trap.left,
					trap.bottom - trap.top
				);

				if (val.fillStyle) {
					ctx.fillStyle = val.fillStyle;
					ctx.fillRect(
						trap.left,
						trap.top,
						trap.right - trap.left,
						trap.bottom - trap.top
					);
				}
				ctx.closePath();
			}

		ctx.stroke();
	});

	useEffect(() => {
		if (
			position.fixedY === null ||
			position.fixedX === null ||
			position.finalX === null ||
			position.finalY === null
		)
			return;
		const trap = {
			top: Math.min(position.fixedY, position.finalY),
			bottom: Math.max(position.fixedY, position.finalY),
			left: Math.min(position.fixedX, position.finalX),
			right: Math.max(position.fixedX, position.finalX),
		};
		submitTrap(toRelCoords(trap));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [position.finalX]);

	return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
