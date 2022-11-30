import { spotsRefactored } from "helpers/newSpots";

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
      const wsStateUpdate = {
        ...state,
        appointments: {
          ...state.appointments,
          [action.value.data.id]: {
            ...state.appointments[action.value.data.id],
            interview: action.value.data.interview,
          },
        },
      };

      return {
        ...wsStateUpdate,
        days: state.days.map((x) => ({
          ...x,
          spots: spotsRefactored(wsStateUpdate, x.name),
        })),
      };
    },
    default: () => {
      return new Error(
        `Tried to reduce state with unsupported type ${action.type}`
      ).message;
    },
  };
  return (type[action.type] || type.default)();
}
