import React, { useState, useEffect, FormEvent } from 'react';
import { useChannel } from 'ably/react';
import * as Ably from 'ably';

// Define the interface for your chat message data payload
interface ChatMessageData {
  text: string;
  // Add other properties if your messages have more data, e.g., imageUrl?: string;
}

// Define the full structure of a message as it will be stored in state
interface StoredChatMessage extends Ably.Message<ChatMessageData> {
  // You can add derived properties or override types if needed
  // For example, if clientId might be null/undefined from Ably, but you want it as string:
  clientId: string;
}

export default function Chat() { // Renamed from Home to Chat
  // Use StoredChatMessage[] for the messages state array
  const [messages, setMessages] = useState<StoredChatMessage[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [connectedClientId, setConnectedClientId] = useState<string | null>(null);

  // useChannel hook, specifying the expected data type for incoming messages
  const { channel, publish, ably } = useChannel<ChatMessageData>('chat-channel', (message: Ably.Message<ChatMessageData>) => {
    // Ensure message.clientId is treated as a string for our StoredChatMessage
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        clientId: message.clientId || 'anonymous-user', // Fallback for clientId
      } as StoredChatMessage, // Cast to our custom interface
    ]);
  });

  useEffect(() => {
    if (ably) {
      // Access the clientId from the Ably instance once connected
      setConnectedClientId(ably.connection.clientId);
    }
  }, [ably]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (messageText.trim() && publish) { // Ensure publish function is available
      try {
        await publish('message', { text: messageText }); // Publish with the defined ChatMessageData
        setMessageText(''); // Clear input after sending
      } catch (error) {
        console.error('Error publishing message:', error);
        // Optionally, show an error message to the user
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1>Ably Next.js Chat</h1>
      <p>Connected as: <strong>{connectedClientId || 'Connecting...'}</strong></p>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px', marginBottom: '15px', backgroundColor: '#f9f9f9' }}>
        {messages.length === 0 ? (
          <p style={{ color: '#888' }}>No messages yet. Start typing!</p>
        ) : (
          messages.map((msg) => (
            <p key={msg.id} style={{ margin: '5px 0', wordBreak: 'break-word' }}>
              <strong style={{ color: msg.clientId === connectedClientId ? '#0070f3' : '#a0522d' }}>{msg.clientId}:</strong> {msg.data?.text}
              <span style={{ fontSize: '0.75em', color: '#999', marginLeft: '10px' }}>
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
              </span>
            </p>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px 0 0 4px', marginRight: '-1px' }}
          disabled={!channel} // Disable input if channel is not ready
        />
        <button
          type="submit"
          style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}
          disabled={!channel || !messageText.trim()} // Disable button if channel is not ready or no text
        >
          Send
        </button>
      </form>
    </div>
  );
}