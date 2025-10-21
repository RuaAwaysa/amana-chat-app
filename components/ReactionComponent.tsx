"use client";
import { useState } from "react";
import { useRoomReactions } from "@ably/chat/react";
import { RoomReaction } from "@ably/chat";

export default function ReactionComponent() {
  const [roomReactions, setRoomReactions] = useState<RoomReaction[]>([]);
  const { sendRoomReaction } = useRoomReactions({
    listener: (reactionEvent) => {
      setRoomReactions((prev) => [...prev, reactionEvent.reaction]);
    },
  });

  const reactions = ["❤️", "👍", "😂", "🎉", "😮"];

  return (
    <div className="mt-4">
      <div className="flex justify-evenly items-center px-4 py-2 border-t bg-white">
        {reactions.map((reaction) => (
          <button
            key={reaction}
            onClick={() =>
              sendRoomReaction({ name: reaction }).catch((err) =>
                console.error("Error sending reaction", err)
              )
            }
            className="text-xl p-1 border border-blue-500 rounded hover:bg-blue-100 text-blue-500 transition-colors"
          >
            {reaction}
          </button>
        ))}
      </div>
      <div className="flex gap-2 px-2 py-2 border-t bg-white">
        <span>Received reactions:</span>
        <div className="flex-1 flex items-center max-h-[24px] gap-1 overflow-x-auto whitespace-nowrap">
          {roomReactions.map((r, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-white rounded text-blue-600"
            >
              {r.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
