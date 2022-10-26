import React from "react";
import classNames from "classnames";
import '../components/InterviewListItem.scss';

export default function InterviewListItem(props) {
  const liClass = classNames("interviewers__item",
    {
      "interviewers__item--selected": props.selected,
      "interviewers__item--selected-image": props.avatar
    })

  const imgClass = classNames(
    {
      "interviewers__item-image": props.avatar
    })
    
  return (
    <li onClick={() => props.setInterviewer(props.id)} className={liClass}>
      <img
        className={imgClass}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  )
}