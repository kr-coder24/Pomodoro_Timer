const timer={
    pomodoro:1,
    shortBreak:5,
    longBreak:15,
    longBreakInterval:4,
    sessions:0,
};
document.addEventListener('DOMContentLoaded', () => {
  changeMode('pomodoro');
});
const mainbutton=document.getElementById('js-btn');
mainbutton.addEventListener('click',()=>{
    const {action}=mainbutton.dataset;
    if(action==='start'){
        startTimer();
    }
    else{
        stopTimer();
    }
});
const modebuttons=document.querySelector('#js-mode-buttons');
modebuttons.addEventListener('click',handleMode);
let interval;
function getremainingtime(endTime){
    const currentime=Date.parse(new Date());
    const diff=endTime-currentime;
    const total=Number.parseInt(diff/1000,10);
    const minutes=Number.parseInt(total/60,10);
    const seconds=Number.parseInt(total%60,10);
    return {
        total,
        minutes,
        seconds,
    };
}
function startTimer(){
    let {total}=timer.remainingtime;
    const endTime=Date.parse(new Date())+total*1000;
    if(timer.mode==='pomodoro') timer.sessions++;
    mainbutton.dataset.action='stop';
    mainbutton.textContent='stop';
    mainbutton.classList.add('active');
    interval=setInterval(function(){
        timer.remainingtime=getremainingtime(endTime);
        updateclock();
        total=timer.remainingtime.total;
        if(total<=0){
            clearInterval(interval);
            switch(timer.mode){
                case 'pomodoro':
                    if(timer.sessions%timer.longBreakInterval===0){
                        changeMode('longBreak');
                    }
                    else{
                        changeMode('shortBreak');
                    }
                    break;
                default:
                    changeMode('pomodoro');    
            }
            startTimer();
        }

    },1000);
}
function stopTimer(){
    console.log('Timer stopped');
    clearInterval(interval);
    mainbutton.dataset.action='start';
    mainbutton.textContent='start';
    mainbutton.classList.remove('active');
}
function updateclock(){
    const {remainingtime}=timer;
    const minutes=`${remainingtime.minutes}`.padStart(2,'0');
    const seconds=`${remainingtime.seconds}`.padStart(2,'0');
    const min=document.getElementById('js-minutes');
    const sec=document.getElementById('js-seconds');
    min.textContent=minutes;
    sec.textContent=seconds;
}
function changeMode(mode){
    timer.mode=mode;
    timer.remainingtime={
        total:timer[mode]*60,
        minutes:timer[mode],
        seconds:0
    };
document.querySelectorAll('button[data-mode]').forEach(e=>e.classList.remove('active'));
document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
document.body.style.backgroundColor=`var(--${mode})`;
updateclock();
}
function handleMode(event){
    const {mode}=event.target.dataset;
    if(!mode) return;
    else{
        stopTimer();
        changeMode(mode);
    }
}
