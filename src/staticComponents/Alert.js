import React, { useContext } from 'react'
import AlertContext from '../contexts/AlertContext';
import { capitalize } from "../Functions"

export default function Alert() {
    // Destructing context values passed from the parent
    const {alert, dismissAlert} = useContext(AlertContext);

    return (
      // <div>Alert</div>
        <div style={{ height: "15px", marginTop: "55px" }}>
            {alert && <div className={`alert alert-${alert===null?'danger':alert.type} alert-dismissible fade show`} role="alert">
                <strong>{alert === null || alert.type==="danger"? 'Error' : capitalize(alert.type)} : </strong> {alert===null?'Please ignore this alert':alert.msg}
                <button type="button" className="btn-close" aria-label="Close" onClick={dismissAlert}></button>
                {/* data-dismiss="alert" button attribute is removed to handle is dismasal logic mannulay as the bootstarp dismisal technique and react logic with set time out was causing conflict as bootstrap was unable to find the element once react has removed it from UI */}
            </div>}
        </div>
    )
}
