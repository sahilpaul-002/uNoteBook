import React from 'react'
import Notes from './Notes'
import AddNote from './AddNote'
import DisableButtonStateProvider from '../contextComponents/DisableButtonsState';

export default function Home() {
  return (
    <div>
      <DisableButtonStateProvider>
        <AddNote />

        <hr />

        <Notes />
      </DisableButtonStateProvider>
    </div>
  )
}
