import React, { useState } from 'react';
import './ChatPanel.css';

const ChatPanel = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'You',
            text: 'Hey Jarvis, can you help me with a math problem??',
            time: '19:00',
            date: '2023-10-01'
        },
        {
            id: 2,
            sender: 'Jarvis',
            text: 'Sure, how can I help?',
            time: '19:00',
            date: '2023-10-01'
        },
        {
            id: 3,
            sender: 'You',
            text: 'What is 1+2?',
            time: '19:01',
            date: '2023-10-01'
        },
        {
            id: 4,
            sender: 'Jarvis',
            text: 'The answer is 3!',
            time: '19:01',
            date: '2023-10-01'
        },
        {
            id: 5,
            sender: 'You',
            text: 'Thanks Jarvis!',
            time: '19:02',
            date: '2023-10-01'
        }
    ]);

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="chat-panel">
            {/* Header */}
            <div className="chat-header">
                <div className="title-section">
                    <h1>Jarvis - Voice Assistant</h1>
                    <h2>Speak to AI, get intelligent responses</h2>
                </div>

            </div>

            {/* Main Content */}
            <div className="chat-content">
                {/* Avatar/Image Section */}
                <div className="avatar-section">
                    <div className="avatar-container">
                        <div className="avatar-orb">

                        </div>
                    </div>
                    <button className="chat-button">Chat</button>
                </div>

                {/* Chat History */}
                <div className="chat-history-section">
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div key={message.id} className={`message ${message.sender.toLowerCase()}`}>
                                <div className="message-content">
                                    <strong>{message.sender}:</strong> {message.text}
                                </div>
                                <div className="message-time">{message.time}, {message.date}</div>
                            </div>
                        ))}
                        {messages.length === 0 && (
                            <div className="empty-chat">No messages yet. Click <i>CHAT</i> to start a conversation</div>
                        )}
                    </div>
                    <button className="clear-chat-button" onClick={clearChat}>
                        Clear Chat
                    </button>
                </div>
            </div>
            {/* Footer */}
            <footer className="chat-footer">
                <p>Created by N.B.</p>
            </footer>
        </div>
    );
};

export default ChatPanel;