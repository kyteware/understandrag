import { ConversationConfig, Conversation } from "./chat";
import { useState } from "react";

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
    <div>
      <p>Short term memory length: {newConvConfig.stmLength}</p>
      <input type="range" min="1" max="20" value={newConvConfig.stmLength} onChange={e => setNewConvConfig({...newConvConfig, stmLength: e.target.value })}/>
      <p>Max long term memory retrievals: {newConvConfig.maxRetrievals}</p>
      <input type="range" min="1" max="20" value={newConvConfig.maxRetrievals} onChange={e => setNewConvConfig({...newConvConfig, maxRetrievals: e.target.value })}/>
      <br/>
      <button type="button" onClick={onNewConv}>New Chat</button>
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
      <p>{convList.length}</p>
    </div>
  )
}