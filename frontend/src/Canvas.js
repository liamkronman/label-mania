import React, { useRef, useEffect, useState } from 'react';

const Canvas = props => {
    const canvasRef = useRef(null);
    const [currX, setCurrX] = useState(null);
    const [currY, setCurrY] = useState(null);
    const [fixedX, setFixedX] = useState(null);
    const [fixedY, setFixedY] = useState(null);
    const [finalX, setFinalX] = useState(null);
    const [finalY, setFinalY] = useState(null);
    const [tracking, setTracking] = useState(false);

    useEffect(() => {
        document.addEventListener('mousemove', (e) => {
            setCurrX(e.clientX);
            setCurrY(e.clientY);
        });
        document.addEventListener('mousedown', (e) => {
            setTracking(true);
            if (!fixedX) setFixedX(e.clientX);
            if (!fixedY) setFixedY(e.clientY);
        });
        document.addEventListener('mouseup', (e) => {
            setTracking(false);
            if (fixedX && fixedY && !finalX && !finalY) {
                setFinalX(e.clientX);
                setFinalY(e.clientY);
            }
        });
    }, [fixedX, fixedY, finalX, finalY]);

    useEffect(() => {
        if (((currX && currY) || (finalX && finalY)) && finalX && finalY) {
            const canvas = canvasRef.current;
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
                if (finalX && finalY && !tracking) {
                    ctx.rect(fixedX, fixedY, finalX - fixedX, finalY - fixedY);
                } else {
                    ctx.rect(fixedX, fixedY, currX - fixedX, currY - fixedY);
                }
                ctx.stroke();
            }
        } else {
            const canvas = canvasRef.current;
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