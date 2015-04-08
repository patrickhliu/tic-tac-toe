/*  This file is written in vanilla javascript */

var turns = 0;                                                      // track turn count, even turn is "O", odd turn is "X"              
var sqSet = document.getElementsByClassName("square");              // reference to node list of the 9 square <li> elements
var reset = document.querySelector(".reset");                       // reference to reset button
var gameBoard = document.querySelector('.board');                   // reference to the <section> containing the 9 squares

var sq1 = document.querySelector(".sq1");                           // reference to each individual square
var sq2 = document.querySelector(".sq2");
var sq3 = document.querySelector(".sq3");
var sq4 = document.querySelector(".sq4");
var sq5 = document.querySelector(".sq5");
var sq6 = document.querySelector(".sq6");
var sq7 = document.querySelector(".sq7");
var sq8 = document.querySelector(".sq8");
var sq9 = document.querySelector(".sq9");

function hasClass(elemArr, clName) {                                // Call this function with an array of elements & a string of the CSS class to check for.
    return elemArr.every(function(elem, ind, arr) {                 // It will return true/false if ALL elements contain that string in their class name.
        return (elem.className.indexOf(clName) > -1);
    });
}

function resetSquare(elem) {                                        // Call this function to reset all square <li> to their initial status
    elem.textContent = '';
    elem.classList.remove('disable');
    elem.classList.remove('o');
    elem.classList.remove('x');
}

function resetSquareAll() {                                         // Call this function to reset all 9 <li> elements at once
    for (var j = 0; j < sqSet.length; j++) {
        resetSquare( sqSet[j] );
    }

    turns = 0;                                                      // re-initialize turns back to 0
}

// Call this function to check if 3 straight O's occur on the board
function didOWin () {
    if( hasClass( [sq1, sq2, sq3], "o") || hasClass( [sq4, sq5, sq6], "o") || hasClass( [sq7, sq8, sq9], "o")  ||
        hasClass( [sq1, sq4, sq7], "o") || hasClass( [sq2, sq5, sq8], "o") || hasClass( [sq3, sq6, sq9], "o")  ||
        hasClass( [sq1, sq5, sq9], "o") || hasClass( [sq3, sq5, sq7], "o") ) {
         alert("O Winsies!!  Press OK to start new game");       // if yes, alert game winner
         resetSquareAll();                                       // reset HTML of all <li> squares
    }
}

// Call this function to check if 3 straight X's occur on the board
function didXWin () {
    if (hasClass( [sq1, sq2, sq3], "x") || hasClass( [sq4, sq5, sq6], "x") || hasClass( [sq7, sq8, sq9], "x")  ||
        hasClass( [sq1, sq4, sq7], "x") || hasClass( [sq2, sq5, sq8], "x") || hasClass( [sq3, sq6, sq9], "x")  ||
        hasClass( [sq1, sq5, sq9], "x") || hasClass( [sq3, sq5, sq7], "x") ) {
            alert("X Winsies!!  Press OK to start new game");       // if yes, alert game winner
            resetSquareAll();                                       // reset HTML of all <li> squares
    }
}

// possible winning combinations
var winCombo = [ 
    { combo: [1, 2, 3], o: null, x: null}, 
    { combo: [4, 5, 6], o: null, x: null},
    { combo: [7, 8, 9], o: null, x: null},
    { combo: [1, 4, 7], o: null, x: null},
    { combo: [2, 5, 8], o: null, x: null},
    { combo: [3, 6, 9], o: null, x: null},
    { combo: [1, 5, 9], o: null, x: null},
    { combo: [3, 5, 7], o: null, x: null} ]

// random number generator to select random square to mark
function rand (min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

// callback function to collect the indices of O & X squares
function checkBoard(elem, ind, arr) {
    if (elem.classList.contains('o') ) {
        oMatch.push(ind + 1);
    }
    else if (elem.classList.contains('x')) {
        xMatch.push(ind + 1);
    }
}

// run on first CPU turn, cpu will choose random square to mark X
function firstCpuTurn() {
    var tempNum = rand(1,9);

    if ( !document.querySelector('.sq' + String(tempNum)).classList.contains('disable')  ) {
        document.querySelector('.sq' + String(tempNum)).textContent = 'x';
        document.querySelector('.sq' + String(tempNum)).classList.add('disable');
        document.querySelector('.sq' + String(tempNum)).classList.add('x');
    }
    else {
        firstCpuTurn();
    }
}

var oMatch = [];        // array to hold sqSet indices where there is an O marker
var xMatch = [];        // array to hold sqSet indices where there is an X marker

// function to take care of computers turn
function compTurn () {  
    if ( turns === 1 ) {    // if cpu first turn
        turns++;            // increment turn counter
        firstCpuTurn();     // mark random square
        return true;        // return true to exit compTurn();
    }
    
    turns++;                // increment turn counter

    // re-initialize the arrays at start of each turn
    oMatch = [];
    xMatch = [];
    
    Array.prototype.forEach.call(sqSet, checkBoard );       // call function to fill up oMatch & xMatch arrays (indices of all x's and o's on board)
    var markFlag = false;                                   // booleans to track status of CPU's board analysis
    var posFlag = false;

    for (var i = 0; i < winCombo.length; i++ ) {            // for each 3-set (1-2-3, 1-5-9, 3-6-9, etc...)
        var oMatchCount = 0;                                // count the number of x's and o's
        var xMatchCount = 0;

        for (var j = 0; j < oMatch.length; j++ ) {                  // count number of o's in current 3-set
            if ( winCombo[i].combo.indexOf(oMatch[j]) !== -1 ) {    
                oMatchCount++;                                      
            }
        }

        for (var k = 0; k < xMatch.length; k++ ) {                  // count number of x's in current 3-set
            if ( winCombo[i].combo.indexOf(xMatch[k]) !== -1 ) {    
                xMatchCount++;                                      
            }
        }
        
        winCombo[i].o = oMatchCount;    // store the counter values into the object property
        winCombo[i].x = xMatchCount;
    }

    var saveIndex = 0;      // variables to store best winning position
    var saveValue = 0;

    // iterate and analyze the count values of each 3-set...
    for (var i = 0; i < winCombo.length; i++ ) {                        
        if ( winCombo[i].x === 2 && winCombo[i].o === 0 ) {     // first chance of 2 x's & 0 o's...save index to go for the win
            markFlag = true;
            saveIndex = i;
            break;
        }
    }   

    if (!markFlag) {                                        // if no winning chance, first chance of 2 o's & 0 x's...save index to go for a block
        for (var i = 0; i < winCombo.length; i++ ) {                        
            if ( winCombo[i].o === 2 && winCombo[i].x === 0 ) {
                markFlag = true;
                saveIndex = i;
                break;
            }
        }       
    }

    if (!markFlag) {                                        // if neither win / block opportunity, search for best chance 3-set for a win
        for (var i = 0; i < winCombo.length; i++ ) {                        
            if ( (winCombo[i].x > saveValue) && winCombo[i].o === 0 ) {     // most # of X's with zero O's in that 3-set
                saveIndex = i;                              // save index to process below
                saveValue = winCombo[i].x;                  // save value so you know what value you have to beat in the if condition
                posFlag = true;
            }
        }       
    }

    // if both flags still false, then nothing was marked (no winning chance & no chance to block & best 3-set not found)
    // so mark a random square
    if (!posFlag && !markFlag) {     
        firstCpuTurn();
    }
    // else something was found, mark an available square in that 3-set
    else { 
        for (var n = 0; n < winCombo[saveIndex].combo.length; n++) {
            if ( !document.querySelector('.sq' + String(winCombo[saveIndex].combo[n])).classList.contains('disable')  ) {
                document.querySelector('.sq' + String(winCombo[saveIndex].combo[n])).textContent = 'x';            // mark X for the win
                document.querySelector('.sq' + String(winCombo[saveIndex].combo[n])).classList.add('disable');
                document.querySelector('.sq' + String(winCombo[saveIndex].combo[n])).classList.add('x');
                break;
            }
        }       
    }   
}

gameBoard.addEventListener('click', checkGameProgress, false);      // event handler for click on the game board container

function checkGameProgress(e) {
    if (e.target.classList.contains('square')) {                    // if the user clicked on any of the 9 squares
        if (  hasClass( [e.target], "disable") ) {                  // if user clicks on an already marked square, alert user
            alert("That square is already marked..");
        }
        else {                                                      // else mark as O 
            turns++;        
            e.target.textContent = "o";                             
            e.target.classList.add('disable');                      
            e.target.classList.add('o');                            
            didOWin();                                              // check if O won...
            
            if ( turns < 9 && turns !== 0 ) {                       // if tie game not reached & no one has won yet...
                setTimeout( function() {
                    compTurn();                                     // CPU takes turn
                    didXWin();                                      // check if X won...
                }, 500);    
            }
            else if ( turns === 9) {                                // if turn count is 9, declare tie game
                alert("Tie Game! Press OK to start a new game");
                resetSquareAll();
            }
        }          
    }

    e.stopPropagation();                                            // stop event propogation
}

reset.addEventListener("click", resetSquareAll);                    // call resetSquareAll when reset button is clicked anytime