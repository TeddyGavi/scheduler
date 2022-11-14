import React, { useEffect } from 'react';
import Empty from './Empty';
import Show from './Show';
import Header from './Header';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import './styles.scss';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

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

useEffect(() => {
  if (mode === EMPTY && props.interview) {
    transition(SHOW)
  } 
  if (mode === SHOW && !props.interview) {
    transition(EMPTY)
  }
}, [props.interview, mode, transition])

  async function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }

    transition(SAVE)

    try {
      await props.bookInterview(props.id, interview)
      transition(SHOW);
    } catch (err) {
      console.error(err)
      transition(ERROR_SAVE, true)
    }
  }

  async function remove() {
    const interview = null;

    transition(CONFIRM, true);

    try {
      await props.removeInterview(props.id, interview)
      transition(EMPTY)
    } catch (err) {
      console.error(err)
      transition(ERROR_DELETE, true);
    }
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
       {mode === SHOW && props.interview && <Show 
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
       {/* user clicks delete and we first show a confirmation */}
       {mode === DELETE && 
       <Confirm
       message={"Are you sure you would like to delete this interview?"}
       onCancel={() => {back()}}
       onConfirm={remove}
       /> }

       {/* simple status message updates to be displayed during async ops (this is a hardcoded delay in the API server) */}
       {mode === CONFIRM && <Status message={"Deleting"}/>}
       {mode === SAVE && <Status message={"Saving"}/>}
        {/* dealing with errors that occur during saving and deleting */}
       {mode === ERROR_DELETE && <Error  message={"Could not delete appointment"} onClose={() => {back()}}/>}
      {mode === ERROR_SAVE && <Error  message={"Could not save appointment"} onClose={() => {back()}}/>}
      
    </article>
  )
}