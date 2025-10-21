"use client";

import { useEffect, useState, useCallback } from "react";
import { useMessages } from "@ably/chat/react";
import { ChatMessageEvent, ChatMessageEventType, Message } from "@ably/chat";
import { useTyping } from "@ably/chat/react";

export default function ChatBox() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { sendMessage, updateMessage, historyBeforeSubscribe } = useMessages({
    listener: (event: ChatMessageEvent) => {
      const message = event.message;
      switch (event.type) {
        case ChatMessageEventType.Created:
          setMessages((prev) => [...prev, message]);
          break;
        case ChatMessageEventType.Updated:
          setMessages((prev) => {
            const idx = prev.findIndex((m) => m.serial === message.serial);
            if (idx === -1) return prev;
            const copy = prev.slice();
            copy[idx] = message;
            return copy;
          });
          break;
        default:
          console.error("Unhandled event", event);
      }
    },
  });

  // Load history
  useEffect(() => {
    async function loadHistory() {
      if (!historyBeforeSubscribe) return;
      try {
        const history = await historyBeforeSubscribe({ limit: 10 });
        setMessages(history.items);
      } catch (err) {
        console.error("Error loading message history:", err);
      }
    }
    loadHistory();
  }, [historyBeforeSubscribe]);

  const { currentlyTyping, keystroke, stop } = useTyping();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    if (newVal.trim().length > 0) {
      keystroke().catch((err) => console.error("Error starting typing", err));
    } else {
      stop().catch((err) => console.error("Error stopping typing", err));
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage({ text: inputValue.trim() }).catch((err) =>
      console.error("Error sending message", err)
    );
    setInputValue("");
    stop().catch((err) => console.error("Error stopping typing", err));
  };

  const onUpdateMessage = useCallback(
    (msg: Message) => {
      const newText = prompt("Enter new text");
      if (!newText) return;
      updateMessage(msg.serial, {
        text: newText,
        metadata: msg.metadata,
        headers: msg.headers,
      }).catch((error) => {
        console.warn("Failed to update message", error);
      });
    },
    [updateMessage]
  );

  return (
    <div className="flex flex-col w-full h-[600px] border rounded-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => {
          const isMine = msg.clientId === process.env.NEXT_PUBLIC_CLIENT_ID;
          return (
            <div
              key={idx}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              onClick={() => onUpdateMessage(msg)}
            >
              <div
                className={`max-w-[60%] rounded-2xl px-3 py-2 shadow-sm ${
                  isMine
                    ? "bg-green-200 text-gray-800 rounded-br-none"
                    : "bg-blue-50 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="flex flex-col border-t bg-gray-100"
        style={{ minHeight: "100px", maxHeight: "100px" }}
      >
        <div className="h-6 px-2 pt-2">
          {currentlyTyping.size > 0 && (
            <p className="text-sm text-gray-700 overflow-hidden">
              {Array.from(currentlyTyping).join(", ")}{" "}
              {currentlyTyping.size > 1 ? "are" : "is"} typing...
            </p>
          )}
        </div>
        <div className="flex items-center px-2 mt-auto mb-2">
          <input
            type="text"
            placeholder="Type something..."
            className="flex-1 p-2 border border-gray-400 rounded outline-none bg-white"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 ml-2 h-10 rounded hover:bg-blue-600"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
