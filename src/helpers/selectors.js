export function getAppointmentsForDay(state, day) {
  return (
    state.days
      .filter((x) => x.name === day)[0]
      ?.appointments.map((x) => state.appointments[x]) || []
  );
}

export function getInterview(state, interview) {
  return (
    interview && {
      student: interview.student,
      interviewer: {
        id: interview.interviewer,
        name: state.interviewers[interview.interviewer].name,
        avatar: state.interviewers[interview.interviewer].avatar,
      },
    }
  );
}

export function getInterviewersForDay(state, day) {
  return (
    state.days
      .filter((x) => x.name === day)[0]
      ?.interviewers.map((x) => state.interviewers[x]) || []
  );
}
