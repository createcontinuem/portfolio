import { useEffect, useRef, useState, useCallback } from "react";

const EMOTIONS = [
  { key:"joy",         label:"JOY",         color:"#FF44FF", img:"./emotions/joy.svg" },
  { key:"surprise",    label:"SURPRISE",    color:"#00FFFF", img:"./emotions/surprise.svg" },
  { key:"frustration", label:"FRUSTRATION", color:"#FF0040", img:"./emotions/frustration.svg" },
  { key:"awe",         label:"AWE",         color:"#FFE600", img:"./emotions/awe.svg" },
  { key:"fear",        label:"FEAR",        color:"#FF6600", img:"./emotions/fear.svg" },
  { key:"sadness",     label:"SADNESS",     color:"#0088FF", img:"./emotions/sadness.svg" },
  { key:"disgust",     label:"DISGUST",     color:"#00FF9F", img:"./emotions/disgust.svg" },
  { key:"neutral",     label:"NEUTRAL",     color:"#888888", img:"./emotions/neutral.svg" },
];
const NEM = EMOTIONS.length;

const SPEEDS = [0.5,1,2,4];
const SCALE_DIV = 1.08, MAX_PER = 36;

function makeEvents(rows){
  return rows.map(r=>({
    name:r[0], section:r[1], sentiment:r[2],
    joy:r[3], surprise:r[4], frustration:r[5], awe:r[6],
    fear:r[7], sadness:r[8], disgust:r[9],
    neutral:r[10]!==undefined ? r[10] : Math.max(0,100-r[3]-r[4]-r[5]-r[6]-r[7]-r[8]-r[9]),
  }));
}

const GAMES = [
  {
    id: "poppy-ch5",
    title: "POPPY PLAYTIME CH.5",
    streamers: 21,
    sections: [
      {name:"OPENING",      color:"#00FFFF", start:0,  end:3 },
      {name:"FACTORY",      color:"#FF6600", start:4,  end:12},
      {name:"HUGGY CHASE",  color:"#FF0040", start:13, end:19},
      {name:"MID PUZZLES",  color:"#FFE600", start:20, end:34},
      {name:"LILY DOLLHOUSE",color:"#FF44FF",start:35, end:51},
      {name:"PROTOTYPE",    color:"#FFFFFF", start:52, end:56},
    ],
    events: makeEvents([
      ["Opening Cinematic","Opening",0.1706,18.3,29.7,21.1,8.0,5.1,0.6,2.3,14.9],
      ["Globy & Giblet","Opening",0.1826,21.6,25.7,15.0,9.6,4.2,0.0,3.0,21.0],
      ["First Valve Puzzles","Opening",0.0949,14.9,19.6,34.5,3.6,8.3,0.0,2.4,16.7],
      ["Factory Entrance","Opening",0.1089,13.3,20.5,22.9,3.6,10.8,1.2,0.0,27.7],
      ["Early Factory","Factory Puzzles",0.1071,18.3,21.3,24.9,4.7,5.9,0.0,1.8,23.1],
      ["Creature Ambush","Factory Puzzles",-0.0437,11.1,11.1,30.9,4.9,8.6,6.2,3.7,23.5],
      ["Dark Corridor","Factory Puzzles",0.0913,12.0,19.2,27.5,4.2,10.8,2.4,4.8,19.2],
      ["Factory Lore Notes","Factory Puzzles",0.0718,13.1,20.2,20.2,2.4,10.7,0.0,9.5,23.8],
      ["Lily Portrait","Factory Puzzles",0.0576,12.8,14.0,24.4,7.0,16.3,0.0,2.3,23.3],
      ["Mid Factory Puzzle","Factory Puzzles",0.0531,16.9,18.5,24.2,4.8,10.5,0.4,1.6,23.0],
      ["Goo Creature","Factory Puzzles",-0.001,22.1,15.1,32.6,2.3,5.8,2.3,1.2,18.6],
      ["Factory Corridor","Factory Puzzles",0.0687,17.2,14.8,26.0,5.2,6.4,0.8,2.8,26.8],
      ["Factory Exit","Factory Puzzles",0.0826,17.7,15.3,23.1,5.7,8.4,0.0,3.0,26.9],
      ["Huggy Chase Begins","Huggy Chase",0.0851,24.5,18.4,28.2,1.8,6.1,0.0,1.8,19.0],
      ["Chase Puzzles","Huggy Chase",0.0877,20.7,13.8,21.8,2.3,3.4,2.3,2.3,33.3],
      ["Active Pursuit","Huggy Chase",-0.0127,16.4,7.3,31.5,2.4,7.9,1.2,4.2,29.1],
      ["Chase Escape","Huggy Chase",0.1006,18.9,18.3,24.3,2.4,5.3,0.0,2.4,28.4],
      ["Engineering Wing","Huggy Chase",0.0684,19.0,17.2,26.4,1.2,5.5,0.0,3.1,27.6],
      ["Grab Pack Combat","Huggy Chase",0.0834,24.6,15.0,20.4,3.6,7.2,0.0,1.2,28.1],
      ["Wing Exit","Huggy Chase",-0.0031,16.8,10.2,28.7,1.8,7.2,0.0,3.0,32.3],
      ["Mid Section Entry","Mid Puzzles",0.0567,19.6,10.4,23.6,3.2,7.6,0.4,1.6,33.6],
      ["Frustration Spike","Mid Puzzles",0.0956,20.2,20.2,27.4,1.2,9.5,1.2,1.2,19.0],
      ["Sweet Street","Mid Puzzles",0.1203,26.6,13.9,21.5,5.1,6.3,2.5,2.5,21.5],
      ["Mid Corridor","Mid Puzzles",0.0991,20.4,15.6,22.2,3.0,5.4,1.8,3.0,28.7],
      ["Extended Puzzle","Mid Puzzles",0.0731,28.2,8.2,37.6,1.2,7.1,0.0,2.4,15.3],
      ["Poppy Gel Puzzle","Mid Puzzles",0.1499,24.2,13.7,24.2,3.7,5.6,1.2,1.2,26.1],
      ["Puzzle Failure","Mid Puzzles",-0.0028,14.3,11.9,34.5,2.4,6.0,1.2,1.2,28.6],
      ["Mid Recovery","Mid Puzzles",0.0967,19.6,16.0,24.0,1.8,5.6,1.2,2.4,29.4],
      ["Hidden Mechanism","Mid Puzzles",0.1758,19.8,27.2,17.3,2.5,6.2,2.5,0.0,24.7],
      ["Glitch Panel","Mid Puzzles",0.0821,18.4,18.4,23.2,2.4,5.6,1.2,2.8,28.0],
      ["Prototype Backstory","Mid Puzzles",0.1631,17.7,23.2,16.5,4.9,5.5,2.4,1.2,28.7],
      ["Memory Lore","Mid Puzzles",0.0707,17.6,24.7,23.5,7.1,0.0,2.4,2.4,22.4],
      ["Escape Victory","Mid Puzzles",0.131,23.8,18.8,18.8,3.8,6.2,5.0,2.5,21.2],
      ["Late Mid Nav","Mid Puzzles",0.0995,21.6,16.1,23.3,4.6,4.8,1.2,1.0,27.6],
      ["Diorama Solved","Mid Puzzles",0.1284,29.3,9.8,20.7,7.3,8.5,3.7,0.0,20.7],
      ["Dollhouse Entrance","Lily Dollhouse",0.113,24.7,14.1,25.9,5.9,3.5,2.4,1.2,22.4],
      ["Doll Party Setup","Lily Dollhouse",0.1634,25.3,14.5,22.3,1.8,4.2,1.2,1.8,28.9],
      ["Friends Retrieval","Lily Dollhouse",0.0855,24.6,15.6,21.6,9.0,6.0,1.2,0.6,21.6],
      ["Dollhouse Interior","Lily Dollhouse",0.0915,16.0,18.5,18.5,3.7,4.9,2.5,1.2,34.6],
      ["Toy Friends","Lily Dollhouse",0.1355,23.5,15.3,23.5,5.9,4.7,0.0,3.5,23.5],
      ["Toy Room","Lily Dollhouse",0.0802,10.8,22.9,24.1,8.4,1.2,0.0,3.6,28.9],
      ["Lily Frustration","Lily Dollhouse",0.0583,16.8,16.2,32.9,7.8,2.4,0.6,1.2,22.2],
      ["Dollhouse Nav","Lily Dollhouse",0.1106,17.3,21.0,25.9,7.4,4.9,0.0,0.0,23.5],
      ["Prototype Arrives","Lily Dollhouse",0.0743,17.6,25.9,24.7,3.5,10.6,1.2,0.0,16.5],
      ["Prototype Tension","Lily Dollhouse",0.0457,17.1,17.1,23.2,1.2,11.0,0.0,0.0,30.5],
      ["Lily Doll Chase","Lily Dollhouse",0.0096,7.0,33.7,19.8,2.3,9.3,2.3,2.3,23.3],
      ["Prototype Revealed","Lily Dollhouse",-0.0467,9.8,30.5,20.7,3.7,7.3,2.4,0.0,25.6],
      ["Kissy Subdued","Lily Dollhouse",-0.0447,2.4,20.7,24.4,6.1,7.3,1.2,2.4,35.4],
      ["Chase Escape 2","Lily Dollhouse",-0.0304,12.0,14.4,28.1,1.2,7.2,2.4,1.2,33.5],
      ["Post-Chase","Lily Dollhouse",0.1173,21.8,12.7,18.5,3.9,6.1,2.4,1.5,33.0],
      ["HK Reunion","Lily Dollhouse",0.1035,21.2,26.1,15.2,3.0,6.1,0.0,1.8,26.7],
      ["HK vs Prototype","Lily Dollhouse",0.1192,15.3,31.3,16.9,3.6,5.6,0.4,1.2,25.7],
      ["Prototype Kills HK","Prototype",0.1362,15.5,38.1,16.7,2.4,10.7,2.4,2.4,11.9],
      ["Player Captured","Prototype",0.0785,11.2,20.5,21.7,3.1,8.1,4.3,1.9,29.2],
      ["Transformation","Prototype",0.0425,12.9,16.5,25.9,3.5,5.9,4.7,4.7,25.9],
      ["Post-Transform","Prototype",0.1718,21.2,15.0,25.0,1.2,6.2,2.5,1.2,27.5],
      ["Credits Roll","Prototype",0.2682,22.9,19.3,21.7,6.0,1.2,2.4,1.2,25.3],
    ]),
  },
  {
    id: "she-was-98",
    title: "SHE WAS 98",
    streamers: 24,
    sections: [
      {name:"ARRIVAL",       color:"#00FFFF", start:0,  end:4 },
      {name:"CARETAKING",    color:"#FFE600", start:5,  end:12},
      {name:"THE BASEMENT",  color:"#FF0040", start:13, end:19},
      {name:"UNRAVELING",    color:"#DD00FF", start:20, end:26},
      {name:"REVELATION",    color:"#FF6600", start:27, end:33},
      {name:"RECKONING",     color:"#FFFFFF", start:34, end:38},
    ],
    events: makeEvents([
      ["Game Intro — Grandma Glimpsed Through Window","Arrival",0.04,13.8,16.9,21.5,4.6,15.4,0.0,6.2,21.5],
      ["Arriving at Grandmother's House — Backstory Read","Arrival",-0.1002,9.6,9.6,33.7,6.0,19.3,0.0,4.8,16.9],
      ["Exploring the Neglected House — Chores Begin","Arrival",-0.0189,13.8,8.7,40.6,6.5,7.2,0.7,5.8,16.7],
      ["Strange Boarded Door & Old Radio Jingle","Arrival",0.0824,16.4,3.6,23.6,10.9,7.3,0.0,7.3,30.9],
      ["Childhood Toy Found — Locked Rooms","Arrival",0.03,17.1,14.6,23.2,6.1,4.9,0.0,2.4,31.7],
      ["First Face-to-Face — Grandma's Accusation","Caretaking",0.322,24.1,13.8,3.4,10.3,10.3,0.0,0.0,37.9],
      ["Giving Grandma Her Pills — She Knows Something","Caretaking",0.2678,21.7,10.8,12.0,1.2,25.3,1.2,8.4,19.3],
      ["Mouse Infestation Task Begins","Caretaking",-0.0462,9.4,5.7,35.8,3.8,3.8,3.8,5.7,32.1],
      ["Setting Traps — Something Wrong With the Rats","Caretaking",-0.0147,11.9,15.5,33.3,3.6,9.5,2.4,1.2,22.6],
      ["Half a Rat — Something Worse Than Mice","Caretaking",0.0154,5.1,15.2,24.1,0.0,3.8,7.6,2.5,41.8],
      ["Night Falls — Sounds in the House","Caretaking",0.0896,12.9,18.8,17.6,8.2,11.8,0.0,2.4,28.2],
      ["TV On at Night — Go to Bed","Caretaking",0.1101,18.2,23.6,29.1,1.8,3.6,0.0,3.6,20.0],
      ["Waking in the Wrong Room — Second Night Dread","Caretaking",0.0611,19.8,18.5,30.9,1.2,6.2,0.0,2.5,21.0],
      ["Day 2 — Grandma Asks for the Old TV","The Basement",0.1591,26.2,19.0,9.5,11.9,3.6,0.0,0.0,29.8],
      ["Basement Door Discovered","The Basement",0.0742,14.8,19.8,25.9,3.7,3.7,0.0,2.5,29.6],
      ["Descending Into the Flooded Basement","The Basement",0.0416,14.3,23.8,19.0,2.4,10.7,0.0,3.6,26.2],
      ["Basement Horror — Spider Jumpscare & Darkness","The Basement",-0.0904,3.6,16.9,34.9,1.2,16.9,0.0,0.0,26.5],
      ["Basement Jumpscare Peak — Grandma Appears Below","The Basement",-0.0026,3.8,18.9,37.7,3.8,9.4,0.0,1.9,24.5],
      ["Returning With the TV — Blood Stains Appear","The Basement",-0.0791,8.3,16.7,31.0,2.4,7.1,0.0,1.2,33.3],
      ["TV Delivered — Grandma's Behaviour Shifts","The Basement",-0.006,13.9,19.0,30.4,3.8,6.3,0.0,0.0,26.6],
      ["House Getting Stranger — Lights Flickering","Unraveling",0.0524,15.0,16.2,20.0,5.0,3.8,0.0,2.5,37.5],
      ["Fear Written on the Wall — Key Under the Window","Unraveling",0.0954,16.5,21.2,21.2,4.7,7.1,0.0,0.0,29.4],
      ["Total Darkness — Cannot Find the Way","Unraveling",-0.0672,9.9,24.7,27.2,2.5,6.2,0.0,0.0,29.6],
      ["Grandma Disappears from Her Room","Unraveling",0.0282,8.9,19.6,26.8,1.8,7.1,0.0,1.8,33.9],
      ["Grandma Returns — Something Is Wrong","Unraveling",-0.0789,4.0,10.0,30.0,6.0,6.0,0.0,4.0,40.0],
      ["Poison Reveal — Tasteless Odourless Leaves","Unraveling",0.0022,9.3,16.3,26.7,10.5,4.7,0.0,2.3,30.2],
      ["The Truth Sinks In — Grandma Is Dying","Unraveling",0.0073,4.7,24.5,24.5,1.9,3.8,0.0,6.6,34.0],
      ["Calling the Ambulance","Revelation",0.0211,3.7,15.6,18.3,5.5,10.1,0.9,3.7,42.2],
      ["Two Months Later — Moving Out Begins","Revelation",0.105,13.8,25.9,3.4,3.4,12.1,3.4,10.3,27.6],
      ["Renovations — Delivery Arrives","Revelation",-0.047,9.6,15.4,25.0,5.8,13.5,3.8,7.7,19.2],
      ["Opening the Boarded Door — Childhood Memories","Revelation",-0.0398,8.3,13.3,28.3,6.7,6.7,8.3,6.7,21.7],
      ["House Darkness Returns — Basement Again","Revelation",0.0352,15.2,12.7,35.4,2.5,5.1,3.8,7.6,17.7],
      ["Final Jump Scare Before Leaving","Revelation",0.0328,15.5,26.2,21.4,7.1,2.4,0.0,0.0,27.4],
      ["Preparing to Leave — Almost Out","Revelation",0.0304,11.8,15.7,21.6,2.0,3.9,0.0,0.0,45.1],
      ["Last Look at the House","Reckoning",0.1958,25.0,14.3,10.7,0.0,3.6,0.0,0.0,46.4],
      ["Grandma Confronts Player — Betrayal Revealed","Reckoning",-0.0074,23.2,21.4,33.9,3.6,3.6,0.0,1.8,12.5],
      ["Chase Sequence — Escape the House","Reckoning",0.1137,11.5,26.9,46.2,0.0,3.8,0.0,0.0,11.5],
      ["Escape & Aftermath — Creators React","Reckoning",0.0478,11.1,14.8,33.3,9.3,3.7,0.0,3.7,24.1],
      ["Ending & Game Review","Reckoning",0.2458,20.8,8.3,25.0,8.3,0.0,0.0,0.0,37.5],
    ]),
  },
];

function hexRgb(h){const m=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);return m?[parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)]:[255,255,255];}

function newBubble(ei, globeR, isPrimary){
  const theta=Math.random()*Math.PI*2;
  const phi=Math.acos(2*Math.random()-1);
  let r;
  if(isPrimary){
    r = globeR*(0.72 + Math.random()*0.12);
  } else {
    r = globeR*(Math.random()*0.40);
  }
  return {
    ei,
    x:r*Math.sin(phi)*Math.cos(theta), y:r*Math.sin(phi)*Math.sin(theta), z:r*Math.cos(phi),
    vx:(Math.random()-.5)*0.015, vy:(Math.random()-.5)*0.015, vz:(Math.random()-.5)*0.015,
    scale:0, target:1, ph:Math.random()*Math.PI*2,
    isPrimary,
  };
}

export default function App(){
  const canvasRef   = useRef(null);
  const animRef     = useRef(null), t0Ref=useRef(null);
  const playRef     = useRef(false), posRef=useRef(0);
  const speedRef    = useRef(1), speedIdxRef=useRef(1), lastTsRef=useRef(null);
  const bubblesRef  = useRef([]);
  const svgImgs     = useRef({});
  const rotXRef     = useRef(0.3);
  const rotYRef     = useRef(0);
  const zoomRef     = useRef(1.0);
  const isDragging  = useRef(false);
  const lastMouse   = useRef({x:0,y:0});
  const gameIdxRef  = useRef(0);
  const [playing,setPlaying]   = useState(false);
  const [pos,setPos]           = useState(0);
  const [speedIdx,setSpeedIdx] = useState(1);
  const [gameIdx,setGameIdx]   = useState(0);

  const switchGame = useCallback((idx) => {
    gameIdxRef.current = idx;
    setGameIdx(idx);
    playRef.current = false;
    posRef.current = 0;
    setPlaying(false);
    setPos(0);
    bubblesRef.current = [];
  }, []);

  useEffect(()=>{
    const canvas=canvasRef.current, ctx=canvas.getContext("2d");
    function resize(){
      const dpr=Math.min(window.devicePixelRatio||1,1.5);
      canvas.width=canvas.offsetWidth*dpr;
      canvas.height=canvas.offsetHeight*dpr;
      ctx.scale(dpr,dpr);
    }
    resize();
    const ro=new ResizeObserver(resize); ro.observe(canvas);

    const imgMap={};
    EMOTIONS.forEach(em=>{
      if(em.img){const img=new Image();img.src=em.img;imgMap[em.key]=img;}
    });
    svgImgs.current=imgMap;

    function loop(ts){
      const game = GAMES[gameIdxRef.current];
      const GAME_EVENTS = game.events;
      const GAME_SECTIONS = game.sections;
      const NE = GAME_EVENTS.length;

      if(!t0Ref.current) t0Ref.current=ts;
      if(playRef.current){
        if(lastTsRef.current!==null){
          const dt=(ts-lastTsRef.current)/1000;
          posRef.current=Math.min(NE-1,posRef.current+dt*speedRef.current);
          setPos(posRef.current);
          if(posRef.current>=NE-1){playRef.current=false;setPlaying(false);}
        }
        lastTsRef.current=ts;
      } else lastTsRef.current=null;

      const t=(ts-t0Ref.current)/1000, cur=posRef.current;
      const W=canvas.offsetWidth, H=canvas.offsetHeight;

      const i0=Math.floor(cur),i1=Math.min(NE-1,i0+1),fr=cur-i0;
      const e0=GAME_EVENTS[i0],e1=GAME_EVENTS[i1];
      const vals=EMOTIONS.map(em=>(e0[em.key]||0)*(1-fr)+(e1[em.key]||0)*fr);
      const targets=vals.map(v=>Math.max(0,Math.min(MAX_PER,Math.round(v/SCALE_DIV))));

      const globeR=Math.min(W*0.30,H*0.34);
      const gCX=W/2, gCY=H*0.40;

      const bubbles=bubblesRef.current;
      const active=Array(NEM).fill(0);
      bubbles.forEach(b=>{if(b.target>0)active[b.ei]++;});

      const sortedByVal=[...vals.entries()].sort((a,b)=>b[1]-a[1]);
      const primarySet=new Set(sortedByVal.slice(0,Math.ceil(NEM/2)).map(([i])=>i));

      for(let ei=0;ei<NEM;ei++){
        while(active[ei]<targets[ei]){bubbles.push(newBubble(ei,globeR,primarySet.has(ei)));active[ei]++;}
      }
      for(let ei=0;ei<NEM;ei++){
        let excess=active[ei]-targets[ei];
        for(let k=bubbles.length-1;k>=0&&excess>0;k--){
          if(bubbles[k].ei===ei&&bubbles[k].target>0){bubbles[k].target=0;excess--;}
        }
      }

      const CONT=globeR*0.86, ORB=globeR*0.110;

      for(let i=bubbles.length-1;i>=0;i--){
        const b=bubbles[i];
        b.scale=Math.max(0,Math.min(1,b.scale+(b.target>0?0.07:-0.08)));
        if(b.scale<=0&&b.target<=0){bubbles.splice(i,1);continue;}

        const norm=vals[b.ei]/40;
        b.vx+=0.008*Math.sin(t*1.3+b.ph)*0.02;
        b.vy+=0.008*Math.cos(t*0.9+b.ph+1)*0.02;
        b.vz+=0.008*Math.sin(t*0.7+b.ph+2.1)*0.02;
        b.vy-=norm*0.0006;
        if(Math.random()<0.02){b.vx+=(Math.random()-.5)*0.006;b.vy+=(Math.random()-.5)*0.006;b.vz+=(Math.random()-.5)*0.006;}

        const dist0=Math.sqrt(b.x*b.x+b.y*b.y+b.z*b.z);
        if(dist0>0.5 && !b.isPrimary){
          const nx0=b.x/dist0, ny0=b.y/dist0, nz0=b.z/dist0;
          const pull=(dist0-CONT*0.48)*0.0022;
          b.vx+=nx0*pull; b.vy+=ny0*pull; b.vz+=nz0*pull;
        }
        if(dist0>0.5 && b.isPrimary){
          const nx0=b.x/dist0, ny0=b.y/dist0, nz0=b.z/dist0;
          const push=(CONT*0.88-dist0)*0.0020;
          b.vx+=nx0*push; b.vy+=ny0*push; b.vz+=nz0*push;
        }

        b.vx*=0.982;b.vy*=0.982;b.vz*=0.982;
        b.x+=b.vx;b.y+=b.vy;b.z+=b.vz;

        const dist=Math.sqrt(b.x*b.x+b.y*b.y+b.z*b.z);
        const ZONE_WALL=CONT*0.72;
        if(!b.isPrimary && dist>ZONE_WALL-ORB*b.scale && dist>0.1){
          const nx=b.x/dist, ny=b.y/dist, nz=b.z/dist;
          const w=ZONE_WALL-ORB*b.scale-0.5;
          b.x=nx*w; b.y=ny*w; b.z=nz*w;
          const dot=b.vx*nx+b.vy*ny+b.vz*nz;
          if(dot>0){b.vx-=nx*dot*1.4; b.vy-=ny*dot*1.4; b.vz-=nz*dot*1.4;}
        }
        if(b.isPrimary && dist<ZONE_WALL && dist>0.1){
          const nx=b.x/dist, ny=b.y/dist, nz=b.z/dist;
          b.x=nx*ZONE_WALL; b.y=ny*ZONE_WALL; b.z=nz*ZONE_WALL;
          const dot=b.vx*nx+b.vy*ny+b.vz*nz;
          if(dot<0){b.vx-=nx*dot*3.5; b.vy-=ny*dot*3.5; b.vz-=nz*dot*3.5;}
        }

        const maxD=CONT-ORB*b.scale;
        if(dist>maxD&&dist>0.01){
          const nx=b.x/dist, ny=b.y/dist, nz=b.z/dist;
          b.x=nx*maxD; b.y=ny*maxD; b.z=nz*maxD;
          const dot=b.vx*nx+b.vy*ny+b.vz*nz;
          b.vx=(b.vx-2*dot*nx)*0.65; b.vy=(b.vy-2*dot*ny)*0.65; b.vz=(b.vz-2*dot*nz)*0.65;
        }

        for(let j=i-1;j>=0;j--){
          const b2=bubbles[j];
          const dx=b.x-b2.x, dy=b.y-b2.y, dz=b.z-b2.z;
          const dd=Math.sqrt(dx*dx+dy*dy+dz*dz);
          const minD=ORB*(b.scale+b2.scale)+4;
          if(dd<minD&&dd>0.5){
            const nx=dx/dd, ny=dy/dd, nz=dz/dd;
            const push=(minD-dd)*0.28;
            b.x+=nx*push*0.5; b.y+=ny*push*0.5; b.z+=nz*push*0.5;
            b2.x-=nx*push*0.5; b2.y-=ny*push*0.5; b2.z-=nz*push*0.5;
            const dot=(b.vx-b2.vx)*nx+(b.vy-b2.vy)*ny+(b.vz-b2.vz)*nz;
            if(dot<0){
              const imp=dot*0.45;
              b.vx-=imp*nx; b.vy-=imp*ny; b.vz-=imp*nz;
              b2.vx+=imp*nx; b2.vy+=imp*ny; b2.vz+=imp*nz;
            }
            b.vx+=nx*0.008; b.vy+=ny*0.008; b.vz+=nz*0.008;
            b2.vx-=nx*0.008; b2.vy-=ny*0.008; b2.vz-=nz*0.008;
          }
        }
      }

      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#030307";ctx.fillRect(0,0,W,H);

      const bgr=ctx.createRadialGradient(W/2,H*0.4,0,W/2,H*0.4,Math.max(W,H)*0.55);
      bgr.addColorStop(0,"rgba(25,5,45,0.7)");bgr.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=bgr;ctx.fillRect(0,0,W,H);

      const ei=Math.min(NE-1,Math.round(cur));
      const secNow=GAME_SECTIONS.find(s=>ei>=s.start&&ei<=s.end);
      const accent=secNow?secNow.color:"#ffffff";
      const [ar,ag,ab]=hexRgb(accent);

      const cosRY=Math.cos(rotYRef.current), sinRY=Math.sin(rotYRef.current);
      const cosRX=Math.cos(rotXRef.current), sinRX=Math.sin(rotXRef.current);
      const FOV=CONT*2.8, zm=zoomRef.current;
      for(const b of bubbles){
        if(b.scale<0.01) continue;
        const x1=b.x*cosRY+b.z*sinRY;
        const z1=-b.x*sinRY+b.z*cosRY;
        const vy=b.y*cosRX-z1*sinRX;
        const vz=b.y*sinRX+z1*cosRX;
        const ps=(FOV/(FOV-vz))*zm;
        b._px=gCX+x1*ps; b._py=gCY+vy*ps; b._ps=ps; b._vz=vz;
      }
      const sorted=[...bubbles].filter(b=>b.scale>=0.01).sort((a,b)=>{
        const aN=EMOTIONS[a.ei].key==="neutral", bN=EMOTIONS[b.ei].key==="neutral";
        if(aN!==bN) return aN?-1:1;
        return a._vz-b._vz;
      });

      for(const b of sorted){
        if(b.scale<0.01)continue;
        const em=EMOTIONS[b.ei];
        const [rr,gg,bb2]=hexRgb(em.color);
        const rawVal=vals[b.ei];
        const norm=Math.min(rawVal/40,1);
        const isLow=rawVal<=2, isSecondary=!b.isPrimary;
        const depthFade=0.35+0.65*((b._vz+CONT)/(CONT*2));
        const dimFactor=(isLow?0.38:1.0)*depthFade;
        const brightBoost=isSecondary&&!isLow?1.55:1.0;
        const isNeutral=em.key==="neutral";
        const sizeFactor=isLow?0.60:isNeutral?0.50:(b.isPrimary?0.70:1.0);
        const r=ORB*b.scale*sizeFactor*b._ps;
        const blinkF=1.2+norm*3.5;
        const blink=Math.sin(t*blinkF+b.ph)*0.5+0.5;
        const px=b._px, py=b._py;

        const neonA=Math.min((0.65+blink*0.35)*b.scale*dimFactor*brightBoost,1.0);
        for(let g=3;g>=0;g--){
          const gR=r*(1.02+g*0.18);
          const gA=neonA*(0.22-g*0.04);
          ctx.beginPath();ctx.arc(px,py,gR,0,Math.PI*2);
          ctx.fillStyle=`rgba(${rr},${gg},${bb2},${Math.max(0,gA)})`;ctx.fill();
        }
        ctx.beginPath();ctx.arc(px,py,r*1.02,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${rr},${gg},${bb2},${neonA})`;
        ctx.lineWidth=r*0.07;ctx.stroke();

        const pulseA=blink*norm*0.70*b.scale*dimFactor*brightBoost;
        ctx.beginPath();ctx.arc(px,py,r*0.775,0,Math.PI*2);
        ctx.fillStyle=`rgba(${rr},${gg},${bb2},${Math.min(pulseA,0.68)})`;ctx.fill();

        const svgImg=svgImgs.current[em.key];
        if(svgImg&&svgImg.complete&&svgImg.naturalWidth>0){
          ctx.save();
          ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.clip();
          ctx.globalAlpha=b.scale;
          ctx.drawImage(svgImg,px-r,py-r,r*2,r*2);
          ctx.restore();
        }else{
          const bodyG=ctx.createRadialGradient(px-r*0.22,py-r*0.25,0,px,py,r);
          bodyG.addColorStop(0,`rgba(${rr},${gg},${bb2},${0.22*b.scale*dimFactor*brightBoost})`);
          bodyG.addColorStop(0.5,`rgba(${Math.round(rr*.08)},${Math.round(gg*.08)},${Math.round(bb2*.08)},${0.70*b.scale})`);
          bodyG.addColorStop(1,`rgba(0,0,0,${0.88*b.scale})`);
          ctx.shadowColor=em.color;ctx.shadowBlur=(norm*18+blink*norm*12)*b.scale*dimFactor*brightBoost;
          ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fillStyle=bodyG;ctx.fill();
          ctx.shadowBlur=0;
        }

        const specG=ctx.createRadialGradient(px-r*0.32,py-r*0.38,0,px-r*0.24,py-r*0.28,r*0.32);
        specG.addColorStop(0,`rgba(255,255,255,${0.65*b.scale*Math.min(dimFactor*brightBoost,1)})`);
        specG.addColorStop(1,"rgba(0,0,0,0)");
        ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fillStyle=specG;ctx.fill();
      }

      ctx.textAlign="left";
      ctx.font="900 21px monospace";ctx.fillStyle="rgba(220,220,255,0.85)";ctx.fillText("SENTIMENT ENGINE",20,28);
      const labelY=H/2-NEM*21;
      ctx.textAlign="right";
      ctx.font="600 16px monospace";ctx.fillStyle=`rgba(${ar},${ag},${ab},0.80)`;
      ctx.fillText(game.title,W-20,labelY-24);
      if(secNow){
        const p2=Math.sin(t*2.5)*0.5+0.5;
        ctx.shadowColor=accent;ctx.shadowBlur=10;
        ctx.font="800 16px monospace";ctx.textAlign="right";
        ctx.fillStyle=`rgba(${ar},${ag},${ab},${0.70+p2*0.3})`;
        ctx.fillText(`◈ ${secNow.name}`,W-20,labelY);ctx.shadowBlur=0;
      }
      ctx.font="600 14px monospace";ctx.fillStyle="rgba(255,255,255,0.80)";ctx.textAlign="right";
      ctx.fillText(`EVENT ${ei+1}/${NE}`,W-20,labelY+34);
      ctx.fillText(`SENTIMENT ${GAME_EVENTS[ei].sentiment>=0?"+":""}${GAME_EVENTS[ei].sentiment.toFixed(3)}`,W-20,labelY+58);

      // Event name centered below the globe
      ctx.textAlign="center";
      ctx.font="700 22px monospace";ctx.fillStyle="rgba(255,255,255,0.95)";
      ctx.fillText(GAME_EVENTS[ei].name,gCX,gCY+globeR*1.15);

      const legendX=20,legendY=H/2-NEM*21;
      ctx.font="600 11px monospace";ctx.textAlign="left";
      ctx.fillStyle="rgba(220,220,255,0.38)";
      ctx.fillText(`Reactions out of ${game.streamers} Streamers`,legendX,legendY-10);
      EMOTIONS.forEach((em,i)=>{
        const [rr,gg,bb2]=hexRgb(em.color);
        const n=bubbles.filter(b=>b.ei===i&&b.target>0).length;
        const svgImg=svgImgs.current[em.key];
        const iconSize=26, iy=legendY+i*42;
        if(svgImg&&svgImg.complete&&svgImg.naturalWidth>0){
          ctx.save();ctx.globalAlpha=0.92;
          ctx.drawImage(svgImg,legendX,iy,iconSize,iconSize);
          ctx.restore();
        }else{
          ctx.beginPath();ctx.arc(legendX+iconSize/2,iy+iconSize/2,iconSize/2,0,Math.PI*2);
          ctx.fillStyle=em.color;ctx.fill();
        }
        ctx.font="700 15px monospace";ctx.textAlign="left";
        ctx.fillStyle=`rgba(${rr},${gg},${bb2},0.95)`;
        ctx.fillText(`${em.label} ×${n}`,legendX+iconSize+8,iy+iconSize*0.68);
      });

      for(let sy=0;sy<H;sy+=4){ctx.fillStyle="rgba(0,0,0,0.03)";ctx.fillRect(0,sy,W,1);}
      animRef.current=requestAnimationFrame(loop);
    }

    const onMouseDown=e=>{isDragging.current=true;lastMouse.current={x:e.clientX,y:e.clientY};};
    const onMouseMove=e=>{
      if(!isDragging.current)return;
      rotYRef.current+=(e.clientX-lastMouse.current.x)*0.006;
      rotXRef.current+=(e.clientY-lastMouse.current.y)*0.006;
      lastMouse.current={x:e.clientX,y:e.clientY};
    };
    const onMouseUp=()=>{isDragging.current=false;};
    const onWheel=e=>{e.preventDefault();zoomRef.current=Math.max(0.3,Math.min(4,zoomRef.current-e.deltaY*0.001));};
    canvas.addEventListener('mousedown',onMouseDown);
    canvas.addEventListener('mousemove',onMouseMove);
    canvas.addEventListener('mouseup',onMouseUp);
    canvas.addEventListener('mouseleave',onMouseUp);
    canvas.addEventListener('wheel',onWheel,{passive:false});

    animRef.current=requestAnimationFrame(loop);
    return()=>{
      cancelAnimationFrame(animRef.current);ro.disconnect();
      canvas.removeEventListener('mousedown',onMouseDown);
      canvas.removeEventListener('mousemove',onMouseMove);
      canvas.removeEventListener('mouseup',onMouseUp);
      canvas.removeEventListener('mouseleave',onMouseUp);
      canvas.removeEventListener('wheel',onWheel);
    };
  },[]);

  const NE = GAMES[gameIdx].events.length;
  const GAME_SECTIONS = GAMES[gameIdx].sections;

  const togglePlay=()=>{
    const ne=GAMES[gameIdxRef.current].events.length;
    if(posRef.current>=ne-1){posRef.current=0;setPos(0);}
    playRef.current=!playRef.current;setPlaying(p=>!p);
  };
  const reset=()=>{playRef.current=false;posRef.current=0;setPlaying(false);setPos(0);bubblesRef.current=[];};
  const cycleSpeed=()=>{const n=(speedIdxRef.current+1)%SPEEDS.length;speedIdxRef.current=n;speedRef.current=SPEEDS[n];setSpeedIdx(n);};
  const onScrub=useCallback(e=>{
    const ne=GAMES[gameIdxRef.current].events.length;
    const rect=e.currentTarget.getBoundingClientRect();
    posRef.current=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))*(ne-1);
    setPos(posRef.current);bubblesRef.current=[];
  },[]);

  const tabStyle = (active) => ({
    height:24, padding:"0 12px",
    background: active ? "rgba(220,220,255,0.12)" : "rgba(255,255,255,0.03)",
    border: active ? "1px solid rgba(220,220,255,0.35)" : "1px solid rgba(255,255,255,0.08)",
    color: active ? "rgba(220,220,255,0.95)" : "rgba(180,180,220,0.40)",
    fontFamily:"monospace", fontSize:9, letterSpacing:2, cursor:"pointer",
  });

  return(
    <div style={{width:"100%",height:"100vh",background:"#030307",position:"relative",overflow:"hidden"}}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:20,
        background:"rgba(3,2,8,0.97)",borderTop:"1px solid rgba(255,255,255,0.07)",
        display:"flex",flexDirection:"column",padding:"8px 20px 10px", gap:6}}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {GAMES.map((g,i)=>(
            <button key={g.id} onClick={()=>switchGame(i)} style={tabStyle(gameIdx===i)}>
              {g.title}
            </button>
          ))}
        </div>
        <div onClick={onScrub} style={{width:"100%",height:14,cursor:"pointer",display:"flex",alignItems:"center"}}>
          <div style={{position:"relative",width:"100%",height:2}}>
            <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,0.06)"}}/>
            {GAME_SECTIONS.map(s=><div key={s.name} style={{position:"absolute",top:0,bottom:0,left:`${(s.start/(NE-1))*100}%`,width:`${((s.end-s.start+1)/(NE-1))*100}%`,background:s.color,opacity:0.2}}/>)}
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${(pos/(NE-1))*100}%`,background:"linear-gradient(90deg,#00FFFF,#FF6600,#FF0040,#FFE600,#DD00FF,#fff)"}}/>
            <div style={{position:"absolute",top:"50%",transform:"translate(-50%,-50%)",left:`${(pos/(NE-1))*100}%`,width:10,height:10,borderRadius:"50%",background:"#fff",boxShadow:"0 0 10px #fff"}}/>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={togglePlay} style={{width:32,height:28,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.18)",color:"rgba(220,220,255,0.9)",fontFamily:"monospace",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?"⏸":"▶"}</button>
          <button onClick={reset} style={{width:32,height:28,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(180,180,220,0.45)",fontFamily:"monospace",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>⏹</button>
          <button onClick={cycleSpeed} style={{height:28,padding:"0 12px",background:"rgba(221,0,255,0.08)",border:"1px solid rgba(221,0,255,0.28)",color:"rgba(221,0,255,0.85)",fontFamily:"monospace",fontSize:9,letterSpacing:2,cursor:"pointer"}}>{SPEEDS[speedIdx]}× SPEED</button>
          <div style={{fontSize:8,letterSpacing:3,color:"rgba(180,180,220,0.28)",fontFamily:"monospace",marginLeft:4}}>{String(Math.min(NE,Math.round(pos)+1)).padStart(2,"0")} / {NE}</div>
        </div>
      </div>
    </div>
  );
}
