"use client";
import { useRoom } from "@ably/chat/react";
import { useState, useEffect } from "react";

export default function RoomStatus() {
  const [currentRoomStatus, setCurrentRoomStatus] = useState<string>("");
  const { roomName } = useRoom({
    onStatusChange: (status) => {
      setCurrentRoomStatus(status.current);
    },
  });

  return (
    <div className="p-4 text-center border bg-gray-100">
      <h2 className="text-lg font-semibold text-blue-500">Room Status</h2>
      <p className="mt-2">
        Status: {currentRoomStatus} <br />
        Room: {roomName}
      </p>
    </div>
  );
}
