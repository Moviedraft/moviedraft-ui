import React, { useState, useEffect } from 'react';
import PubNub from 'pubnub';
import { PubNubProvider, PubNubConsumer } from 'pubnub-react';
import '../styles/chat.css'

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY
});

const Chat = (props) => {
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState('');
  const channels = [props.gameId];
  const userHandle = props.userHandle;
  let mounted = false;

  useEffect(() => {
      pubnub.fetchMessages(
        {
          channels: channels,
          count: 100
        },
        (status, response) => {
          if (response.channels && props.gameId in response.channels) {
            response.channels[props.gameId].forEach((message) => {
              messages.push(message.message)
            });
          }
        }
      );
  }, []);

  const sendMessage = message => {
    console.log(props.userHandle)
    pubnub.publish(
      {
        channel: channels[0],
        message,
      },
      () => setMessage('')
    );
  };

  return (
    <PubNubProvider client={pubnub}>
      <div id='chatBox'>
        <PubNubConsumer>
          {client => {
            client.addListener({
              message: messageEvent => {
              addMessage([...messages, messageEvent.message]);
              },
            });
            client.subscribe({ channels });
          }}
        </PubNubConsumer>
        <div>
          <div id='messageWrapper'>
            {messages.map((message, messageIndex) => {
              return (
                <div
                  className='message'
                  key={`message-${messageIndex}`}>
                  {message}
                </div>
                );
            })}
          </div>
          <div id='messageInputDiv'>
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={e => setMessage(e.target.value)} />
            <button
              onClick={e => {e.preventDefault(); sendMessage(userHandle + ': ' + message);}}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </PubNubProvider>
  );
}

export default Chat;
