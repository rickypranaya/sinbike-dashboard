import React, {useEffect, useState} from 'react'
import { AiFillStar } from 'react-icons/ai'
import { AiOutlineStar } from 'react-icons/ai'
import axios from "axios"


function Review () {

    const[data, setData]= useState([])

    useEffect( () => {
        fetchData()
        
    },[]);
    async function fetchData() {
        try {
        const result = await axios.post("https://sinbike.herokuapp.com/api/reviews")
        const resultData = result.data.data;
        setData(resultData)

        } catch (error) {
        console.error(error);
        }
    }

    const dateFormat =(inputDate)=>{
        var date = new Date(inputDate)
        var day = date.getDate().toString().length == 1? '0'+date.getDate().toString() : date.getDate().toString()
        var month = (date.getMonth()+1).toString().length == 1? '0'+(date.getMonth()+1).toString() : (date.getMonth()+1).toString()
        var formatted = date.getFullYear() +'-'+month+'-'+ day
        return formatted
    }

    const ratings =(val)=>{
        var fill = val
        var fillStar = []
        for (var i=1 ; i<=fill;i++){
            fillStar.push(<AiFillStar color='#FF9901' size={20}/>)
        }

        var empty = 5 - val

        var emptyStar = []
        for (var i=1 ; i<=empty;i++){
            emptyStar.push(<AiOutlineStar color='#FF9901' size={20}/>)
        }

        return(
            <div style={{display:'flex',}}>
                {fillStar.map(function(d, idx){
                    return (<div>{d}</div>)
                })}
                 {emptyStar.map(function(d, idx){
                    return (<div>{d}</div>)
                })}
            </div>
        )
    }

    const renderCard = ()=>{
        var datas = data;

        return (
                <div>
                {datas.map(function(d, idx){
                return (
                    <div className="review-box">
                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', width:'10vw'}}>
                        <div>
                            <span style={{fontWeight:'600'}}>Date :</span> 
                        </div>
                        
                        <div style={{textAlign:'left'}}>
                        <span style={{fontWeight:'600'}}>Bike ID :</span>
                        </div>
                        
                        <div style={{textAlign:'left'}}>
                        <span style={{fontWeight:'600'}}>User ID :</span>
                        </div>
                        
                        <div style={{textAlign:'left'}}>
                        <span style={{fontWeight:'600'}}>User Name :</span>
                        </div>
                        
                    </div>
                    
                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                        <div>
                            {dateFormat(d.created_at)}
                        </div>
                        
                        <div>
                            {d.bike_id}
                        </div>
                        
                        <div>
                            {d.user_id}
                        </div>
                        
                        <div>
                            {d.full_name}
                        </div>

                        
                    </div>
                    <div style={{textAlign:'left', margin:'0px 20px'}}>
                        <span style={{fontWeight:'600'}}>Comment:</span>
                    </div>  
                    <div style={{textAlign:'left',flex:1, paddingRight:'20px'}}>
                        {d.comment}
                        </div>
                    {ratings(d.review)}
                    
                </div>

                )
            })}
            </div>
                
        )
    }

    return (
        <div className="review">
            <h2 style={{textAlign:'left', paddingLeft:25}}>Reviews and Feedback</h2>
            {renderCard()}
        </div>

    )
}

export default Review;