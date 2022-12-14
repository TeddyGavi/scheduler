import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer from "./reducer";
import { newSpots } from "helpers/newSpots";

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
    // MOVED WEBSOCKETS INTO OWN BRANCH IN ORDER FOR "INTEGRATION" TESTS TO PASS
  }, []);

  const setDay = (day) => dispatch({ type: "SET_DAY", value: day });

  async function bookInterview(id, interview) {
    if (interview.student === "" || !interview.interviewer) throw new Error();

    await axios.put(`/api/appointments/${id}`, {
      interview,
    });
    const update = newSpots(state, id, false);
    dispatch({ type: "SET_INTERVIEW", value: { id, interview, days: update } });
  }

  async function removeInterview(id, interview = null) {
    await axios.delete(`/api/appointments/${id}`, {
      interview,
    });
    const update = newSpots(state, id, true);
    dispatch({
      type: "SET_INTERVIEW",
      value: { id, interview, days: update },
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    removeInterview,
  };
}
