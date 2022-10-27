import React from "react";
import InterviewListItem from "./InterviewListItem";
import "../components/InterviewList.scss";


export default function InterviewList(props) {

  const interviewer = props.interviewers.map(x => {
    return (
      <InterviewListItem
      key={x.id}
      name={x.name}
      avatar={x.avatar}
      selected={x.id === props.value}
      setInterviewer={() => props.onChange(x.id)}
      />
    )
  })


  return (
    <section className="interviewers">
      <h4 className="interviewers__header text-light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewer}
      </ul>
    </section>
  )
}