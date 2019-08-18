const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;
const axios = require('axios');

app.use(express.static(__dirname + '/public'));

let users = {};
let question = {};
let userIds = [];
let playerIndex = 0;
let questionsAsked = 0;
let countdown = 10;
let interval = false;

function intervalSet(){
    interval = setInterval(() => {
        io.sockets.emit('timer', countdown);
        countdown--;
    }, 1000);
    if(countdown === 0){
        countdown = 10;
    }
}

// if(users.length <= lobbySize){}
io.on('connection', (socket) => {

    // Add user object when username created
    socket.on('addUser', (username) => {

        users[socket.id] = {
            username: username,
            userId: socket.id,
            score: 0
        };
        
        // array of all users
        userIds.push(socket.id);

        socket.emit('currentUsers', users);
        socket.broadcast.emit('currentUsers', users);

    });

    // Remove user object when user disconnects
    socket.on('disconnect', () => {
        delete users[socket.id];
        socket.broadcast.emit('currentUsers', users);

        // remove from userIds
        index = userIds.indexOf(socket.id);
        if(index > -1){
            userIds.splice(index, 1);
        }

    });

    socket.on('answerSubmit', (answer) => {
        if(interval){
            clearInterval(interval);
            countdown = 10;
        }
        if(socket.id === userIds[playerIndex]){
            // clearInterval(interval)
            // countdown = 10;
            if(playerIndex < userIds.length -1){
                playerIndex++;
            } else {
                playerIndex = 0;
            }

            if(answer.toLowerCase() === question.correct_answer.toLowerCase()){
                switch(question.difficulty){
                    case 'hard':
                        users[socket.id]['score'] += 3;
                        break;
                    case 'medium':
                        users[socket.id]['score'] += 2;
                        break;
                    default:
                        users[socket.id]['score'] += 1;
                }

            }

            socket.emit('activePlayer', users[userIds[playerIndex]]);
            socket.broadcast.emit('activePlayer', users[userIds[playerIndex]]);
            socket.emit('currentUsers', users);
            socket.broadcast.emit('currentUsers', users);
    
            if(users[socket.id]['score'] > 14){
                socket.emit('endGame');
                socket.broadcast.emit('endGame');
            } else {
                axios.get('https://opentdb.com/api.php?amount=1&type=multiple').then((res) => {
                    question = res.data.results[0];
                    this.question = question;
                    console.log(this.question);
                    socket.emit('questionData', this.question);
                    socket.broadcast.emit('questionData', this.question);
                    intervalSet();

                }).catch((error) => {
                    console.error(error);
                });
                questionsAsked++;
            }
        }
    });


    // Say who the current user is
    socket.on('getActive', () => {
        socket.emit('activePlayer', users[userIds[playerIndex]]);
    });

    // Client side user ID
    socket.on('getId', () => {
        socket.emit('userId', socket.id);
    });

    // Get all Users
    socket.on('allUsers', () => {
        socket.emit('currentUsers', users);

    });

    // Redirect other users
    socket.on('getRedirectUsers', () => {
        socket.emit('redirectUsers');
        socket.broadcast.emit('redirectUsers');
    });

    // Game cleanup / Game Over
    socket.on('gameOver', () => {
        users = {};
        question = {};
        userIds = [];
        playerIndex = 0;
        questionsAsked = 0;
    });

    /**
     * Question Related
     */
    socket.on('getQuestion', () => {
        if(interval){
            clearInterval(interval);
            countdown = 10;
        }
        if(questionsAsked > 50){
            socket.emit('backHome');
            socket.broadcast.emit('backHome');
            users = {};
            question = {};
            userIds = [];
            playerIndex = 0;
            questionsAsked = 0;
        } else {
            if(socket.id === userIds[playerIndex]){
                // clearInterval(interval);
                // countdown = 10;
                axios.get('https://opentdb.com/api.php?amount=1&type=multiple').then((res) => {
                    question = res.data.results[0];
                    this.question = question;
                    console.log(this.question)
                    socket.emit('questionData', this.question);
                    socket.broadcast.emit('questionData', this.question);
                    this.questionsAsked++;
                    intervalSet();
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
    });
});

server.listen(port, () => console.log(`Listening on port: ${port}`));