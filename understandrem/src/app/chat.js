import { useState } from "react";
import { prompt, query } from "./ai";

export default function Chat({ conversation, addMessage }) {
  if (conversation == undefined) {
    return <div className="remChat panel bottomPanel">
      <h1>Create a new chat!</h1>
    </div>
  }

  const [hovered, setHovered] = useState(null);

  const messages = conversation.messages;
  const { stmLength, maxRetrievals } = conversation.config;
  let msgs = messages.map(message => <Msg message={message} hovered={hovered} setHovered={setHovered} stmLength={conversation.config.stmLength} key={message.number}/>)

  return (
    <div className="remChat panel">
      <div className="remChatMessages">
        {msgs}
      </div>
      <MsgTextBox handleMessage={
        async (text) => {
          const user_prompt = new Message(messages.length, "user", text);
          addMessage(user_prompt);

          let retrieved = null;
          if (messages.length > stmLength * 2) {
            retrieved = await query(text, maxRetrievals, messages.slice(0, -(stmLength * 2)));
          }

          try {
            const resp = await prompt([...messages, user_prompt], retrieved);
            const assistant_reponse = new Message(messages.length + 1, "assistant", resp, retrieved);
            addMessage(assistant_reponse)
          } catch (err) {
            console.log(err)
          }
        }
      }/>
    </div>
  );
}

function Msg({ message, hovered, setHovered, stmLength }) {
  function handleMouseEnter() {
    setHovered(message);
  }
  function handleMouseLeave() {
    setHovered(null);
  }

  const authorName = message.label == "user" ? 'userMsg' : 'assistantMsg';
  let hoveredClass = "";
  if (message == hovered) {
    hoveredClass = "msgHovered";
  } else if (hovered !== null && hovered.retrieved !== null && hovered.retrieved.includes(message)) {
    hoveredClass = "longTermRecalled";
  } else if (hovered !== null && hovered.number > message.number && (hovered.number-1) - stmLength*2 <= message.number) {
    hoveredClass = "shortTermRecalled";
  }
  const className = authorName + " " + hoveredClass;

  return (
    <p 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {message.text}
    </p>
  )
}

export class Message {
  constructor(number, label, text, retrieved = null) {
    if (label != "user" && label != "assistant") {
      throw "Invalid user (should be user or assistant)";
    }

    this.number = number;
    this.label = label;
    this.text = text;
    this.retrieved = retrieved;
    this.embedding = undefined;
  }
}

export class Conversation {
  constructor(config, id) {
    this.id = id
    this.config = config
    this.messages = []
  }
}

export class ConversationConfig {
  constructor(stmLength, maxRetrievals) {
    this.stmLength = stmLength;
    this.maxRetrievals = maxRetrievals;
  }
}

function MsgTextBox({ handleMessage }) {
  const [msgSoFar, setMsgSoFar] = useState("");

  function onInput(event) {
    setMsgSoFar(event.target.value);
  }

  function onSubmit(event) {
    if (msgSoFar === "") {
      return;
    }
    setMsgSoFar("");
    handleMessage(msgSoFar);
  }

  // return <form action={handleMessage} onSubmit={onSubmit}>
  //   <input type="ltext" id="messageText" name="Message text"/>
  //   <input type="submit" value="Submit"/>
  // </form>;

  return <div>
    <input type="text" id="msgInput" name="Enter prompt here" value={msgSoFar} onInput={onInput}/>
    <button type="button" onClick={onSubmit}>Prompt</button>
  </div>
}