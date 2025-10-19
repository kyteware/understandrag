'use client'

import { useState } from "react";
import Chat, { Conversation } from "./chat";
import URHeader from "./header";
import Conversations from "./conversations";

export default function Home() {
  const [currentConv, setCurrentConv] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <URHeader/>
      {/* horizontal blocks */}
      <div style={{display: "flex", justifyContent: "space-between", height: "100%"}}> 
        <Conversations currentConv={currentConv} setCurrentConv={setCurrentConv}/>
        <Chat conversation={currentConv} addMessage={(msg) => setCurrentConv(prev => ({ ...prev, messages: [...prev.messages, msg] }))}/>
      </div>
    </div>
  );
}