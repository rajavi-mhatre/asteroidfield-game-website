function saveData(){
    localStorage.setItem('UserData', JSON.stringify(UserData));

}

//function to update the leaderboard
function updateLeaderBoard(){
    const leaderboard=document.getElementById('leaderboard');

    //Saving data to leaderboard
    leaderboard.textContent='${playerData.username}: ${playerData.timeSurvived.toFixed(2)} seconds';
    leaderboard.innerHTML='';

    //Inserting appropriate rows and columns.
    const row=leaderboard.insertRow();
    const rank=newRow.insertCell(0);
    const nameData=newRow.insertCell(1);
    const scoreData=newRow.insertCell(2);

    //Current user ranked in first place.
    rank.textContent='1';
    nameData.textContent=UserData.username;
    scoreData.textContent=UserData.timeSurvived.toFixed(2);
}

//initializes a timer
function startTimer(){

    let timePassed=0;
    timer=setInterval(() => {
        timePassed+=0.1;
        UserData.timeSurvived=timePassed;
        
    }, 100);
}

//Stops the timer and updates the leaderboard
function endGame(){
    clearInterval(timer);
    saveData();
    updateLeaderBoard();
}

//Starts the timer and updates the leaderboard
function showGame(username){
    UserData.username=username;
    startTimer();
    updateLeaderBoard();
}
