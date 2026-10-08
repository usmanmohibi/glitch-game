/* GLITCH original procedural soundtrack. No audio downloads or samples. */
(function(){
'use strict';
const KEY='glitch-music-choice';
const tracks={
 history:{bpm:76,root:43,scale:[0,2,3,5,7,8,10],mel:[0,4,2,5,4,2,0,-1],bass:[0,0,5,3],wave:'sawtooth',drums:'epic'},
 science:{bpm:92,root:48,scale:[0,2,4,7,9,11],mel:[0,2,4,5,4,2,1,0],bass:[0,4,2,5],wave:'sine',drums:'soft'},
 geography:{bpm:118,root:50,scale:[0,2,4,5,7,9,11],mel:[0,2,4,5,4,2,6,4],bass:[0,3,4,0],wave:'triangle',drums:'travel'},
 sports:{bpm:142,root:45,scale:[0,2,4,5,7,9,11],mel:[0,4,5,4,2,4,6,5],bass:[0,4,5,3],wave:'square',drums:'stadium'},
 pop:{bpm:126,root:53,scale:[0,2,4,5,7,9,11],mel:[0,2,4,2,5,4,2,0],bass:[0,5,3,4],wave:'triangle',drums:'pop'},
 food:{bpm:112,root:55,scale:[0,2,4,7,9],mel:[0,2,4,2,3,1,4,0],bass:[0,3,2,4],wave:'sine',drums:'bouncy'},
 animals:{bpm:82,root:52,scale:[0,2,4,5,7,9,11],mel:[0,2,4,3,2,1,0,2],bass:[0,3,4,0],wave:'sine',drums:'nature'},
 mix:{bpm:132,root:47,scale:[0,1,3,5,7,8,10],mel:[0,5,1,6,3,2,5,1],bass:[0,5,1,4],wave:'square',drums:'glitch'}
};
let ctx,master,loop=null,nextTime=0,step=0,topic='',phase='',enabled=false,unlocked=false,sessionKey='',lastReveal='',lastEnd='',tapActive=false;
const Audio=window.AudioContext||window.webkitAudioContext;
function ensure(){if(!Audio)return false;try{if(!ctx){ctx=new Audio();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume().catch(()=>{});return true}catch{return false}}
function tone(freq,time,duration,volume,wave='sine',dest=master){if(!ctx)return;try{const o=ctx.createOscillator(),g=ctx.createGain();o.type=wave;o.frequency.setValueAtTime(freq,time);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),time+.012);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(dest);o.start(time);o.stop(time+duration+.025)}catch{}}
function hz(midi){return 440*Math.pow(2,(midi-69)/12)}
function noise(time,duration,volume,highpass){if(!ctx)return;try{let len=Math.ceil(ctx.sampleRate*duration),b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);let s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=b;f.type='highpass';f.frequency.value=highpass;g.gain.value=volume;s.connect(f);f.connect(g);g.connect(master);s.start(time);s.stop(time+duration)}catch{}}
function drum(time,kind,weight=1){if(kind==='kick'){tone(90,time,.17,.07*weight,'sine');tone(53,time+.03,.15,.065*weight,'sine')}else if(kind==='clap'){noise(time,.11,.035*weight,1100);noise(time+.035,.09,.024*weight,1400)}else noise(time,.055,.013*weight,4800)}
function noteFrom(t,i,oct=0){let n=t.scale.length;let octave=Math.floor(i/n);let ix=((i%n)+n)%n;if(i<0)octave=-1;return hz(t.root+t.scale[ix]+12*(octave+oct))}
function scheduleStep(){if(!ctx||!enabled||!unlocked||!topic||phase==='finished')return;let t=tracks[topic]||tracks.mix,beat=60/t.bpm,sub=beat/2;while(nextTime<ctx.currentTime+.22){let s=step%16,bar=Math.floor(step/16);if(s%2===0){let idx=t.mel[(s/2+bar*2)%t.mel.length];tone(noteFrom(t,idx,1),nextTime,sub*.76,t.drums==='nature'?.011:.018,t.wave);if(t.drums==='epic')tone(noteFrom(t,idx,0),nextTime,sub*.65,.008,'sawtooth')}
if(s%4===0)tone(noteFrom(t,t.bass[(s/4)%4],-1),nextTime,sub*2.7,.018,t.drums==='glitch'?'square':'triangle');
if(s%4===0)drum(nextTime,'kick',t.drums==='epic'||t.drums==='stadium'?1.25:.52);
if(s%4===2&&t.drums!=='nature')drum(nextTime,'clap',t.drums==='stadium'?1.35:.5);
if(s%2===1&&t.drums!=='epic'&&t.drums!=='nature')drum(nextTime,'hat',t.drums==='glitch'?.95:.55);
if(t.drums==='glitch'&&s===13)tone(hz(85),nextTime,.065,.009,'square');
if(t.drums==='nature'&&s===12)tone(noteFrom(t,6,2),nextTime,.3,.006,'sine');
nextTime+=sub;step++}}
function fade(value,seconds=.35){if(!ctx||!master)return;try{let now=ctx.currentTime;master.gain.cancelScheduledValues(now);master.gain.setTargetAtTime(value,now,Math.max(.015,seconds/3))}catch{}}
function target(){if(!enabled||!unlocked||!sessionKey||phase==='finished')return 0;if(tapActive)return 0;return phase==='vote'?.105:.065}
function sync(){fade(target(),tapActive?.12:.38)}
function unlock(){unlocked=true;if(ensure()){if(!loop){nextTime=ctx.currentTime+.1;loop=setInterval(scheduleStep,75)}sync()}}
function setSession(s){if(!s){sessionKey='';phase='';fade(0,.15);return}let key=s.code+':'+s.me?.id;if(sessionKey!==key){sessionKey=key;let choice=localStorage.getItem(KEY);enabled=choice===null?!!(s.solo||s.me?.host):choice==='1'}let oldPhase=phase;phase=s.phase;tapActive=phase==='challenge'&&s.prompt?.type==='tap';let newTopic=s.topic||'mix';if(newTopic!==topic){topic=newTopic;step=0;if(ctx)nextTime=ctx.currentTime+.12}if(oldPhase!==phase){if(phase==='finished'){fade(0,.12);let id=s.code+':'+s.round;if(lastEnd!==id){lastEnd=id;jingle()}}else if(phase==='glitchReveal'){let id=s.code+':'+s.round+':'+s.practice;if(lastReveal!==id){lastReveal=id;setTimeout(()=>{if(phase==='glitchReveal')sting()},2700)}}}sync()}
function sting(){if(!unlocked||!ensure())return;let n=ctx.currentTime+.02;[0,3,7,12].forEach((x,i)=>tone(hz(48+x),n+i*.075,.48,.045,'sawtooth'));drum(n+.24,'kick',1.3)}
function jingle(){if(!unlocked||!enabled||!ensure())return;let n=ctx.currentTime+.12;const out=ctx.createGain();out.gain.value=.6;out.connect(ctx.destination);[0,4,7,12,7,12].forEach((x,i)=>tone(hz(60+x),n+i*.16,.27,.05,'triangle',out))}
function toggle(){unlock();enabled=!enabled;try{localStorage.setItem(KEY,enabled?'1':'0')}catch{}sync();return enabled}
function isOn(){return enabled}
window.GlitchMusic={unlock,setSession,toggle,isOn};
})();
