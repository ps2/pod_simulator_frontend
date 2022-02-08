import logo from './logo.svg';
import './App.css';
import { connect, sendMsg } from "./api";
import React, { Component, useEffect, useState } from 'react'
import Select from 'react-select'

function App() {

  const [podState, setPodState] = useState({});
  const [reservoir, setReservoir] = useState(0);
  const [alertMask, setAlertMask] = useState(0);
  const [reservoirInputError, setReservoirInputError] = useState("");

  const options = [
    { value: 'slot0', label: 'AutoOff(0)' },
    { value: 'slot1', label: 'Unused(1)' },
    { value: 'slot2', label: 'ShutdownImminent(2)' },
    { value: 'slot3', label: 'ExpirationReminder(3)' },
    { value: 'slot4', label: 'LowReservoir(4)' },
    { value: 'slot5', label: 'SuspendedReminder(5)' },
    { value: 'slot6', label: 'SuspendExpired(6)' },
    { value: 'slot7', label: 'Lifecycle(7)' },
  ]

  useEffect(() => {
    connect((newState) => {
      setPodState(newState)
      setReservoir(newState.ReservoirLevel)
      setAlertMask(newState.Alerts)
      console.log("New pod state:", newState)
    });
  }, [])

  function reservoirInputChanged(event) {
    setReservoir(event.target.value);
    setReservoirInputError("")
  };

  function sendReservoirChange(event) {
    const val = parseFloat(reservoir);
    if (val < 0 || val > 200) {
      setReservoirInputError("Bounds error")
    } else {
      console.log("changeReservoir");
      sendMsg({"command": "changeReservoir", "value": val});
    }
    event.preventDefault();
  };

  function alertsChanged(newValue) {
    var newAlertMask = 0;
    for (const element of newValue) {
      console.log("Looking at", element)
      const slot = parseInt(element.value.substring(4,6))
      newAlertMask |= 1 << slot
    }
    console.log("newAlertMask = ", newAlertMask);
    setAlertMask(newAlertMask)
  }

  function sendAlertsChange(event) {
    sendMsg({"command": "setAlerts", "value": alertMask});
    event.preventDefault();
  };


  return (
    <div className="App">
      <div className="Header">
        <h2>Pod Simulator</h2>
        <div>
          <img src="s08.jpg"/>

        </div>
      </div>

      <div className="group">
        <h3>Pod State</h3>
        <div><span className="var">Reservoir</span> <span className="val">{podState.ReservoirLevel}</span></div>
        <div><span className="var">Alerts</span> <span>{podState.Alerts}</span></div>
        <div><span className="var">Bolusing</span> <span>{podState.Bolusing ? "Yes" : "No"}</span></div>
        <div><span className="var">TempBasalRunning</span> <span>{podState.TempBasalRunning ? "Yes" : "No"}</span></div>
        <div><span className="var">BasalRunning</span> <span>{podState.BasalRunning ? "Yes" : "No"}</span></div>
      </div>

      <div className="group">
        <h3>Reservoir</h3>
        <form onSubmit={sendReservoirChange}>
          <label>
            <input type="number" value={reservoir} onChange={reservoirInputChanged} />
          </label>
          <input type="submit" value="Set Reservoir" />
          <span className="inputError">{reservoirInputError}</span>
        </form>
      </div>


      <div className="group">
        <h3>Active Alerts</h3>
        <Select className="basic-multi-select" isMulti options={options} onChange={alertsChanged} />
        <button onClick={sendAlertsChange}>
          Set Alerts
        </button>
      </div>

      <div className="group">
        <h3>Comms</h3>
        <div><span className="var">MsgSeq</span> <span>{podState.MsgSeq}</span></div>
        <div><span className="var">CmdSeq</span> <span>{podState.CmdSeq}</span></div>
        <div><span className="var">LTK</span> <span>{podState.LTK}</span></div>
        <div><span className="var">EapAkaSeq</span> <span>{podState.EapAkaSeq}</span></div>
        <div><span className="var">NoncePrefix</span> <span>{podState.NoncePrefix}</span></div>
        <div><span className="var">NonceSeq</span> <span>{podState.NonceSeq}</span></div>
        <div><span className="var">CK</span> <span>{podState.CK}</span></div>
      </div>


      <div className="logs">
      </div>
    </div>
  );
}

export default App;
