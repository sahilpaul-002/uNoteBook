import React, {useState} from 'react'
import DisableButtonContext from '../contexts/DisableButtonContext';

export default function DisableButtonStateProvider(props) {
    const [disableButton, setDisableButton] = useState({
        addButton: false,
        editButton: true,
        editNote: null
    })

    const value = {disableButton, setDisableButton};

  return ( <DisableButtonContext value={value}>{props.children}</DisableButtonContext> )
}
