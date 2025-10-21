"use client";
import { ChatRoomProvider } from "@ably/chat/react";
import ConnectionStatus from "../components/ConnectionStatus";
import RoomStatus from "../components/RoomStatus";
import PresenceStatus from "../components/PresenceStatus";
import ChatBox from "../components/ChatBox";
import ReactionComponent from "../components/ReactionComponent";

export default function Home() {
  return (
    <ChatRoomProvider name="my-first-room">
      <div className="container mx-auto p-4">
        <div className="flex space-x-4">
          <ConnectionStatus />
          <RoomStatus />
        </div>
        <div className="flex space-x-4 mt-4">
          <div className="w-1/2">
            <PresenceStatus />
          </div>
          <div className="w-1/2">
            <ChatBox />
            <ReactionComponent />
          </div>
        </div>
      </div>
    </ChatRoomProvider>
  );
}
