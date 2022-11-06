import { useState, useEffect } from "react";
import { getDayNameAsKey } from "helpers/selectors";
import axios from "axios";


export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [], //array of objects
    appointments: {},
    interviewers: {},
  });

/* 
What I am attempting with this function newSpots is to modify, without changing original state, the amount of spots remaining so the dayList component can display either one less, or one more day (max is 5) depending on appointments being booked or deleted. There is an issue here with this method as editing becomes a bit trickier so I update the check to include a lookup to see if there is an appointment already, and if so do nothing to the spots upon saving (as an edit of an interview doesn't change how many spots are available)
*/

  const newSpots = ({ ...args }, id, action = null) => {
    const currDayName = Object.values(args).map(x => x)[0] //this will always be the first element of the new array given the first element of state is the day key
    const _key = getDayNameAsKey(currDayName); //turning the string into the related indexed value
    const currDayObj = args.days.find(x => x.name === currDayName);
    const interviewState = args.appointments[id].interview
    console.log(interviewState)
    let spots = args.days.map((obj) => obj.spots)[_key]
    if (action === true) { //deleting interview status doesn't matter
      spots += 1
    } else if (action === false && interviewState === null) {
      spots -= 1
    }
    const newSpot = { ...currDayObj, spots: spots }
    const newDays = args.days.map((x, i) => i === _key ? x = newSpot : x)
    return newDays
  }

  /* 
  
  First attempt at updating state based on interview being null, may possibly work (with some modification to the return object), inside a useEffect as long as i can pass the interview object from inside state as the actual dependency array
  
  const calcSpotsRemaining = (copy) => {
      //returns a number of spots where the interview for that selected day is null (not booked yet)
      //please send a copy of state into me!
  
      const spots = parseInt(
        [...copy.days]
          .filter(x => x.name === copy.day).map(x => x.appointments
            .filter(x => copy.appointments[x].interview === null).length))
  
      return copy.days.map((x) => {
        if (x.name !== copy.day) {
          return x
        }
        return { ...x, spots: spots }
      })
    }
  
  
   */


  const setDay = day => setState(state => ({ ...state, day }))

  function bookInterview(id, interview) {
    const appointment = { ...state.appointments[id], interview: { ...interview } }
    const appointments = { ...state.appointments, [id]: appointment }

    const days = newSpots(state, id, false) //update spots remaining


    return axios.put(`http://localhost:8000/api/appointments/${id}`, { interview }).then((res) => {
      // const status = res.status; //possibly for future use?
      setState((state) => ({ ...state, appointments, days }))
      //update state, taking into account previous state?
    })
  }

  function removeInterview(id, interview = null) {
    const appointment = {
      ...state.appointments[id],
      interview
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    const days = newSpots(state, id, true) //update spots

    return axios.delete(`http://localhost:8000/api/appointments/${id}`, { appointment }).then((res) => {
      setState(state => ({ ...state, appointments, days }))
    })
  }

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/days"),
      axios.get("http://localhost:8000/api/appointments"),
      axios.get("http://localhost:8000/api/interviewers")
    ]).then((all) => {
      setState(state => ({ ...state, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    });
  }, [])

  return {
    state,
    setDay,
    bookInterview,
    removeInterview,
  }
}