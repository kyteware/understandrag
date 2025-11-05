import { ConversationConfig, Conversation } from "./chat";
import { useState } from "react";
import Slider from "./slider";

export default function Conversations({ currentConvId, setCurrentConvId, convList, setConvList }) {
  const [newConvConfig, setNewConvConfig] = useState(new ConversationConfig(5, 5));

  function nextConvID() {
    if (convList.length == 0) {
      return 0;
    }

    return convList.at(-1).id + 1;
  }

  function onNewConv() {
    const newConv = new Conversation(newConvConfig, nextConvID());
    setConvList([...convList, newConv]);
    setCurrentConvId(newConv.id);
  }

  function onChooseConv(id) {
    setCurrentConvId(id);
  }

  return (
    <div className="conversations panel bottomPanel">
      <Slider name="Short Term Mem" min="1" max="20" def="5" onChange={stm => setNewConvConfig({...newConvConfig, stmLength: stm})}/>
      <Slider name="Long Term Retrievals" min="1" max="20" def="5" onChange={mx => setNewConvConfig({...newConvConfig, maxRetrievals: mx})}/>  
      <br/>
      <button type="button" onClick={onNewConv}>New Chat</button>
      <div className="verticalDivider"/>
      <fieldset>
        <legend>Select a Conversation:</legend>

        {
          convList.map(value => (
            <div key={value.id}>
              <input 
                type="radio" 
                id={"conv" + value.id} 
                name="conversations" 
                value={value.id}
                checked={currentConvId == value.id}
                onChange={event => onChooseConv(event.target.value)}
              />
              <label htmlFor={"conv" + value.id}>Conversation {value.id}</label>
            </div>
          ))
        }
      </fieldset>
    </div>
  )
}