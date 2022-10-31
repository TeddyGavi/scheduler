import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import "components/Appointment";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview } from 'helpers/selectors';


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // const dailyAppointments = [];

  const setDay = day => setState({ ...state, day })
 /*  const setDays = days => setState((prev) => ({ ...prev, days }))

  useEffect(() => {
    axios.get("http://localhost:8001/api/days").then((res) => { setDays([...res.data]) })

  }, []) */

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

  const appointment = apptPerDay.map(x => {
    const interview = getInterview(state, x.interview)
    return (
      <Appointment
        key={x.id}
        {...x}
        interview={interview}
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
