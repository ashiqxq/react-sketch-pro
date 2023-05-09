import './App.css';
import {useRef, useState, useEffect } from 'react';
const colorArray = ['green', 'lime', 'olive', 'yellow', 'teal', 'aqua', 'beige', 'azure', 'coral'];

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  useInterval(()=>{
    // console.log("fsd", Math.sqrt((responder.x-center.x)**2+(responder.y-center.y)**2), radius, responder.r)
    let nx = responder.x+attackVelocity.x;
    let ny = responder.y+attackVelocity.y;
    if ((nx+responder.r<0)||(nx+responder.r>window.innerWidth)){
      setResponderColor(colorArray[Math.ceil(Math.random()*colorArray.length)-1])
      nx = responder.x-attackVelocity.x;
      setAttackVelocity({
        x: -attackVelocity.x,
        y: attackVelocity.y 
      })
      setScore(score-difficulty);
    }
    else if ((ny+responder.r<0)||(ny+responder.r>window.innerHeight)){
      setResponderColor(colorArray[Math.ceil(Math.random()*colorArray.length)-1])
      ny = responder.y-attackVelocity.y;
      setAttackVelocity({
        x: attackVelocity.x,
        y: -attackVelocity.y 
      })
      setScore(score-difficulty)
    } else if(Math.sqrt((responder.x-center.x)**2+(responder.y-center.y)**2)<=(responder.r+radius)){
      console.log("48")
      nx = responder.x-attackVelocity.x;
      ny = responder.y-attackVelocity.y;
      setAttackVelocity({
        x: -attackVelocity.x,
        y: -attackVelocity.y 
      })
    }
    setResponderProp({
      x: nx,
      y: ny,
      r:30
    })
  }, 17);
  useInterval(()=>{
    setTime(time+1);
  }, 1000);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [difficulty, setDifficulty] = useState(10);
  const onPointerDown = (e) => {
    let distance = Math.sqrt((e.pageX-center.x)**2+(e.pageY-center.y)**2)
    let absdiff = Math.abs(distance-radius)
    if (absdiff/radius<=0.05){
      setRadiusExtenderMode(true);
      return
    }
    if (isRadiusExtenderMode){
      setRadiusExtenderMode(false);
      return
    }
    if (distance<=radius){
      setDragMode(!isDragMode);
    }else{
      setDragMode(false);
      setRadius(0);
      setDrawOnScreenMode(true);
      console.log("onpointer down", e, window)
      setCenter({
        x:e.pageX,
        y:e.pageY
      })
    }
  }
  const onPointerUp = (e) => {
    setDrawOnScreenMode(false);
    // setDragMode(false)
    console.log("onpointer up", e)

  }
  const onPointerMove = (e) => {
    if (drawOnScreenMode){
      // console.log("onpointer move", e)
      let nr = Math.sqrt((e.pageX-center.x)**2+(e.pageY-center.y)**2)/2
      setRadius(nr)
    }else if(isDragMode){
      let cx = e.pageX
      let cy = e.pageY
      let dist = Math.sqrt((responder.x-cx)**2+(responder.y-cy)**2)
      if (dist<(radius+responder.r)){
        setAttackVelocity({
          x:center.x-cx, y:center.y-cy
        })
        console.log("dsfds", Math.sqrt((center.x-cx)**2+(center.y-cy)**2))
        setScore(score+Math.round(Math.sqrt((center.x-cx)**2+(center.y-cy)**2)));
      }
      setCenter({
        x: cx,
        y: cy
      })


    }else if(isRadiusExtenderMode){
      let nr = Math.sqrt((e.pageX-center.x)**2+(e.pageY-center.y)**2)/2
      setRadius(nr)
    }
  }
  const [drawOnScreenMode, setDrawOnScreenMode] = useState(false);
  const [center, setCenter] = useState({
    x: "50%",
    y: "50%"
  })
  const [responder, setResponderProp] = useState({
    x: 200,
    y: 300,
    r: 30
  })
  const [radius, setRadius] = useState(2);
  const [isDragMode, setDragMode] = useState(false);
  const [attackVelocity, setAttackVelocity] = useState({
    x: 0,
    y: 0
  })
  const [isRadiusExtenderMode, setRadiusExtenderMode] = useState(false);
  const [responderColor, setResponderColor] = useState('olive');
  
  // console.log("responder vals", responder)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setTime(time + 1);
  //   console.log("interval running",responder, attackVelocity)
  //     setResponderProp({
  //       x: responder.x+attackVelocity.x,
  //       y: responder.y+attackVelocity.y,
  //       ...responder
  //     })
  //   }, 1000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [time, attackVelocity, responder]);
  return (
    <div style={{border:"1px black solid", height:"100vh", position:"relative", cursor: isRadiusExtenderMode?'e-resize':'default'}} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerMove={onPointerMove}>
      <div style={{backgroundColor:"rgba(255, 255, 255, 0.1)", position:"absolute", display:"flex", justifyContent:"space-between", margin:5, color:"#aeaeae", width:"95vw", boxShadow: '0px 0px 5px #e8e8e8', borderRadius: '5px'}}>
        <div>
          time: {time}
        </div>
        <div>
          your score: {score}
        </div>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <div style={{marginRight:10}}>
          difficulty:
          </div>
          <div>
            {/* <div style={{display:"flex", alignItems:"center", backgroundColor:"red", width:70}}> 
              <div style={{height:2, backgroundColor:"olive", width:1}}></div>
              <div style={{backgroundColor:"olive", height:10, width:10, borderRadius:10}} onPointerDown={(e)=>{
                e.stopPropagation();
                console.log("e is", e);
              }} onPointerMove={(e)=>{
                e.stopPropagation();
                console.log("moving e is", e);
              }} onPointerUp={(e)=>{
                e.stopPropagation();
                console.log("up is", e);
              }}></div>
            </div> */}
                  <input 
                type="range" 
                min="1" 
                max="50" 
                value={difficulty} 
                onChange={(e)=>{
                  e.stopPropagation();
                  setDifficulty(e.target.value);
                }} 
                className="slider" 
              />
          </div>
        </div>
      </div>
      <svg width="100%" height="100%" style={{backgroundColor:"white"}}>
        {/* <rect fill="red" stroke="blue" width="20%" x="10" y="10"/> */}
        <circle cx={center.x} cy={center.y} r={radius} stroke={isRadiusExtenderMode?'green':'red'} strokeWidth={isDragMode||isRadiusExtenderMode?2:0} fill="black" />
        <circle cx={responder.x} cy={responder.y} r={responder.r} fill={responderColor} strokeWidth={1} stroke={'black'}/>
  {/* <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /> */}
      </svg>

    </div>
  );
}

export default App;
