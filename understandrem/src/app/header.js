import { useState } from "react";
import { setKey } from "./ai";
import { TooltipWrapper } from "./tooltip";

export default function URHeader() {
  return (
    <div className="header panel">
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

  return <div className="apiKeySettings">
    <TooltipWrapper tooltipContent="">
      <p>
        To get a free API key, go to 
        <br/>
        <a href="https://aistudio.google.com/api-keys">Google's website</a>
      </p>
      <input className="keyInput" type="text" id="msgInput" placeholder="Enter API Key" value={msgSoFar} onInput={onInput}/>
    </TooltipWrapper>
    <button type="button" onClick={onSubmit}>Load</button>
  </div>
}