import logo from './logo.svg';
import './App.css';
import { connect, sendMsg } from "./api";
import React, { useEffect, useState } from 'react'

function App() {

  const [podState, setPodState] = useState({});

  useEffect(() => {
    connect((msg) => {
      setPodState(msg)
      console.log("New pod state:", msg)
    });
  }, [])

  function send() {
    console.log("hello");
    sendMsg("hello");
  };

  return (
    <div className="App">
      <div className="Header">
        <span>Pod Simulator</span>
      </div>

      <div className="podstate">
        <div><span>LTK</span> <span>{podState.LKT}</span></div>
        <div><span>EapAkaSeq</span> <span>{podState.EapAkaSeq}</span></div>
        <div><span>Id</span> <span>{podState.Id}</span></div>
        <div><span>MsgSeq</span> <span>{podState.MsgSeq}</span></div>
        <div><span>CmdSeq</span> <span>{podState.CmdSeq}</span></div>
      </div>
      <button onClick={send}>Send Message</button>
    </div>
  );
}

export default App;
