"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [history, setHistory] = useState<{ sender: string; message: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  const askTheAI = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", message: input };
    setIsLoading(true);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      const aiResponse = { sender: "AI", message: data.response || "No response from AI." };

      setHistory([...history, userMessage, aiResponse]);
      setInput("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setHistory([...history, userMessage, { sender: "AI", message: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* Conversation History */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 mb-4 h-80 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Conversation History</h2>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            history.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.sender === "User"
                    ? "bg-gray-200 text-left self-start"
                    : "bg-blue-200 text-left self-end"
                }`}
              >
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            ))
          )}
          <div ref={historyEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <textarea
        className="w-full max-w-2xl h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your question here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askTheAI();
          }
        }}
      ></textarea>

      <button
        onClick={askTheAI}
        disabled={isLoading}
        className="mt-4 w-full max-w-2xl bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
      >
        {isLoading ? "Loading..." : "Ask the A.I"}
      </button>

      <button
        onClick={() => setHistory([])}
        className="mt-2 w-full max-w-2xl bg-red-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
      >
        Clear History
      </button>
    </div>
  );
}