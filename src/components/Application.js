import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import "components/Appointment";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from 'helpers/selectors';


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {
      "1": {
        id: 1,
        time: "12pm",
        interview: null
      }
    },
    interviewers: {},
  });

  const setDay = day => setState({ ...state, day })

  function bookInterview(id, interview) {
    const appointment = { 
      ...state.appointments[id],
      interview: {...interview}
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

   return axios.put(`http://localhost:8000/api/appointments/${id}`, { interview }).then((res) => {
      const status = res.status; //possibly for future use?
      setState(state => ({...state, appointments})) //update state, taking into account previous state?
      return status;
    })
  }

  function removeInterview(id, interview = null) {
    const appointment = { 
      ...state.appointments[id],
      interview
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`http://localhost:8000/api/appointments/${id}`, { appointment }).then((res) => {
      const status = res.status
      setState(state => ({...state, appointments}))
      return status
    })
  }

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/days"),
      axios.get("http://localhost:8000/api/appointments"),
      axios.get("http://localhost:8000/api/interviewers")
    ]).then((all) => {
      // console.log(all[0].data, all[1].data, all[2].data)
      setState(state => ({...state, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    });
  }, [])

  const apptPerDay = getAppointmentsForDay(state, state.day)
  const interviewersPerDay = getInterviewersForDay(state, state.day)

  const appointment = apptPerDay.map(x => {
    const interview = getInterview(state, x.interview)
    return (
      <Appointment
        key={x.id}
        {...x}
        interview={interview}
        bookInterview={bookInterview}
        removeInterview={removeInterview}
        interviewers={interviewersPerDay}
      />
    )
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />

      </section>
      <section className="schedule">
        {appointment}
        <Appointment key='last' time='5pm' />
      </section>
    </main>
  );
}
