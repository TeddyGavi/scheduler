import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial])

  const transition = (newMode, replace = false) => {
  /*  
    default parameter action is to copy the prev state and add the newMode to the end of the history array
    setHistory((prev) => [...prev, newMode]); 
    else we need to copy the previous history and replace the last element with the new mode 
    setHistory((prev) => ([...prev.slice(0, -1), newMode]))   
  */
    !replace ? setHistory((prev) => [...prev, newMode]) : setHistory((prev) => ([...prev.slice(0, -1), newMode]));
    setMode(newMode);
  }

  const back = () => {
    if (history.length === 1) return; //we can't have a history without at least one element
    setHistory((prev) => ([...prev.slice(0, history.length - 1)])) //need to reset the history array as the prev array without the last element
    setMode(history[history.length - 2]) //set the mode to the previous entered, is there a better way?
  }
  
  return {
    mode,
    transition,
    back,
  }
}