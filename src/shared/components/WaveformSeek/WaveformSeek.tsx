import React, { useEffect, useRef } from "react";

interface WaveformSeekProps {
  recordedWith: number;
  duration: number;
  onSeek: (time: number) => void;
  currentTime: number;
}

export const WaveformSeek: React.FC<WaveformSeekProps> = ({
  recordedWith,
  duration,
  onSeek,
  currentTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    if (!canvas) {
      console.error("Canvas not found!");
      return;
    }
    if (!canvasCtx) {
      console.error("Failed to get canvas context!");
      return;
    }

    if (!duration || isNaN(duration)) {
      console.warn("Invalid duration:", duration);
      return;
    }

    if (!canvas || !canvasCtx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    canvasCtx.clearRect(0, 0, width, height);

    // Draw progress bar
    const progressX = (currentTime / duration) * width;
    canvasCtx.strokeStyle = "red";
    canvasCtx.lineWidth = 2;
    canvasCtx.beginPath();
    canvasCtx.moveTo(progressX, 0);
    canvasCtx.lineTo(progressX, height);
    canvasCtx.stroke();
  }, [currentTime, duration]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    console.log(recordedWith, clickX);

    const seekTime = (clickX / recordedWith) * duration;
    onSeek(Math.min(Math.max(seekTime, 0), duration));
  };

  return (
    <canvas
      ref={canvasRef}
      width={recordedWith}
      height={200}
      style={{
        cursor: "pointer",
        position: "absolute",
        zIndex: 2,
      }}
      onClick={handleCanvasClick}
    />
  );
};
