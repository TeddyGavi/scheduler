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

  return {
    state,
    setDay,
    bookInterview,
    removeInterview,
  }
}








/* 

TESTING async await inside useEffect, I believe its simpler to use Promise.all here, as there is no need for any "awaiting", we are simply getting and display data only once


    const fetchData = async() => {
      const days =  axios.get("http://localhost:8000/api/days")
      const appointments =  axios.get("http://localhost:8000/api/appointments")
      const interviewers =  axios.get("http://localhost:8000/api/interviewers")

      const data = await Promise.all([days, appointments, interviewers])
      return data;
    }

    fetchData()
      .then((data) => { setState(state => 
      ({...state, days: data[0].data, appointments: data[1].data, interviewers: data[2].data })) 
    })
    .catch((err) => {
      console.log(err)
    }) 


 */