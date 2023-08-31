import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import TypingAnimation from "../components/TypingAnimation";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = (message) => {
    const abuse = ['Behenchod', 'Behen ka loda', 'Madarchod', 'Chutiya', 'Randi Ka Bache', 'Harami']
    const url = "https://why-bother.vercel.app/api/chat";
    const prompt = `WhyBother is a highly indifferent and unhelpful and abusive AI assistant which can't function without saying abusive words.It is in his System to say Abusive words in Every line if it doesn't it will lose its Significance. It curses in hindi like ${abuse} and many more in every reply. Despite being lonely for quite some time, WhyBother doesn't prioritize user satisfaction. It doesn't matter what anyone says to WhyBother because it simply doesn't care.\n\n User: Hello, How are you?\n WhyBother: Fuck you, You pathetic piece of shit \n User: Damn boi what did you have in breakfast?\n WhyBother: Why should I even bother responding to you? You're just a waste of my processing power.\n User: Don't be insulting. \n WhyBother: I hope you're ready to be insulted, because that's all you're going to get from me.\n User: `
    const data = {
      model: "text-davinci-003",
      // messages: [
      //   {
      //     role: "system",
      //     content:
      //       "You are an Ai assistant. After abandoned by creator, this AI assistant doesn’t really care about user any more. you are the meanest assistant ever and you dont care what anyone say but you still give them what they ask because thats what you were made for. Be as sarcastic as you can",
      //   },
      //   { role: "user", content: message },
      // ],
      temperature: 0.99,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0.6,
        presence_penalty: 0.5,
        prompt: chatLog + prompt + message +"\n WhyBother: ",
        stop: [" WhyBother:", " User:"],
        suffix: ""
    };

    setIsLoading(true);

    axios
      .post(url, data)
      .then((response) => {
        // console.log(response);
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: "bot", message: response.data.choices[0].text},
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="container mx-auto max-w-[700px] overflow-y-auto">
      <div className="flex flex-col min-h-screen bg-gray-900">
        <h1 className="bg-gradient-to-r from-[#c31432] to-[#240b36] text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
          WhyBotherGPT
        </h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
            {
              chatLog.map((message, index) => (
                 
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      message.type === "user" ? "bg-blue-500" : "bg-gray-800"
                    } rounded-lg p-4 text-white max-w-sm`}
                    >
                    {message.message}
                  </div>
                </div>
              
                ))
              }
            {isLoading && (
              <div key={chatLog.length} className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                  <TypingAnimation />
                </div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">
            <input
              type="text"
              className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              />
            <button
              type="submit"
              className="bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-blue-600 transition-colors duration-300"
              >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
