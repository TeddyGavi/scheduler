import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import "components/Appointment";
import Appointment from "./Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application(_props) {
  const { state, setDay, bookInterview, removeInterview } =
    useApplicationData();

  const apptPerDay = getAppointmentsForDay(state, state.day);
  const interviewersPerDay = getInterviewersForDay(state, state.day);

  const appointment = apptPerDay.map((x) => {
    // need to check if the interview is empty BEFORE we send to getInterview (only applies for deleting)
    const interview =
      x.interview && Object.keys(x.interview).length === 0
        ? null
        : getInterview(state, x.interview);
    return (
      <Appointment
        key={x.id}
        {...x}
        interview={interview}
        bookInterview={bookInterview}
        removeInterview={removeInterview}
        interviewers={interviewersPerDay}
      />
    );
  });

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
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointment}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
