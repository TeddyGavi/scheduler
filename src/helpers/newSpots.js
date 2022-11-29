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
