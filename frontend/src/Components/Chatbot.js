import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);

const handleSend = async () => {
  if (!input.trim()) return;

  const currentInput = input;
  setMessages((prev) => [...prev, { sender: "user", text: currentInput }]);
  setInput("");
  setIsResponding(true);

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: currentInput }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: data.reply || "Sorry, I couldn’t process that.",
      },
    ]);
  } catch (err) {
    console.error("Chat error:", err);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Failed to connect to the chatbot." },
    ]);
  } finally {
    setIsResponding(false);
  }
};

  return (
    <>
      <button className="chatbot-icon" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender}>
                <b>{msg.sender === "user" ? "You:" : "Bot:"}</b> {msg.text}
              </div>
            ))}
            {isResponding && (
              <div className="bot typing">
                <b>Bot:</b> <span className="typing-dots"></span>
              </div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
