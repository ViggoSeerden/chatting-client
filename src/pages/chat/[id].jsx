import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ChatComponent = () => {
    const router = useRouter()
    const id = router.query.id

    const [userId, setUserId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!id) {
            return
        }
        setUserId(id)

        const ws = new WebSocket(`wss://localhost:7138/ws?userId=${id}`);

        ws.onopen = () => {
            console.log('WebSocket connection opened.');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        ws.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [id]);

    const sendMessage = () => {
        if (socket && inputValue) {
            const message = {
                UserId: userId,
                Content: inputValue,
                Timestamp: new Date().toISOString()
            };
            socket.send(JSON.stringify(message));
            setMessages((prevMessages) => [...prevMessages, message]);
            setInputValue('')
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            <div>
                <input
                    type="text"
                    className='border-2'
                    placeholder='message...'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <h2>Messages:</h2>
            <div className='flex flex-col'>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <div className={msg.UserId == userId ? "ml-[100px] bg-slate-200 w-min" : "bg-slate-800 text-white w-min"}>{msg.Content}</div>
                        <br/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatComponent;
