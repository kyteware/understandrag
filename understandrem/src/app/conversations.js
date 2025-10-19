import { ConversationConfig, Conversation } from "./chat";
import { useState } from "react";

export default function Conversations({ currentConv, setCurrentConv }) {
  const [newConvConfig, setNewConvConfig] = useState(new ConversationConfig(5, 5));
  const [convList, setConvList] = useState([]);

  function nextConvID() {
    if (convList.length == 0) {
      return 0;
    }

    return convList.at(-1).id + 1;
  }

  function onNewConv() {
    const newConv = new Conversation(newConvConfig, nextConvID());
    setCurrentConv(newConv);
    setConvList([...convList, newConv]);
  }

  function onChooseConv(id) {
    const conv = convList.find((value) => value.id == id);
    setCurrentConv(conv);
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
                checked={currentConv.id == value.id}
                onChange={event => onChooseConv(event.target.value)}
              />
              <label htmlFor={"conv" + value.id}>Conversation {value.id}</label>
            </div>
          ))
        }

        {/* <div>
          <input type="radio" id="conv1" name="conversation" value="1"/>
          <label for="conv1">Project Alpha Chat</label>
        </div>

        <div>
          <input type="radio" id="conv2" name="conversation" value="2"/>
          <label for="conv2">Meeting Notes - 2025/10/18</label>
        </div>

        <div>
          <input type="radio" id="conv3" name="conversation" value="3" checked/>
          <label for="conv3">Marketing Strategy Review</label>
        </div> */}
      </fieldset>
      <p>{convList.length}</p>
    </div>
  )
}