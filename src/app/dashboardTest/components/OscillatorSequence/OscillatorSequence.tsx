import React from "react";

type OscillatorSequenceType = {
  handleClick: VoidFunction;
};

const OscillatorSequence = ({ handleClick }: OscillatorSequenceType) => {
  return (
    <div>
      <button onClick={handleClick}>Play sequence</button>
    </div>
  );
};

export default OscillatorSequence;
