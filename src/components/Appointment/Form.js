import React, { useState } from "react";
import Button from "components/Button";
import InterviewList from "components/InterviewList";

export default function Form(props) {
  console.log(props)
  const [student, setStudent] = useState(props.student || "")
  const [interviewer, setInterviewer] = useState(props.interviewer || null)

  const reset = () => {
    setStudent("")
    setInterviewer(null)
  }

  const cancel = () => {
    props.onCancel();
  }



  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(e) => {e.preventDefault()}}>
          <input
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
          />
        </form>
        <InterviewList
        value={interviewer}
        interviewers={props.interviewer}
        onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={() => {cancel(); reset();}}>Cancel</Button>
          <Button confirm onClick={() => {props.onSave(student, interviewer)}}>Save</Button>
        </section>
      </section>
    </main>

  )
}