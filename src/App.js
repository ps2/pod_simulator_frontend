import logo from './logo.svg';
import './App.css';
import { connect, sendMsg } from "./api";
import React, { Component, useEffect, useState } from 'react'
import Select from 'react-select'
import faultData from './faults.json';

function App() {

  const [podState, setPodState] = useState({});
  const [reservoir, setReservoir] = useState(0);
  const [alertMask, setAlertMask] = useState(0);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [selectedFault, setSelectedFault] = useState();
  const [reservoirInputError, setReservoirInputError] = useState("");

  const alertOptions = [
    { value: 'slot0', label: 'AutoOff(0)' },
    { value: 'slot1', label: 'Unused(1)' },
    { value: 'slot2', label: 'ShutdownImminent(2)' },
    { value: 'slot3', label: 'ExpirationReminder(3)' },
    { value: 'slot4', label: 'LowReservoir(4)' },
    { value: 'slot5', label: 'SuspendedReminder(5)' },
    { value: 'slot6', label: 'SuspendExpired(6)' },
    { value: 'slot7', label: 'Lifecycle(7)' },
  ]

  const faultOptions = faultData.map((f) => { return {value: parseInt(f["code"], 16), label: f["description"] + " (" + f["code"] + ")"}});

  useEffect(() => {
    connect((newState) => {
      setPodState(newState)
      setReservoir(pulsesToUnits(newState.Reservoir))
      setAlertMask(newState.ActiveAlertSlots)

      var selected = []
      for (let i = 0; i < 8; i++) {
        if ((newState.ActiveAlertSlots & (1<<i)) != 0) {
          selected.push(alertOptions[i])
        }
      }
      setSelectedAlerts(selected)

      for (let i = 0; i < faultOptions.length; i++) {
        if (faultOptions[i].value == newState.FaultEvent) {
          setSelectedFault(faultOptions[i])
          break
        }
      }

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
      sendMsg({"command": "changeReservoir", "value": val});
    }
    event.preventDefault();
  };

  function alertsChanged(newValue) {
    var newAlertMask = 0;
    for (const element of newValue) {
      const slot = parseInt(element.value.substring(4,6))
      newAlertMask |= 1 << slot
    }
    setAlertMask(newAlertMask)
    setSelectedAlerts(newValue)
  }

  function faultChanged(newValue) {
    setSelectedFault(newValue.value)
  }

  function sendFault() {
    if (selectedFault) {
      sendMsg({"command": "setFault", "value": selectedFault});
    }
  }

  function sendAlertsChange(event) {
    sendMsg({"command": "setAlerts", "value": alertMask});
    event.preventDefault();
  };

  function dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

  function pulsesToUnits(pulses) {
    return Math.round(pulses * 0.05 * 100) / 100
  }

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
        <div><span className="var">PodProgress</span> <span className="val">{podState.PodProgress}</span></div>
        <div><span className="var">Reservoir</span> <span className="val">{pulsesToUnits(podState.Reservoir)} U</span></div>
        <div><span className="var">Delivered</span> <span className="val">{pulsesToUnits(podState.Delivered)} U</span></div>
        <div><span className="var">ActiveAlertSlots</span> <span>0b{dec2bin(podState.ActiveAlertSlots)}</span></div>
        <div><span className="var">BolusActive</span> <span>{podState.BolusActive ? "Yes" : "No"}</span></div>
        <div><span className="var">BasalActive</span> <span>{podState.BasalActive ? "Yes" : "No"}</span></div>
        <div><span className="var">TempBasalActive</span> <span>{podState.TempBasalActive ? "Yes" : "No"}</span></div>
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
        <Select className="basic-multi-select" isMulti options={alertOptions} onChange={alertsChanged} value={selectedAlerts} />
        <button onClick={sendAlertsChange}>
          Set Alerts
        </button>
      </div>

      <div className="group">
        <h3>Fault</h3>
        <Select options={faultOptions} onChange={faultChanged} value={selectedFault} />
        <button onClick={sendFault} disabled={selectedFault == null}>
          Trigger Fault
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
