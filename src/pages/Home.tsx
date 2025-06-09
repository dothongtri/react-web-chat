import backgroundImage from "../assets/chat-background.jpg";
import avtGroup from "../assets/avt-group.jpg";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React from "react";
const Home = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex h-16 p-4 font-bold text-xl border-b bg-cyan-600 text-white">
          <Bars3Icon className="w-[30px] mr-8  hover:text-gray-300 cursor-pointer text-white" />
          <div>Telegram</div>
          <MagnifyingGlassIcon className="w-[30px] ml-auto  hover:text-gray-300 cursor-pointer text-white" />
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-white font-semibold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold">User {i + 1}</div>
                <div className="text-sm text-gray-500">
                  Last message preview...
                </div>
              </div>
              <div className="text-xs text-gray-400">7:15 PM</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex-1 flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-300 bg-cyan-600 backdrop-blur-md">
          {/* Avatar nhóm */}
          <img
            src={avtGroup}
            alt="Group Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />

          {/* Tên nhóm và thành viên */}
          <div className="flex flex-col">
            <div className="text-base font-semibold text-white">
              Wave Hunters
            </div>
            <div className="text-xs text-white">
              2,768 members, 496 online
            </div>
          </div>

          {/* Các icon thao tác bên phải nếu cần */}
          <div className="ml-auto flex items-center gap-3">
            {/* Ví dụ: icon tìm kiếm, gọi video */}
            <button><MagnifyingGlassIcon className="w-[30px]  hover:text-gray-300 cursor-pointer text-white"/></button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg max-w-md">
            <div className="text-sm font-semibold">Galen Erso</div>
            <div className="text-sm text-gray-800">
              Hi everyone. I’ve redesigned some key structural components...
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg max-w-md">
            <div className="text-sm font-semibold">Darth Vader</div>
            <div className="text-sm text-gray-800">
              How will these changes affect the users?
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="h-16 flex items-center px-4 border-t border-gray-300 bg-white/70 backdrop-blur-md">
          <input
            type="text"
            placeholder="Write a message..."
            className="w-full p-2 border rounded-full outline-none bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
