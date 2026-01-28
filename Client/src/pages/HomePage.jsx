import React, { useState } from 'react';
import Sidebar from '../component/Sidebar';
import ChatContainer from '../component/ChatContainer';
import RightSidebar from '../component/RightSidebar';
import { useChat } from '../../context/ChatContext';

const HomePage = () => {
  const {selctedUser} = useChat();

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%] bg-cover bg-center" style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}>
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid relative ${
          selctedUser
            ? 'grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
