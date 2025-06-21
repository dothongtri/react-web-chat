import backgroundImage from "../assets/chat-background.jpg";
import avtGroup from "../assets/avt-group.jpg";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ChatBox from "../components/ChatBox";
import UserListItem from "../components/UserListItem";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStompClient } from "../hooks/useStompClient";
import { useUnauthorizedHandler } from "../hooks/useUnauthorizedHandler";

interface Friend {
  id: BigInteger;
  username: string;
  email: string;
  avt?: string;
  lastMessage?: string;
  sender?: string;
  lastMessageTime?: string;
  unreadCount: number;
}
type Message = {
  fromMe: boolean;
  text: string;
  sender?: string;
};

type ReceiveMessage = {
  content: string;
  sender?: string;
  receiver?: string;
};

interface unreadCount {
  senderId: BigInteger;
  senderUsername: string;
  unreadCount: number;
}

const Home = () => {
  const handleUnauthorized = useUnauthorizedHandler(); // gọi hook ở đầu component
  const [friends, setFriends] = useState<Friend[]>([]);
  const [receiver, setReceiver] = useState<Friend>();
  const [messages, setMessages] = useState<{ [receiver: string]: Message[] }>(
    {}
  );

  // Callback nhận tin nhắn từ server
  const handleReceiveMessage = useCallback(
    async (msg: ReceiveMessage) => {
      setMessages((prev) => {
        if (!msg.sender) return prev;
        const friend = friends.find((f) => f.email == msg.sender);
        const list = prev[msg.sender] || [];
        return {
          ...prev,
          [msg.sender]: [
            ...list,
            {
              fromMe: false,
              text: msg.content,
              sender: friend?.username,
            },
          ],
        };
      });
      // Cập nhật unreadCount và lastMessage
      if (receiver?.email === msg.sender) {
        // Đang xem chat này, không tăng unreadCount
        // Có thể gọi API mark-read tại đây
        await fetch(
        `/api/messages/mark-read?receiverId=${user?.id}&senderId=${friends.find(f => f.email === msg.sender)?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      } else {
        // Không ở trong chat này, tăng unreadCount
        setFriends((prev) =>
          prev.map((f) =>
            f.email === msg.sender
              ? {
                  ...f,
                  unreadCount: (f.unreadCount || 0) + 1,
                  lastMessage: msg.content,
                }
              : f
          )
        );
      }
    },
    [friends]
  );
  // Khởi tạo WebSocket chỉ 1 lần ở Home
  const { sendMessage, isConnected } = useStompClient(handleReceiveMessage);

  const { token, user } = useAuth(); // ✅ lấy từ context

  useEffect(() => {
    const fetchUsersAndUnread = async () => {
      if (!user) return;
      try {
        // 1. Lấy danh sách bạn bè
        const response = await fetch(`/api/friend/${user.id}/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          handleUnauthorized(response.status);
          return;
        }
        const friendsData = await response.json();
        console.log("Friends data:", friendsData);
        setFriends(friendsData);

        // 2. Lấy unread count sau khi đã set friends
        const unreadRes = await fetch(
          `/api/messages/unread-counts?userId=${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!unreadRes.ok) {
          handleUnauthorized(unreadRes.status);
          return;
        }
        const unreadData: unreadCount[] = await unreadRes.json();
        setFriends((prev) =>
          prev.map((friend) => {
            const unread = unreadData.find((u) => u.senderId === friend.id);
            return {
              ...friend,
              unreadCount: unread?.unreadCount || 0,
            };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsersAndUnread();
  }, []);

  const handleClickUserItem = async (receiver: Friend) => {
    setReceiver(receiver);

    // Khi chọn người dùng, lấy tin nhắn đã có giữa hai người
    try {
      const response = await fetch(
        `/api/messages/list?senderId=${user?.email}&receiverId=${receiver.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        handleUnauthorized(response.status);
        return;
      }
      const data = await response.json();
      setMessages((prev) => ({
        ...prev,
        [receiver.email]: data.map((msg: any) => ({
          fromMe: msg.sender.email === user?.email,
          text: msg.content,
          sender: msg.sender.username,
        })),
      }));

      // ✅ Gọi API mark-read sau khi đã lấy và hiển thị tin nhắn
      await fetch(
        `/api/messages/mark-read?receiverId=${user?.id}&senderId=${receiver.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Cập nhật unreadCount về 0 sau khi đã đọc
      setFriends((prev) =>
        prev.map((friend) =>
          friend.id === receiver.id ? { ...friend, unreadCount: 0 } : friend
        )
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

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
          {/* {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                            <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-white font-semibold">
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold">
                                    User {i + 1}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Last message preview...
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">7:15 PM</div>
                        </div>
                    ))} */}
          {friends.map((friend, i) => {
            return (
              <UserListItem
                onClick={() => handleClickUserItem(friend)}
                key={i}
                userName={friend.username}
                id={friend.id}
                avt={friend.avt}
                lastMessage={
                  friend.sender === user?.email
                    ? "You: " + (friend.lastMessage ?? "")
                    : friend.lastMessage ?? ""
                }
                unreadCount={friend.unreadCount}
              />
            );
          })}
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
              {receiver?.username || "Select a user to chat"}
            </div>
            <div className="text-xs text-white">online</div>
          </div>

          {/* Các icon thao tác bên phải nếu cần */}
          <div className="ml-auto flex items-center gap-3">
            {/* Ví dụ: icon tìm kiếm, gọi video */}
            <button>
              <MagnifyingGlassIcon className="w-[30px]  hover:text-gray-300 cursor-pointer text-white" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        {/* <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    <OtherMessage message="aaaaaaaaaaaa" name="TriDo" />
                    <MyMessage message="bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" />
                </div> */}
        <ChatBox
          receiver={receiver?.email || ""}
          sendMessage={sendMessage}
          isConnected={isConnected}
          messages={messages[receiver?.email || ""] || []}
          setMessages={setMessages}
          user={user}
        />
        {/* Input */}
        {/* <div className="h-16 flex items-center px-4 border-t border-gray-300 bg-white/70 backdrop-blur-md">
                    <input
                        type="text"
                        placeholder="Write a message..."
                        className="w-full p-2 border rounded-full outline-none bg-gray-100"
                    />
                </div> */}
      </div>
    </div>
  );
};

export default Home;
