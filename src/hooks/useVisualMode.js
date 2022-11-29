import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    !replace
      ? setHistory((prev) => [...prev, newMode])
      : setHistory((prev) => [...prev.slice(0, -1), newMode]);
    setMode(newMode);
  };

  const back = () => {
    if (history.length === 1) return; //we can't have a history without at least one element
    setHistory((prev) => [...prev.slice(0, history.length - 1)]); //need to reset the history array as the prev array without the last element
    setMode(history.at(-2));
  };

  return {
    mode,
    transition,
    back,
  };
}
