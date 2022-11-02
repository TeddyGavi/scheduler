import React from 'react';
import Empty from './Empty';
import Show from './Show';
import Header from './Header';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import './styles.scss';
import Status from './Status';
import Confirm from './Confirm';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE"
const CONFIRM = "CONFIRM"
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY)

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVE)
    props.bookInterview(props.id, interview).then((res) => {
      console.log(`response from SAVE`, res)
      // if (res === 204) {
      // }
       transition(SHOW);
    }).catch((err) => {
      console.error({...err})
      transition(ERROR_SAVE, true)
    })
  }

  function remove() {
    const interview = null;
    transition(CONFIRM);
    props.removeInterview(props.id, interview).then((res) => {
      console.log(`response from DELETE`, res)
       transition(EMPTY, true)
    }).catch((err) => {
      console.error({...err})
      transition(ERROR_DELETE);
    })
  }

  return (
    <article className='appointment'>
      <Header time={props.time} />
       {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
       {/* user clicks on the "add" new appointment */}
       {mode === CREATE && <Form
        onCancel={() =>{back()}}
        onSave={save}
        interviewers={props.interviewers}
       />}
       {/* after a put request */}
       {mode === SHOW && <Show 
       onDelete={() => {transition(DELETE)}}
       onEdit={() => {transition(EDIT)}}
       student={props.interview.student}
       interviewer={props.interview.interviewer}
       />}
       {/* user clicks on the edit button once a appointment has been booked */}
       {mode === EDIT && <Form
       onCancel={() => {back()}}
       onSave={save}
       student={props.interview.student}
       interviewer={props.interview.interviewer.id}
       interviewers={props.interviewers}
       />}
       {/* user clicks delete and we first show a confirmation asking */}
       {mode === DELETE && 
       <Confirm
       message={"Are you sure you would like to delete this interview?"}
       onCancel={() => {back()}}
       onConfirm={remove}
       /> }

       {/* simple status message updates to be displayed during async ops (this is a hardcoded delay in the API server) */}
       {mode === CONFIRM && <Status message={"Deleting"}/>}
       {mode === SAVE && <Status message={"Saving"}/>}
        {/* Need to deal with errors that occur during saving and deleting */}
      
    </article>
  )
}