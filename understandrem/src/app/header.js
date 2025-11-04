import { useState } from "react";
import { setKey } from "./ai";

export default function URHeader() {
  return (
    <div  className="header panel">
      <h1 className="title">UnderstandREM</h1>
      <ApiKeyInput/>
    </div>
  )
}

function ApiKeyInput() {
  const [msgSoFar, setMsgSoFar] = useState("");

  function onInput(event) {
    setMsgSoFar(event.target.value);
  }

  function onSubmit() {
    setKey(msgSoFar);
    setMsgSoFar("");
  }

  return <div>
    <input className="keyInput" type="text" id="msgInput" name="Enter API Key" value={msgSoFar} onInput={onInput}/>
    <button type="button" onClick={onSubmit}>Load</button>
  </div>
}