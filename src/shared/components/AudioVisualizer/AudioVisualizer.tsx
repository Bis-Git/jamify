import React, { useEffect, useRef } from "react";

interface WaveformRecorderProps {
  stream: MediaStream;
  isRecording: boolean;
}

export const WaveformRecorder: React.FC<WaveformRecorderProps> = ({
  stream,
  isRecording,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Track current drawing position
  const currentXRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const drawWaveform = () => {
      if (!canvas || !canvasCtx || !analyser) return;

      const width = canvas.width;
      const height = canvas.height;
      const bufferLength = analyser.fftSize;
      const dataArray = new Float32Array(bufferLength);

      analyser.getFloatTimeDomainData(dataArray);

      // Calculate x increment based on the canvas width and recording duration
      const xIncrement = width / (audioContext.sampleRate * 0.1); // Assuming 5 seconds max for full width

      // Start drawing at the current x position
      const xStart = currentXRef.current;
      const xEnd = xStart + xIncrement;

      canvasCtx.beginPath();
      const yCenter = height / 2;

      let x = xStart;
      const sliceWidth = (xEnd - xStart) / bufferLength;

      for (let i = 0; i < dataArray.length; i++) {
        const sample = dataArray[i];
        const y = yCenter + sample * yCenter;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.strokeStyle = "lime";
      canvasCtx.lineWidth = 2;
      canvasCtx.stroke();

      // Update x position for the next frame
      currentXRef.current = xEnd;

      // Stop drawing when reaching the canvas width
      if (currentXRef.current < width) {
        animationFrameRef.current = requestAnimationFrame(drawWaveform);
      }
    };

    if (isRecording) {
      if (!canvas || !canvasCtx) return;
      canvasCtx.fillStyle = "black";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      currentXRef.current = 0; // Reset x position
      drawWaveform();
    } else {
      cancelAnimationFrame(animationFrameRef.current || 0);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current || 0);
      audioContext.close();
    };
  }, [stream, isRecording]);

  useEffect(() => {
    if (isRecording) {
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    } else {
      mediaRecorderRef.current?.stop();
    }

    return () => {
      mediaRecorderRef.current?.stop();
    };
  }, [isRecording, stream]);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid black", backgroundColor: "black" }}
    />
  );
};
