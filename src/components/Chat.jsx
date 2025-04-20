import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col w-[95%] md:w-[80%] lg:w-[65%] mx-auto my-6 bg-[#0f172a] rounded-lg shadow-lg h-[85vh]">
      {/* Header */}
      <div className="bg-[#6366f1] px-6 py-3 rounded-t-lg flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">Chat</h1>
        <span className="text-sm text-white opacity-80">DevConnect</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#1e293b]">
        {messages.map((msg, index) => {
          const isSender = user.firstName === msg.firstName;
          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%]">
                <div
                  className={`text-xs mb-1 ${
                    isSender ? "text-right text-blue-300" : "text-left text-gray-400"
                  }`}
                >
                  <span className="font-semibold">
                    {msg.firstName} {msg.lastName}
                  </span>{" "}
                  ·1min ago
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 text-sm shadow-md break-words ${
                    isSender
                      ? "bg-[#6366f1] text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="bg-[#1e293b] px-6 py-4 border-t border-gray-700 flex gap-2 items-center rounded-b-lg">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 bg-[#334155] text-white placeholder-gray-400 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#6366f1] hover:bg-[#4f46e5] transition text-white px-5 py-2 rounded-full text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
