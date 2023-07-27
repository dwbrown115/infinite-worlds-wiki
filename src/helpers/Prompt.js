import { useBlocker } from "react-router-dom";

function Prompt(when, message) {
  const block = when;
  useBlocker(() => {
    if (block) {
      return !window.confirm(message);
    }
    return false;
  });

  return <div key={block} />;
}

export default Prompt;
