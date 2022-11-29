import React, { useState } from "react";
import Button from "components/Button";
import InterviewList from "components/InterviewList";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState();

  const reset = () => {
    setStudent("");
    setInterviewer(null);
    setError("");
  };

  const cancel = () => {
    props.onCancel();
  };

  const validate = () => {
    if (student === "") {
      return setError("Student name cannot be blank");
    }
    if (interviewer === null) {
      return setError("Please Select an interviewer");
    }

    return true;
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            value={student}
            onChange={(e) => {
              setStudent(e.target.value);
              setError("");
            }}
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            autoFocus="1"
            placeholder="Enter Student Name"
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewList
          value={interviewer}
          interviewers={props.interviewers}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button
            danger
            onClick={() => {
              cancel();
              reset();
            }}
          >
            Cancel
          </Button>
          <Button
            confirm
            onClick={() => {
              validate() && props.onSave(student, interviewer);
            }}
          >
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
