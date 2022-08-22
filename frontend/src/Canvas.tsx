import React, { useRef, useEffect, useState, DOMElement } from 'react';

const Canvas = (props: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currX, setCurrX] = useState<number | null>(null);
    const [currY, setCurrY] = useState<number | null>(null);
    const [fixedX, setFixedX] = useState<number | null>(null);
    const [fixedY, setFixedY] = useState<number | null>(null);
    const [finalX, setFinalX] = useState<number | null>(null);
    const [finalY, setFinalY] = useState<number | null>(null);
    const [tracking, setTracking] = useState(false);

    useEffect(() => {
        document.addEventListener('mousemove', (e) => {
            setCurrX(e.clientX);
            setCurrY(e.clientY);
        });
        document.addEventListener('mousedown', (e) => {
            setTracking(true);
            if (fixedX === null) setFixedX(e.clientX);
            if (fixedY === null) setFixedY(e.clientY);
        });
        document.addEventListener('mouseup', (e) => {
            setTracking(false);
            if (fixedX !== null && fixedY !== null && (finalX === null) && (finalY === null)) {
                setFinalX(e.clientX);
                setFinalY(e.clientY);
            }
        });
    }, [fixedX, fixedY, finalX, finalY]);

    useEffect(() => {
        if (((currX !== null && currY !== null) || (finalX !== null && finalY !== null)) && (fixedX || fixedX == 0) && (fixedY || fixedY == 0)) {
            
            const canvas: any = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            // add image cat.webp to canvas
            const img = new Image(ctx.canvas.width, ctx.canvas.height);
            img.src = './cat.webp';
            img.onload = () => {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage(img, 0, 0);
                ctx.fillStyle = '#000';
                ctx.beginPath();
                if (finalX !== null && finalY !== null && !tracking && fixedX !== null && fixedY !== null) {
                    ctx.rect(fixedX, fixedY, finalX - fixedX, finalY - fixedY);
                } else if (fixedX !== null && fixedY !== null && currX !== null && currY !== null) {
                    ctx.rect(fixedX, fixedY, currX - fixedX, currY - fixedY);
                }
                ctx.stroke();
            }
        } else {
            console.log("reached 2")
            const canvas: any = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            // add image cat.webp to canvas
            const img = new Image(ctx.canvas.width, ctx.canvas.height);
            img.src = './cat.webp';
            img.onload = () => {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage(img, 0, 0);
            }
        }
    }, [currX, currY, finalX, finalY]);

    return <canvas ref={canvasRef} {...props}/>;
}

export default Canvas;