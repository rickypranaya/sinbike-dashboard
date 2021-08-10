import React, {useState} from 'react'
import firebase from "firebase/app";
import 'firebase/firestore'
import "firebase/auth"
import placeholder from "../assets/avatar_placeholder.png"
import cs_logo from "../assets/customer_service.jpg"


import MOCK_DATA from './MockMessageData.json'
import MOCK_MESSAGES from './MockMessages.json'

import { IoSend } from 'react-icons/io5'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

// firebase.initializeApp({
//     apiKey: "AIzaSyC5K-ydmgJZj3z2bIRkE0wG5it9SyayQYE",
//     authDomain: "sinbike-404fb.firebaseapp.com",
//     projectId: "sinbike-404fb",
//     storageBucket: "sinbike-404fb.appspot.com",
//     messagingSenderId: "541850232398",
//     appId: "1:541850232398:web:3150ade1d2dfc42b41051f"
//   })

// const auth = firebase.auth();
const firestore = firebase.firestore();

function Message () {
    const [selected, setSelected] = useState('empty')
    const [typeMessage, setType] = useState('')
    const [messages, setMessages] = useState(MOCK_MESSAGES)

    const renderCards =()=>{

        var data = MOCK_DATA;

        return(
            <div>
                {data.map(function(d, idx){
                return (chatCard(d))
            })}
            </div>
        )
        // alert(JSON.stringify(selected)== "{}")
    }

    const chatCard =(object)=>{
         var bgColor = selected.user_id == object.user_id? '#f1f1f1':'white'

        return(
            <div onClick={()=>{setSelected(object)}} className="chat-card" style={{backgroundColor: bgColor}}>
                    <img className="avatar" src={placeholder} alt="avatar" />
                    <div style={{display:'flex', flexDirection:'column',  justifyContent:'center', padding:'0 15px', flex:1, maxWidth:'70%'}}>
                        <span style={{textAlign:'left', fontWeight:'500'}}>{object.user_name}</span>
                        <span style={{textAlign:'left',lineHeight:'1.2em', maxHeight:'2.4em', fontSize:'14px', textOverflow: 'ellipsis',wordWrap: 'break-word',overflow: 'hidden'}}>{object.message}</span>
                    </div>
                    <div >
                        <span style={{ border:'1px solid #BBB', borderRadius:50, padding:'2px 5px', fontSize:'12px', color:'#BBB'}}>{object.created_at}</span>
                    </div>
                </div>
        )
    }

    const sendMessage =(event)=>{
        event.preventDefault();
        console.log(typeMessage)
        if (typeMessage!=''){
            var message_object = {
                avatar:  null,
                user_id:"0",
                user_name:"John Doe",
                message:typeMessage,
                created_at :"10:11"
            }
    
            setMessages([...messages,message_object])
            setType('')
        }
    }

    const messageBubble = (object)=>{
        var self = object.user_id == '0'
        var align;
        var bubbleColor;

        if (self){
            align = 'flex-end'
            bubbleColor = '#FFE2CD'
        } else {
            align = 'flex-start'
            bubbleColor = 'white'
        }

        return(
        <div style={{backgroundColor: bubbleColor, maxWidth:'50%', margin:'5px 25px', borderRadius:'10px', alignSelf: align, display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
            <span style={{textAlign:'left',fontSize:'14px', fontWeight:'500',  padding:'10px',}}> {object.message}</span>
            <span style={{color:'grey', fontSize:'12px', marginLeft:'15px', marginRight:'10px', marginBottom:'5px'}}>{object.created_at}</span>
        </div>
        )
    }

    const renderBubbles =()=>{
        var data = messages;

        return(
            <div className="chat-feed-main">
                {data.map(function(d, idx){
                return (messageBubble(d))
            })}
            </div>
        )
    }


    return (
        <div className="message">
            <div className="chat-list">
                <h2 style={{textAlign:'left', paddingLeft:25}}>Message</h2>
                {renderCards()}
            </div>

            {selected!= 'empty'?
            <div className="chat-feed">
                <div className="chat-feed-header">
                    <span style={{fontWeight:'600', fontSize:'18px'}}> {selected.user_name} </span>
                    <button className="main-button" >Resolved</button>
                </div>
                
              
               {renderBubbles()}


                <div className="chat-feed-input">
                    <form onSubmit={sendMessage} className="chat-feed-inputBox">
                        <input onChange={(val)=>{
                            setType(val.target.value)
                        }}
                         name='message' className='input-message' placeholder='Type message here' value={typeMessage}/>
                        <div onClick={sendMessage} style={{marginLeft:10, backgroundColor:'#FF6B37', padding:'10px', width:'25px', height:'25px', borderRadius:50, display:'flex', justifyContent:'center', alignItems:'center' }}>
                             <IoSend size='20px' color='white'/>
                        </div>
                    </form>
                </div>
            </div> : 
            <div className="chat-empty-feed">
                <img className="empty-feed-ill" src={cs_logo} alt="customer service illustration" />
                <span style={{fontSize:'20px', fontWeight:'600', color:'grey'}}> Don't keep them waiting</span>
            </div>
            }
        </div>
    )
}

export default Message;