export default function reducer(state, action) {
  const type = {
    SET_DAY: () => ({ ...state, day: action.value }),
    SET_APP_DATA: () => ({
      ...state,
      days: action.value[0].data,
      appointments: action.value[1].data,
      interviewers: action.value[2].data,
    }),
    SET_INTERVIEW: () => {
      const appointment = {
        ...state.appointments[action.value.id],
        interview: { ...action.value.interview },
      };
      const appointments = {
        ...state.appointments,
        [action.value.id]: appointment,
      };
      return { ...state, appointments, days: action.value.days };
    },
    default: () => {
      return new Error(
        `Tried to reduce state with unsupported type ${action.type}`
      ).message;
    },
  };
  return (type[action.type] || type.default)();
}
