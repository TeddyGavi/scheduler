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
    setState({...state, appointments})

    console.log('This logs the function calls from the form grandchild, in order to access the state at the app level', id, interview)
  }

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
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
