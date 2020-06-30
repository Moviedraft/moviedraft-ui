import React, { Component } from 'react'
import PubNub from 'pubnub'
import moment from 'moment'
import { PubNubProvider } from 'pubnub-react'
import '../styles/chat.css'

class Chat extends Component {
  constructor(props){
    super(props)
    this.state = {
      message: '',
      messages: [],
      channelId: this.props.gameId,
      userHandle: localStorage.getItem('CouchSportsHandle')
    }

    this.pubnub = new PubNub({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
      uuid: this.props.gameId + this.props.gameId
    });

    this.processMessage = this.processMessage.bind(this)
    this.setMessage = this.setMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.getMessage = this.getMessage.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount() {
    this.pubnub.addListener({
      message: messageEvent => {
        this.processMessage(messageEvent.message)
      }
    });

    this.pubnub.subscribe({
      channels: [this.state.channelId],
      withPresence: true
    });

    this.pubnub.fetchMessages(
      {
        channels: [this.state.channelId],
        count: 100
      },
      (status, response) => {
        if (response.channels && this.state.channelId in response.channels) {
          response.channels[this.state.channelId].forEach((message) => {
            this.processMessage(message.message)
          });
        }
      }
    );
  }

  componentDidUpdate() {
        const messageWrapper = document.getElementById('messageWrapper');
        messageWrapper.scrollTop = messageWrapper.scrollHeight;
      }

  componentWillUnmount() {
    this.pubnub.unsubscribe({ channels: [this.state.channelId] });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.sendMessage(this.state.userHandle + ': ' + this.state.message)
    }
  }

  getMessage() {
    this.pubnub.fetchMessages(
      {
        channels: [this.state.channelId]
      },
      (status, response) => {
        if (response.channels && this.state.channelId in response.channels) {
          response.channels[this.state.channelId].forEach((message) => {
            this.processMessage(message.message)
          });
        }
      }
    );
  }

  processMessage(message) {
    let processedMessage = ''
    let splitMessage = message.split(/_(.*)/)
    if (splitMessage.length > 1) {
      let time = splitMessage[0]
      let text = splitMessage[1]
      let localTime = '(' + moment(time.toUpperCase()).format('lll') + ')'
      processedMessage = localTime + ' ' + text
    } else {
      processedMessage = message
    }

    this.setState(previousState => ({messages: [...previousState.messages, processedMessage]}));
  }

  setMessage(message) {
    this.setState({message: message})
  }

  sendMessage(message) {
    message = moment.utc().format() + '_' + message
    this.pubnub.publish(
      {
        channel: this.state.channelId,
        message,
      },
      () => this.setMessage('')
    );
  }

  render() {
    return (
      <PubNubProvider client={this.pubnub}>
        <div id='chatBox'>
          <div>
            <div id='messageWrapper'>
              {this.state.messages.map((message, messageIndex) => {
                return (
                  <div
                    key={`message-${messageIndex}`}>
                    {message}
                  </div>
                );
              })}
              <div style={{ float:'left', clear: 'both' }}
                ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </div>
            <div id='messageInputDiv'>
              <input
                id='messageInput'
                type='text'
                placeholder='Type your message'
                value={this.state.message}
                onChange={e => this.setMessage(e.target.value)}
                onKeyPress={this.handleKeyPress} />
              <button
                id='messageSendButton'
                onClick={e => {e.preventDefault(); this.sendMessage(this.state.userHandle + ': ' + this.state.message);}}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </PubNubProvider>
    )
  }
}

export default Chat;
