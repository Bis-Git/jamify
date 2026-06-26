import { useRef } from "react";

export const useAudioRecorder = (stream: MediaStream) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
  };

  const stopRecoring = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(new Blob());
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        //TODO: try some different exports
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  };

  return { startRecording, stopRecoring };
};
