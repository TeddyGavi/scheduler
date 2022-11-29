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

/*  The following functions are my original process for calculating the spots remaining per day, this is clearly not needed and I am only including it in order to make "integration" testing easier
 */
export function getDayNameAsKey(day) {
  const daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  return daysOfTheWeek.indexOf(day);
}

export const newSpots = ({ ...args }, id, action = null) => {
  /*  args.days.map((x) => {
    x.spots = 0;
    for (const appt of args.x.appointments) {
      if (args.appointments[appt].interview !== null) {
        x.spots++;
      }
    }
    return x;
  }); */

  const dayIndex = getDayNameAsKey(args.day); //turning the string into the related indexed value
  const currDayObj = args.days.find((x) => x.name === args.day);
  const interviewState = args.appointments[id].interview;

  let spots = args.days.map((obj) => obj.spots)[dayIndex];
  if (action === true) {
    //When deleting, the interview status doesn't matter
    spots += 1;
  } else if (action === false && interviewState === null) {
    spots -= 1;
  }
  const newSpot = { ...currDayObj, spots: spots };
  const newDays = args.days.map((x, i) => (i === dayIndex ? (x = newSpot) : x));
  return newDays;
};
