import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { AiOutlineStar } from 'react-icons/ai'


function Review () {

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
            <div style={{display:'flex'}}>
                {fillStar.map(function(d, idx){
                    return (<div>{d}</div>)
                })}
                 {emptyStar.map(function(d, idx){
                    return (<div>{d}</div>)
                })}
            </div>
        )
    }
    return (
        <div className="review">
            <h2 style={{textAlign:'left', paddingLeft:25}}>Reviews and Feedback</h2>

            <div className="review-box">
                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', width:'10vw'}}>
                    <div>
                        <span style={{fontWeight:'bold'}}>Date :</span> 
                    </div>
                    
                    <div style={{textAlign:'left'}}>
                    <span style={{fontWeight:'bold'}}>Bike ID :</span>
                    </div>
                    
                    <div style={{textAlign:'left'}}>
                    <span style={{fontWeight:'bold'}}>User ID :</span>
                    </div>
                    
                    <div style={{textAlign:'left'}}>
                    <span style={{fontWeight:'bold'}}>User Name :</span>
                    </div>
                    <div style={{textAlign:'left'}}>
                    <span style={{fontWeight:'bold'}}>Comment:</span>
                    </div>
                </div>
                
                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', width:'100%'}}>
                    <div>
                    11/04/2021
                    </div>
                    
                    <div>
                    A001
                    </div>
                    
                    <div>
                    95
                    </div>
                    
                    <div>
                    Ricky Pranaya
                    </div>

                    <div style={{textAlign:'left'}}>
                    After almost a month of using it, here’s my opinion. Customer support generally reply and resolve issues fast. Recommended to contact customer service through live chat. As for the app, it’s really straightforward to use.
                    </div>
                </div>
                {ratings(4)}
                
            </div>
        </div>

    )
}

export default Review;