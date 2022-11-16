export default function reducer(state, action) {
  const type = {
    SET_DAY: () => ({ ...state, day: action.value }),
    SET_APP_DATA: () => ({
      ...state,
      days: action.value[0].data,
      appointments: action.value[1].data,
      interviewers: action.value[2].data,
    }),
    SOCKET: () => {
      //new appointment and days come from the socket response, an async function
      const wsAppointment = {
        ...state.appointments[action.value.data.id],
        interview: { ...action.value.data.interview },
      };
      const wsStateUpdate = {
        ...state.appointments,
        [action.value.data.id]: wsAppointment,
      };
      return { ...state, appointments: wsStateUpdate, days: action.value.days };
    },
    default: () => {
      return new Error(
        `Tried to reduce state with unsupported type ${action.type}`
      ).message;
    },
  };
  return (type[action.type] || type.default)();
}
