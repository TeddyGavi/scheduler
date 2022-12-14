import React from "react";
import classNames from "classnames";
import "../components/InterviewListItem.scss";

export default function InterviewListItem(props) {
  const liClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });

  return (
    <li onClick={props.setInterviewer} className={liClass}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
