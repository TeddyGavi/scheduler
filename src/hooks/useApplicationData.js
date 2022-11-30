/* 
Given that the onmessage is a async 
AND the API automatically determines the spots remaining on a GET days request
  (see the API)
the BEST solution I found to solve both these issues is:
1. make a PUT/DELETE to the API when an interview is Edited or Deleted
2. AWAIT a get request for days AFTER
3. Use the data returned from the socket and the GET request to Update state

This has the advantage of a SINGLE source of truth, ie the API is always responsible for the data
- the front end is simply displaying that data, with no chance of manipulation or 
- IF something does go wrong how do we know if is the front-end or Back-end?

If there is another way I would like to know, 
currently, to fulfill the requirements of compass I am using a front-end function 
to manipulate the data and return a state update after holding the new state 
(see reducer.js and helpers/newSpots)

*/

import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer from "./reducer";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const getData = () => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then((all) => {
        dispatch({ type: "SET_APP_DATA", value: all });
      })
      .catch((err) => {
        console.error("AxiosGET error", err);
      });
  };

  useEffect(() => {
    getData();
    const ws = new WebSocket(
      process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8001"
    );

    ws.onmessage = (e) => {
      let data = JSON.parse(e.data);
      // const res = await axios.get("/api/days"); THE SIMPLE AND SINGLE SOURCE OF TRUTH way to update days
      dispatch({ type: data.type, value: { data } });
    };
    //clean up function to close the socket connection
    return () => {
      ws.close();
    };
  }, []);

  const setDay = (day) => dispatch({ type: "SET_DAY", value: day });

  async function bookInterview(id, interview) {
    if (interview.student === "" || !interview.interviewer) throw new Error();

    await axios.put(`/api/appointments/${id}`, {
      interview,
    });
  }

  async function removeInterview(id, interview = null) {
    await axios.delete(`/api/appointments/${id}`, {
      interview,
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    removeInterview,
  };
}
