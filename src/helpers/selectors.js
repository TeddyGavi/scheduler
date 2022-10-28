export function getAppointmentsForDay(state, day) {
  return [...state.days].filter(x => x.name === day)[0]?.appointments.map(x => state.appointments[x]) || []
}


