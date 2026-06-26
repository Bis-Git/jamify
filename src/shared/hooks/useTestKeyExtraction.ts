import { useOscillatorInput } from "../../app/dashboardTest/hooks/useOscillatorInput";
import {
  analyzeRecording,
  calculateStats,
  downloadJSON,
} from "../utils/featureExtractionUtils";
import { useAudioRecorder } from "./useAudioRecorder";
import { useEssentia } from "./useEssentia";

type CommonTypes = {
  description: string;
  method: string;
  expected: string;
};

type TestResults = {
  determinismTest: CommonTypes & {
    results: any[];
    allIdentical: boolean;
  };
  consistencyTest: CommonTypes & {
    results: any[];
    statistics: ReturnType<typeof calculateStats> | undefined;
  };
};

export const useTestKeyExtraction = (context: AudioContext) => {
  const { pulse, getTotalDuration, recordingStream } =
    useOscillatorInput(context);
  const { startRecording, stopRecoring } = useAudioRecorder(recordingStream);
  const essentia = useEssentia();

  const testResults: TestResults = {
    determinismTest: {
      description: "Verify algorithm is deterministic",
      method: "Analyze same audio blob 10 times",
      expected: "All results identical",
      results: [],
      allIdentical: false,
    },
    consistencyTest: {
      description: "Measure recording/detection consistency",
      method: "Record and analyze same melody 100 times",
      expected: "Small variation due to timing/system state",
      results: [],
      statistics: undefined,
    },
    // melodyTest: {
    //   description: "Test algorithm with various musical patterns",
    //   method: "Analyze different melodies in C major",
    //   expected: "All detect C major, varying BPM based on tempo",
    //   results: {} as Record<string, any>,
    // },
  };

  const runTests = async () => {
    console.log("Running Test 1: Determinism...");
    startRecording();
    await pulse();
    await new Promise((resolve) =>
      setTimeout(resolve, getTotalDuration() * 1000 + 100)
    );
    const singleBlob = await stopRecoring();

    for (let i = 0; i < 10; i++) {
      const result = await analyzeRecording(singleBlob, context, essentia);
      testResults.determinismTest.results.push(result);
      console.log(`Iteration n${i + 1} done`);
    }

    testResults.determinismTest.allIdentical =
      testResults.determinismTest.results.every(
        (r) =>
          JSON.stringify(r) ===
          JSON.stringify(testResults.determinismTest.results[0])
      );

    console.log("Running Test 2: Consistency...");
    for (let i = 0; i < 50; i++) {
      startRecording();
      await pulse();
      await new Promise((resolve) =>
        setTimeout(resolve, getTotalDuration() * 1000 + 100)
      );
      const blob = await stopRecoring();
      const result = await analyzeRecording(blob, context, essentia);
      testResults.consistencyTest.results.push(result);
      console.log(`Iteration n${i + 1} done`);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    testResults.consistencyTest.statistics = calculateStats(
      testResults.consistencyTest.results
    );

    downloadJSON(testResults, `thesis-tests-${Date.now()}.json`);

    console.log("=== TEST RESULTS ===");
    console.log(
      "Test 1 (Determinism): All identical?",
      testResults.determinismTest.allIdentical
    );
    console.log(
      "Test 2 (Consistency):",
      testResults.consistencyTest.statistics
    );
  };

  return { runTests };
};
