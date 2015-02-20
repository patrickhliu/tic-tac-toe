/*  This file is written in vanilla javascript */

var turns = 0;                                                      // track the turn count, even turn is "O", odd turn is "X"              
var sqSet = document.getElementsByClassName("square");              // reference to node list of the 9 square <li> elements
var reset = document.querySelector(".reset");                       // reference to reset button at the bottom of page

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

function resetSquare(elem) {                                        // Call this function to reset all square <li> to their initial HTML status
    elem.textContent = '';
    elem.classList.remove('disable');
    elem.classList.remove('o');
    elem.classList.remove('x');
}

function resetSquareAll() {                                         // Call this function to reset all 9 <li> elements at once
    for (var j=0; j<sqSet.length; j++) {
        resetSquare( sqSet[j] );
    }

    turns = 0;                                                      // re-initialize turns back to 0
}

// Call this function to check if 3 straight O's occur on the board
function check_O () {
    if( hasClass( [sq1, sq2, sq3], "o") || hasClass( [sq4, sq5, sq6], "o") || hasClass( [sq7, sq8, sq9], "o")  ||
        hasClass( [sq1, sq4, sq7], "o") || hasClass( [sq2, sq5, sq8], "o") || hasClass( [sq3, sq6, sq9], "o")  ||
        hasClass( [sq1, sq5, sq9], "o") || hasClass( [sq3, sq5, sq7], "o") ) {
        return true;
    }
    else {
        return false;
    }
}

// Call this function to check if 3 straight X's occur on the board
function check_X () {
    if(hasClass( [sq1, sq2, sq3], "x") || hasClass( [sq4, sq5, sq6], "x") || hasClass( [sq7, sq8, sq9], "x")  ||
       hasClass( [sq1, sq4, sq7], "x") || hasClass( [sq2, sq5, sq8], "x") || hasClass( [sq3, sq6, sq9], "x")  ||
       hasClass( [sq1, sq5, sq9], "x") || hasClass( [sq3, sq5, sq7], "x") ) {
            return true;
    }
    else {
        return false;
    }
}

// A long click event handler for each of the 9 squares
for ( var i = 0; i < sqSet.length; i++ ) {
    sqSet[i].addEventListener("click", function() {     
        if( hasClass( [this], "disable") ) {                            // Check if user clicks on an already marked square, if yes, alert user
            alert("That square is already marked..");
        }
        else if ( turns % 2 === 0 ) {                                   // Check if turn count is even, if so mark square as "O"
            turns++;
            this.textContent = "o";                                     // set element's inner text to "O"
            this.classList.add('disable');                              // add class "disable" as a flag indicating square can't be marked again
            this.classList.add('o');                                    // add class "o", just changes background color
            if( check_O() ) {                                           // check if 3 straight O's have occured
                console.log("O winsies!");                          
                alert("O Winsies!!  Press OK to start new game");       // if yes, alert game winner
                turns = 0;                                              // reset turn count
                resetSquareAll();                                       // reset HTML of all <li> squares
            }
        }
        else if ( turns % 2 === 1 ) {
            turns++;                                                    // else means turn count is odd, mark square as "X"
            this.textContent = "x";                                     // set inner text of element to "X"
            this.classList.add('disable');                              // add class "disable" as a flag indicating square can't be marked again
            this.classList.add('x');                                    // add class "x", just changes background color
            if( check_X() ) {                                           // check if 3 straight O's have occured
                console.log("X winsies!");                              
                alert("X Winsies!!  Press OK to start new game");       // if yes, alert game winner
                turns = 0;                                              // reset turn count
                resetSquareAll();                                       // reset HTML of all <li> squares
            }
        } 


        if ( turns === 9) {                                             // Always check if turn count is 9, if so declare tie game
            alert("Tie Game! Press OK to start a new game");
            turns = 0;
            resetSquareAll();
        }       
    }) // end .addEventListener()
}// end for loop


reset.addEventListener("click", resetSquareAll);                        // call resetSquareAll when reset button is clicked anytime