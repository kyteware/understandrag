'use client'

import { useState } from "react";
import Chat, { Conversation, ConversationConfig } from "./chat";
import URHeader from "./header";

export default function Home() {
  const [newConvConfig, setNewConvConfig] = useState(new ConversationConfig(5, 5));
  const [currentConv, setCurrentConv] = useState(new Conversation(newConvConfig));

  return (
    <>
      <URHeader/>
      {/* horizontal blocks */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}> 
        <div>
          <p>Short term memory length: {newConvConfig.stmLength}</p>
          <input type="range" min="1" max="20" value={newConvConfig.stmLength} onChange={e => setNewConvConfig({...newConvConfig, stmLength: e.target.value })}/>
          <p>Max long term memory retrievals: {newConvConfig.maxRetrievals}</p>
          <input type="range" min="1" max="20" value={newConvConfig.maxRetrievals} onChange={e => setNewConvConfig({...newConvConfig, maxRetrievals: e.target.value })}/>
          <br/>
          <button type="button" onClick={() => setCurrentConv(new Conversation(newConvConfig))}>New Chat</button>
        </div>
        <Chat conversation={currentConv} addMessage={(msg) => setCurrentConv(prev => ({ ...prev, messages: [...prev.messages, msg] }))}/>
      </div>
    </>
  );
}