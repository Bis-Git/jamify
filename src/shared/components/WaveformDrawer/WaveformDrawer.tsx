import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from "react";
import { AppAudioContext } from "../../context/AppAudioContext/AppAudioContext";

interface WaveformRecorderProps {
  stream: MediaStream;
  isRecording: boolean;
  setRecordedWidth: Dispatch<SetStateAction<number>>;
}

export const WaveformDrawer: React.FC<WaveformRecorderProps> = ({
  stream,
  isRecording,
  setRecordedWidth,
}) => {
  const { actx } = useContext(AppAudioContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentXRef = useRef(0);
  const totalDurationRef = useRef(0.1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    if (!canvas || !canvasCtx) return;
    canvasCtx.fillStyle = "black";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    const analyser = actx.createAnalyser();
    analyser.fftSize = 2048;

    const source = actx.createMediaStreamSource(stream);
    source.connect(analyser);

    const drawWaveform = () => {
      if (!canvas || !canvasCtx || !analyser) return;

      const width = canvas.width;
      const height = canvas.height;
      const bufferLength = analyser.fftSize;
      const dataArray = new Float32Array(bufferLength);

      analyser.getFloatTimeDomainData(dataArray);

      const xIncrement = width / (totalDurationRef.current * actx.sampleRate);
      const xStart = currentXRef.current;
      const xEnd = xStart + xIncrement;

      // Draw waveform
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
      canvasCtx.lineWidth = 1;
      canvasCtx.stroke();

      setRecordedWidth(x);
      currentXRef.current = xEnd;

      if (currentXRef.current < width) {
        animationFrameRef.current = requestAnimationFrame(drawWaveform);
      }
    };

    if (isRecording) {
      if (!canvas || !canvasCtx) return;
      canvasCtx.fillStyle = "black";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      currentXRef.current = 0;
      drawWaveform();
    } else {
      cancelAnimationFrame(animationFrameRef.current || 0);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current || 0);
    };
  }, [stream, isRecording, actx]);

  return (
    <canvas
      ref={canvasRef}
      width={1400}
      height={200}
      style={{ border: "1px solid black", position: "absolute", zIndex: 1 }}
    ></canvas>
  );
};
