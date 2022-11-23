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
  const currDayName = Object.values(args).map((x) => x)[0]; //this will always be the first element of the new array given the first element of state is the day key
  const _key = getDayNameAsKey(currDayName); //turning the string into the related indexed value
  const currDayObj = args.days.find((x) => x.name === currDayName);
  const interviewState = args.appointments[id].interview;
  let spots = args.days.map((obj) => obj.spots)[_key];
  if (action === true) {
    //deleting interview status doesn't matter
    spots += 1;
  } else if (action === false && interviewState === null) {
    spots -= 1;
  }
  const newSpot = { ...currDayObj, spots: spots };
  const newDays = args.days.map((x, i) => (i === _key ? (x = newSpot) : x));
  return newDays;
};
