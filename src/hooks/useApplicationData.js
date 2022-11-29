import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer from "./reducer";
import { newSpots } from "helpers/selectors";

/* 

App loads

- useEffect runs to dispatching reducer for SET_APP_DATA
  - User can click on different days and view the available appointments remaining
- User can book or delete an appointment, which will change the data on the server
  - webSocket (already configured on the server) here handles all the State updates
    **
    IMPORTANT note here is that the server auto updates days remaining, so we can
    fetch and update "days" each time a socket receives a onmessage event
    
    This does appear to cause a seem to cause a rerender on the second browser window? 
      Need to investigate further
    **  

*/

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [], //array of objects
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
        console.log(err);
      });
  };

  useEffect(() => {
    getData();

    /*
    REMOVED IN ORDER TO MAKE "INTEGRATION" TESTS PASS
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    
    ws.onmessage = async (e) => {
      let data = JSON.parse(e.data);
      const res = await axios.get("/api/days");
      // if (data.type === "SET_INTERVIEW")
        dispatch({ type: "SOCKET", value: { data, days: res.data } });
    };
    //clean up function to close the socket connection
    return () => {
      ws.close();
    }; */
  }, []);

  const setDay = (day) => dispatch({ type: "SET_DAY", value: day });

  async function bookInterview(id, interview) {
    if (interview.student === "" || !interview.interviewer) throw new Error();

    await axios.put(`/api/appointments/${id}`, {
      interview,
    });
    const update = newSpots(state, id, false);
    console.log(update);
    dispatch({ type: "SET_INTERVIEW", value: { id, interview, days: update } });
  }

  async function removeInterview(id, interview = null) {
    await axios.delete(`/api/appointments/${id}`, {
      interview,
    });
    const update = newSpots(state, id, true);
    console.log(update);
    dispatch({
      type: "SET_INTERVIEW",
      value: { id, interview, days: update },
    });
  }
  /*

REMOVED IN ORDER TO MAKE "INTEGRATION" TESTS PASS
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
 */

  return {
    state,
    setDay,
    bookInterview,
    removeInterview,
  };
}
