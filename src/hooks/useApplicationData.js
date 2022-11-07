import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [], //array of objects
    appointments: {},
    interviewers: {},
  });

  const setDay = day => setState(state => ({ ...state, day }))

  async function bookInterview(id, interview) {
    const appointment = { ...state.appointments[id], interview: { ...interview } }
    const appointments = { ...state.appointments, [id]: appointment }

    try {
      await axios.put(`http://localhost:8000/api/appointments/${id}`, { interview })
      const res = await axios.get("http://localhost:8000/api/days")
      setState((state) => ({ ...state, appointments, days: res.data }))
    } catch (err) {
      console.log({...err})
    }
  }

  async function removeInterview(id, interview = null) {
    const appointment = { ...state.appointments[id], interview }
    const appointments = { ...state.appointments, [id]: appointment }

    try {
      await axios.delete(`http://localhost:8000/api/appointments/${id}`, { appointment })
      const res = await axios.get("http://localhost:8000/api/days")
      setState((state) => ({ ...state, appointments, days: res.data }))
    } catch (err) {
      console.error({...err})
    }
  }

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/days"),
      axios.get("http://localhost:8000/api/appointments"),
      axios.get("http://localhost:8000/api/interviewers")
    ]).then((all) => {
      setState(state => ({ ...state, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    });
  }, [])

  return {
    state,
    setDay,
    bookInterview,
    removeInterview,
  }
}