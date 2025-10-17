import { useState } from "react";
import { setKey } from "./ai";

export default function URHeader() {
  return (
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <h1>UnderstandREM</h1>
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
    <input type="text" id="msgInput" name="Enter API Key" value={msgSoFar} onInput={onInput}/>
    <button type="button" onClick={onSubmit}>Load</button>
  </div>
}