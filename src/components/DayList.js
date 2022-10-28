import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  console.log(props.days)

  const days = props.days.map(x => {
    return (
      <DayListItem 
        key={x.id}
        name={x.name}
        spots={x.spots}
        selected={x.name === props.value}
        setDay={props.onChange}
        />
    )
  })

  return (
    <ul>
      {days}
    </ul>
  )
}