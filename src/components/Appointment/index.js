import React from 'react';
import Empty from './Empty';
import Show from './Show';
import Header from './Header';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import './styles.scss';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment(props) {
  // console.log(props)
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY)

  function save(name, interviewer) {
    props.bookInterview(props.id, props.interview)

    const interview = {
      student: name,
      interviewer
    }
    console.log(interview)
  }

  return (
    <article className='appointment'>
      <Header time={props.time} />
       {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
       {mode === CREATE && <Form
      //  student={"Matt"}
      onSave={save}
       interviewer={props.interviewers}
       />}
       {mode === SHOW && <Show 
       student={props.interview.student}
       interviewer={props.interview.interviewer}
       />}
    </article>
  )
}