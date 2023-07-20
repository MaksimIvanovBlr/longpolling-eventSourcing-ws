import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";

const WebSocke = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')
 

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')
        socket.current.onopen = () => {
            setConnected(true)
            console.log('Connection is established')
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(perv => [message, ...perv])
        }
        socket.current.onclose = () => {
        console.log('Close!');
        }
        socket.current.onerror = () => {
            console.log('Error conection');
        }
    }


    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'

        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (
            <div className='center'>
                <div className='form'>
                    <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder='enter your name'/>
                    <button onClick={connect}>LOGIN</button>
                </div>
            </div>
        )
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                    <button onClick={sendMessage}>send</button>
                </div>
                <div className="messages">
                    {messages.map(message =>
                        <div  key={message.id}>
                             {message.event === 'connection'
                            ?<div className='connection_message'> {message.username} connected</div>
                            :<div className='messsage'>{message.username}: {message.message}</div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSocke;
