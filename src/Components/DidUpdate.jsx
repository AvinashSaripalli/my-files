import React from "react";
import { useEffect,useState } from "react";

function DidMount(){
    const[count,setCount]=useState(0);
    const[mul,setMul]=useState(0);
     const update=(e)=>{
        setCount(count+1);
     }
     useEffect(()=>{
        setMul(count*3);
        console.log(mul);
     },[count])

    return(
        <div>
            <h1>clicked {count}times</h1>
            <button onClick={update}>click</button>
        </div>
    )


};
export default DidMount;