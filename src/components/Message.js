import React, {useState, useRef, useEffect} from 'react'
import placeholder from "../assets/avatar_placeholder.png"
import cs_logo from "../assets/customer_service.jpg"
import {db} from '../firebase'
import firebase from 'firebase'
import MOCK_DATA from './MockMessageData.json'
import MOCK_MESSAGES from './MockMessages.json'
import Modal from 'react-modal';
import { IoSend } from 'react-icons/io5'
import { AiOutlineFileDone } from 'react-icons/ai'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { useSnackbar } from 'react-simple-snackbar'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius:'10px',
      display:'flex',
      flexDirection:'column',
      padding:'25px'
    },
};

function Message () {

//snackbar
const options_success = {
    position: 'top-center',
    style: {
      backgroundColor: '#3BB502',
      color: 'white',
      fontSize: '16px',
      borderRadius: '10px',
      textAlign: 'center',
    },
    closeStyle: {
      color: 'white',
      fontSize: '16px',
    },
  }

  const options_alert = {
    position: 'top-center',
    style: {
      backgroundColor: 'grey',
      color: 'white',
      fontSize: '16px',
      borderRadius: '10px',
      textAlign: 'center',
    },
    closeStyle: {
      color: 'white',
      fontSize: '16px',
    },
  }

  const options_error = {
    position: 'top-center',
    style: {
      backgroundColor: '#FF3C43',
      color: 'white',
      fontSize: '16px',
      borderRadius: '10px',
      textAlign: 'center',
    },
    closeStyle: {
      color: 'white',
      fontSize: '16px',
    },
  }

    const [openSuccess, closeSnackbar] = useSnackbar(options_success)
    const [openAlert, closeALert] = useSnackbar(options_alert)
    const [openError, closeError] = useSnackbar(options_error)

    const [selected, setSelected] = useState('empty')
    const [typeMessage, setType] = useState('')
    const [messages, setMessages] = useState([])
    const [modalIsOpen, setIsOpen] = React.useState(false);


    // const messagesEndRef = useRef(null)
    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    //   }

      useEffect(()=>{     
        db.collection('messages').orderBy('createdAt').limit(1000).onSnapshot(snapshot=>{

            // snapshot.docs.map((doc) =>{ 
            //     var obj = {id: doc.id, data : doc.data()}
            //     setMessagesApi([...messagesApi, obj])
            //     setMessages([...messages,doc.data()])
            // })
            
            // setMessages(snapshot.docs.map(doc => doc.data()))
            setMessages (snapshot.docs.map((doc) => {
                return {id : doc.id, data: doc.data()}
            })
            )
            // setMessages(messages.reverse())
        })
      },[ ])


    const RenderCards =()=>{
        var data = messages;
        var reverse = [...data].reverse()
        
        var check = []
        var cardsData = []

        reverse.map(function(d, idx){
            var id = d.data.user_id 
            if(!check.includes(id)){
                check.push(id)
                cardsData.push(d.data)
            } 
        })

        return(
            <div>
                {cardsData.map(function(d, idx){
                return (chatCard(d))
            })}
            </div>
        )
        // alert(JSON.stringify(selected)== "{}")
    }

    const clickCard = (object)=>{
        // console.log(messages)
        setSelected(object)
        // var id = object.user_id
        // var obj = messages.filter(function (e) {
        //     return e.data.user_id == id;
        // });
        // setChatData(obj)
    }

    const timeFormat= (d)=>{
        const date = d? d.toDate() : new Date();
        var hours = date.getHours().toString().length == 1? '0'+date.getHours().toString() : date.getHours().toString()
        var minute = date.getMinutes().toString().length == 1? '0'+date.getMinutes().toString() : date.getMinutes().toString()
        return hours+':'+minute
    }

    const chatCard =(object)=>{
        var time = timeFormat(object.createdAt)

        const date = object.createdAt? object.createdAt.toDate() : new Date();
        var hours = date.getHours().toString().length == 1? '0'+date.getHours().toString() : date.getHours().toString()
        var minute = date.getMinutes().toString().length == 1? '0'+date.getMinutes().toString() : date.getMinutes().toString()
        var time = hours+':'+minute

        var bgColor = selected.user_id == object.user_id? '#f1f1f1':'white'

        return(
            <div onClick={()=>{clickCard(object)}} className="chat-card" style={{backgroundColor: bgColor}}>
                    <img className="avatar" src={placeholder} alt="avatar" />
                    <div style={{display:'flex', flexDirection:'column',  justifyContent:'center', padding:'0 15px', flex:1, maxWidth:'70%'}}>
                        <span style={{textAlign:'left', fontWeight:'500'}}>{object.username}</span>
                        <span style={{textAlign:'left',lineHeight:'1.2em', maxHeight:'2.4em', fontSize:'14px', textOverflow: 'ellipsis',wordWrap: 'break-word',overflow: 'hidden'}}>{object.message}</span>
                    </div>
                    <div >
                        <span style={{ border:'1px solid #BBB', borderRadius:50, padding:'2px 5px', fontSize:'12px', color:'#BBB'}}>{time}</span>
                    </div>
                </div>
        )
    }

    const sendMessage = async (event)=>{
        event.preventDefault();
        // scrollToBottom();

        if (typeMessage!=''){
            var message_object = {
                status: 'sent',
                user_id: selected.user_id,
                username: selected.username,
                message:typeMessage,
                createdAt : await firebase.firestore.FieldValue.serverTimestamp()
            }

            await db.collection('messages').add(message_object)    
            setType('')
        }
    }

    const messageBubble = (object)=>{
        try{
            // var time = timeFormat(object.createdAt)
        const date =  object.createdAt.toDate() ;
        var hours = date.getHours().toString().length == 1? '0'+date.getHours().toString() : date.getHours().toString()
        var minute = date.getMinutes().toString().length == 1? '0'+date.getMinutes().toString() : date.getMinutes().toString()
        var time =  hours+':'+minute
        } catch (e){
            const date =  new Date();
            var hours = date.getHours().toString().length == 1? '0'+date.getHours().toString() : date.getHours().toString()
            var minute = date.getMinutes().toString().length == 1? '0'+date.getMinutes().toString() : date.getMinutes().toString()
            var time =  hours+':'+minute
        }
        

        // var time = timeFormat(object.createdAt)
        var self = object.status == 'sent'
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
            <span style={{color:'grey', fontSize:'12px', marginLeft:'15px', marginRight:'10px', marginBottom:'5px'}}>{time}</span>
        </div>
        )
    }

    const RenderBubbles =()=>{
        var id = selected.user_id
        var obj = messages.filter(function (e) {
            return e.data.user_id == id;
        });
        var reverse = [...obj].reverse()

        return(
            <div className="chat-feed-main">
                {/* <div ref={messagesEndRef} /> */}
                {reverse.map(function(d, idx){
                return (
                    messageBubble(d.data)
                    )
            })}
            </div>
        )
    }

    const clickResolved = ()=>{
        console.log(selected.user_id)
        var messages_query = db.collection('messages').where('user_id','==',selected.user_id);
        messages_query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete().then(() => {
                setSelected('empty')
                closeModal()
                openSuccess('Issue has been successfully resolved')
              }).catch(function(error) {
                  openError('Oops! something is wrong')
                console.error("Error removing document: ", error);
              });
        });
        
});

    }

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);
    }


    return (
        <div className="message">
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="delete Modal"
                ariaHideApp={false}
            >
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <AiOutlineFileDone size={100} color='lightgreen'/>
                    <span style={{fontWeight:'bold', fontSize:'20px', margin:'25px'}}> User has satisfied with your support?</span>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', alignSelf:'flex-end'}}>
                        <div onClick={closeModal} style={{color:'grey', fontWeight:'500', margin:'0 25px', cursor: 'pointer'}}> Not yet </div>
                        <div onClick={clickResolved} className='main-button'>Resolve</div>
                    </div>
                    
                </div>

                
            </Modal>

            <div className="chat-list">
                <h2 style={{textAlign:'left', paddingLeft:25}}>Message</h2>
                <RenderCards/>
            </div>

            {selected!= 'empty'?
            <div className="chat-feed">
                <div className="chat-feed-header">
                    <span style={{fontWeight:'600', fontSize:'18px'}}> {selected.username} </span>
                    <button onClick={openModal} className="main-button" >Resolved</button>
                </div>

               <RenderBubbles/>

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