import React from 'react'
import ReactDOM from 'react-dom'
import { subscribeToMsgs, sendMsg } from './api'
import ReactHtmlParser from 'react-html-parser'
import './index.css'

function linkify(text) {
    // eslint-disable-next-line
    let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>'
    })
}

function removeHTML(text) {
    let htmlRegex = /<\/?([\s\S]*?)>/g
    return text.replace(htmlRegex, '')
}

function parseCommands(text) {
    let endReg = /\[\/\]/g,
        italicReg = /\[i\]/g,
        boldReg = /\[b\]/g,
        underlineReg = /\[u\]/g,
        strikethroughReg = /\[s\]/g,
        begReg = /\[/g,
        lastReg = /\]/g
    return (
        text.replace(endReg, '</span>')
            .replace(italicReg, `<span style="font-style:italic">`)
            .replace(boldReg, `<span style="font-weight:bold">`)
            .replace(underlineReg, `<span style="text-decoration:underline">`)
            .replace(strikethroughReg, `<span style="text-decoration:line-through">`)
            .replace(begReg, `<span style="`)
            .replace(lastReg, `">`))
}

class ChatBar extends React.Component {

    componentDidMount() {
        this.chatEvent()
    }

    chatEvent() {
        let chatBox = document.getElementById("chatBox")
        let usrBox = document.getElementById("usrBox")
        chatBox.addEventListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault()
                document.getElementById("chatSend").click()
            }
        })
        chatBox.addEventListener("keydown", (event) => {
            if (event.keyCode === 38) {
                chatBox.value = this.props.lastMsg.msg
            }
        })
        usrBox.addEventListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault()
            }
        })
        usrBox.addEventListener("keydown", (event) => {
            if (event.keyCode === 38) {
                usrBox.value = this.props.lastMsg.usr
            }
        })
    }

    render() {
        return (
            <form>
                <input type="text" id="usrBox" autoComplete="off"></input>
                <input type="text" id="chatBox" autoFocus="autofocus" autoComplete="off"></input>
                <button type="button" id="chatSend" onClick={
                    () => {
                        let chatBox = document.getElementById("chatBox")
                        let usrBox = document.getElementById("usrBox")
                        let usr
                        if (!usrBox.value | usrBox.value.length >= 200) usr = "Anonymous"
                        else usr = usrBox.value
                        if (chatBox.value !== "" && chatBox.value.length <= 500) this.props.onClick(chatBox.value, usr)
                        chatBox.value = ""
                    }
                }
                >Send</button>
                <hr className="box"></hr>
            </form>
        )
    }
}

class ChatMsg extends React.Component {

    checkLast() {
        if (!this.props.lastMsg) return (<hr className="div"></hr>)
    }

    render() {
        return (
            <div>
                <p className="date">
                    {this.props.date}
                </p>
                <h3 className="usr">
                    {ReactHtmlParser(linkify(parseCommands(removeHTML(this.props.usr))))}
                </h3>
                <p className="msg">
                    {ReactHtmlParser(linkify(parseCommands(removeHTML(this.props.msg))))}
                </p>
                {this.checkLast()}
            </div>
        )
    }
}

class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            history: []
        }
        subscribeToMsgs((err, res) => this.setState({ history: res }))
        this.doScroll = true
    }

    componentWillUpdate() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            this.doScroll = true
        }
    }

    componentDidUpdate() {
        if (this.doScroll) {
            window.scroll(0, document.body.scrollHeight)
            this.doScroll = false
        }
    }

    lastMsg() {
        return this.state.history[this.state.history.length - 1]
    }

    handleClick(value, usrName) {
        let date = new Date();
        let dateTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ' ' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
        sendMsg({ usr: usrName, msg: value, date: dateTime })
        this.doScroll = true
    }

    render() {
        return (
            <div>
                <ChatBar onClick={(value, usrName) => {
                    this.handleClick(value, usrName)
                }
                }
                    lastMsg={this.lastMsg()} />
                <div className="msgs">
                    {
                        this.state.history.map((item, index) => (
                            <ChatMsg key={index} msg={item.msg} usr={item.usr} date={item.date} lastMsg={this.state.history.length - 1 === index} />
                        ))
                    }
                </div>
            </div >
        )
    }

}

// ========================================

ReactDOM.render(
    <Chat />,
    document.getElementById("root")
)