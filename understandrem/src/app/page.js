'use client'

import { useState } from "react";
import Chat, { Conversation } from "./chat";
import URHeader from "./header";
import Conversations from "./conversations";

export default function Home() {
  const [currentConvId, setCurrentConvId] = useState(null);
  const [convList, setConvList] = useState([]);

  function getCurrentConv() {
    return convList.find((conv) => conv.id == currentConvId);
  }

  function updateCurrentConv(updatedConv) {
    setConvList(convList.map((conv) => conv.id == currentConvId? updatedConv : conv));
  }

  function addMessageToCurrentConv(msg) {
    let currentConv = getCurrentConv();
    updateCurrentConv({ ...currentConv, messages: [...currentConv.messages, msg] });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <URHeader/>
      {/* horizontal blocks */}
      <div style={{display: "flex", justifyContent: "space-between", height: "100%"}}> 
        <Conversations currentConvId={currentConvId} setCurrentConvId={setCurrentConvId} convList={convList} setConvList={setConvList}/>
        <Chat 
          conversation={getCurrentConv()} 
          addMessage={addMessageToCurrentConv}
        />
      </div>
    </div>
  );
}