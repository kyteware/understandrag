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

  function addMessageToCurrentConv(msg) {
    setConvList(prev => {
      const currentConv = prev.find((conv) => conv.id == currentConvId);
      const updatedConv = { ...currentConv, messages: [...currentConv.messages, msg] };
      return prev.map((conv) => conv.id == currentConvId? updatedConv : conv);
    })
  }

  return (
    <div className="pageMaster">
      <URHeader/>
      {/* horizontal blocks */}
      <Conversations currentConvId={currentConvId} setCurrentConvId={setCurrentConvId} convList={convList} setConvList={setConvList}/>
      <Chat 
        conversation={getCurrentConv()} 
        addMessage={addMessageToCurrentConv}
      />
    </div>
  );
}