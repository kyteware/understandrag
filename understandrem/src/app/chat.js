import { useState } from "react";
import { prompt, query } from "./ai";

export default function Chat({ conversation, addMessage }) {
  if (conversation == undefined) {
    return <div className="remChat">
      <h1>Create a new chat!</h1>
    </div>
  }

  const messages = conversation.messages;
  const { stmLength, maxRetrievals } = conversation.config;
  let msgs = messages.map(message => <Msg message={message} key={message.number}/>)


  return (
    <div className="remChat">
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

function Msg({ message }) {
  return <p className={message.label == "user" ? 'userMsg' : 'assistantMsg'}>{message.text}</p>
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