import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [], //array of objects
    appointments: {},
    interviewers: {},
  });

  const setDay = day => setState(state => ({ ...state, day })) //set day to selected day from DayList

  /*
  **handle errors in index.js**
  The sequence of events here is:
  1. update specific appointment with the new interview
  2. update the entire appointment object with the newly created appointment and new interview
  3. AWAIT send/remove new interview --> API
  4. AWAIT the new days as they are updated automatically by the api
  5. set the new state, using the previous state, with the new appointments and the new days array
  */

  async function bookInterview(id, interview) {
    const appointment = { ...state.appointments[id], interview: { ...interview } } 
    const appointments = { ...state.appointments, [id]: appointment } 

    await axios.put(`http://localhost:8000/api/appointments/${id}`, { interview }) 
    const res = await axios.get("http://localhost:8000/api/days") 
    setState((state) => ({ ...state, appointments, days: res.data }))
  }

  async function removeInterview(id, interview = null) {
    const appointment = { ...state.appointments[id], interview }
    const appointments = { ...state.appointments, [id]: appointment }

    await axios.delete(`http://localhost:8000/api/appointments/${id}`, { appointment })
    const res = await axios.get("http://localhost:8000/api/days")
    setState((state) => ({ ...state, appointments, days: res.data })) 
  }

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/days"),
      axios.get("http://localhost:8000/api/appointments"),
      axios.get("http://localhost:8000/api/interviewers")
    ]).then((all) => {
      setState(state => ({ ...state, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    }).catch((err) => {
      console.log(err)
    });
  }, [])

  return {
    state,
    setDay,
    bookInterview,
    removeInterview,
  }
}