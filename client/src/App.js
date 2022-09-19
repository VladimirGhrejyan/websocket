import React, {useState, useRef} from 'react'

import './App.css'

const App = () => {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')
  const [value, setValue] = useState('')
  const socket = useRef()

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:5000')

    socket.current.onopen = () => {
      setIsConnected(true)
      const message = {
        event: 'connection',
        id: Date.now(),
        username,
      }
      socket.current.send(JSON.stringify(message))
    }

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => (
        [message, ...prev]
      ))
    }

    socket.current.onclose = () => {
      console.log('Socket closed');
    }

    socket.current.onerror = () => {
      console.log('Socket error');
    }
  }

  const sendMessage = async () => {
    const message = {
      message: value,
      id: Date.now(),
      event: 'message',
      username
    }
    socket.current.send(JSON.stringify(message));
        setValue('')
  }

  if (!isConnected) {
    return (
      <div className='container'>
        <div className='form'>
          <input className='input' value={username} onChange={(event) => setUsername(event.target.value)} placeholder='Enter your name' />
          <button className='button' onClick={connect}>Enter</button>
        </div>
      </div>
    )
  }
  
  return (
    <div className='container'>
      <div className='form'>
        <div className='formContainer'>
          <input className='input' value={value} onChange={(event) => setValue(event.target.value)} />
          <button className='button' onClick={sendMessage}>Send</button>
        </div>
        <div className='messages'>
          {
            messages.map((item) => {
              return (
                <div key={item.id}>
                  {
                    item.event === 'connection' ? (
                      <div className='connectionMessage'>
                        User {item.username} joined
                      </div>
                    ) : (
                      <div className='message'>
                        {item.username}: {item.message}
                      </div>
                    )
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default App;
