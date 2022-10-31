import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial])
  
  const transition = (newMode, replace = false) => {
    if (replace) {
      history.pop()
    }

    history.push(newMode);
    return setMode(newMode);
  }

  const back = () => {
    const lastMode = history.pop()
    return history.length ? setMode(history[history.length -1]) : setHistory(lastMode) ; 
  }

  return {
    mode,
    transition,
    back,
  }
}