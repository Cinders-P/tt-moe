var marker = {
    X: 1,
    O: 2,
    NONE: 3
};
var nextMarker = "";
var pMarker = "";
var mMarker = "";
var playerTurn = false;
var dialogue = [
    "Finally, someone to play with!<br>Pick X or O!", //0
    "Let's go again!<br>Pick X or O!", //1
    "'X'cellent. Guess you're going first.", //2
    "OH, interesting choice... I'll start then?", //3
    "You want to switch markers? 'kay.", //4
    "I lost? No way! One more time.", //5
    "Ehehe, I've been practicing you know~!", //6
    "Eh? Looks like it's a tie.", //7
    "" //8
];
var board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
var pScore = 0;
var mScore = 0;
var gameStart = false;
var win = false;
var firstMove = true;
var secondMove = false;

$(function() {
    $('#myModal').modal({
        show: false
    });

    $(".btn-group-lg> .btn:first-child").click(function() {
        $(".btn-group-lg").css("box-shadow", "none");
        if ((nextMarker === "") || (nextMarker === "o")) {

            if (nextMarker === "o") {
                speech(4);
                resetO();
            } else {
                speech(2);
            }

            nextMarker = "x";
            $(this).css({
                "background-color": "rgb(244, 160, 189)",
                "color": "white",
                "border-top": "3px solid rgba(0,0,0,0.1)",
                "border-left": "3px solid rgba(0,0,0,0.1)",
            });
        }
    });
    $(".btn-group-lg> .btn:nth-child(2)").click(function() {
        $(".btn-group-lg").css("box-shadow", "none");

        if (nextMarker === "") {
            speech(3);
        } else if (nextMarker === "x") {
            speech(4);
            resetX();
        }
        nextMarker = "o";
        $(this).css({
            "background-color": "rgb(244, 160, 189)",
            "color": "white",
            "border-top": "3px solid rgba(0,0,0,0.1)",
            "border-left": "3px solid rgba(0,0,0,0.1)",
        });
    });

    $("#reset").click(function() {
        $("#myModal").modal("show");
    });

    $(".btn-danger").click(function() {
        speech(1);
        resetX();
        resetO();
        $(".square>p").text("");
        $(".btn-group-lg").css("box-shadow", "0 0 10px 5px pink");
        pScore = 0;
        mScore = 0;
        $("h4:eq(1)").text("You: " + pScore.toString());
        $("h4:eq(0)").text("Millhiore: " + mScore.toString());
        nextMarker = "";
        gameStart = false;
        playerTurn = false;
        firstMove = true;
        secondMove = false;
        pMarker = "";
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    });

    $(".square").on("click", function() {
        if ((nextMarker !== "") && (!gameStart)) {
            gameStart = true;
            pMarker = nextMarker;
            if (pMarker === "o")
                mMarker = "x";
            else
                mMarker = "o";

            if (pMarker === "o") {
                playerTurn = false;
                firstMove = true;
                mMove();
                playerTurn = true;
                firstMove = false;
                return;
            } else {
                secondMove = true;
                playerTurn = true;
                firstMove = false;
            }

        }
        if (playerTurn) {
            speech(8);
            $(this).children().text(pMarker);
            board[Math.floor($(this).index() / 3)][$(this).index() % 3] = pMarker;
            playerTurn = false;
            checkWin(pMarker);
            if (win)
                return;
            mMove();
            checkWin(mMarker);
            if (win)
                return;
            else
                playerTurn = true;
        }
    });
});

function resetX() {
    $(".btn-group-lg> .btn:first-child").css({
        "background-color": "white",
        "color": "rgb(244, 160, 189)",
        "border": "none"
    });
}

function resetO() {
    $(".btn-group-lg> .btn:nth-child(2)").css({
        "background-color": "white",
        "color": "rgb(244, 160, 189)",
        "border": "none"
    });
}

function speech(x) {
    $("#speech").fadeOut("fast");
    window.setTimeout(function() {
        $("#speech").html(dialogue[x]).fadeIn("fast");
    }, 300);
}

function mMove() {
    var temp = 0;
    var tempArr = [];
    var tempArr2 = [];

    if (firstMove) {
        temp = Math.floor(Math.random() * 5);
        switchCorner(temp);
        firstMove = false;
        return;
    } else if (secondMove) {
        secondMove = false;

        for (var k = 0; k < 9; k++) {
            if ($(".square:eq(" + k + ")>p").text() === "x") {
                temp = k;
                break;
            }
        }
        if (/[0268]/.test(temp)) {
            board[Math.floor((temp) / 3)][1] = mMarker;
            if (temp > 4)
                temp = 7;
            else
                temp = 1

            $(".square:eq(" + temp + ")>p").text(mMarker);
            return;
        }
    }

    //1. check if Millie can win
    //2. block enemy win conditions
    //Kept them separate despite similar code so Millie would prioritize #1
    for (var q = 0; q < 3; q++) {
        temp = 0;
        tempArr = [];
        if ((board[q].filter(function(item) { //1a. row victory
                if (item === mMarker) return true;
            }).length === 2) && (board[q].indexOf("") !== -1)) {
            temp = board[q].indexOf("");
            board[q][temp] = mMarker;
            $(".square:eq(" + (q * 3 + temp) + ")>p").text(mMarker);
            return;

        } else { //1b. column victory
            for (var w = 0; w < 3; w++) {
                tempArr.push(board[w][q]);
            }
            if ((tempArr.filter(function(item) {
                    if (item === mMarker) return true;
                }).length === 2) && (tempArr.indexOf("") !== -1)) {
                temp = tempArr.indexOf("");
                board[temp][q] = mMarker;
                $(".square:eq(" + (temp * 3 + q) + ")>p").text(mMarker);
                return;
            } else {
                tempArr = [];
            }
        }
    }

    tempArr = [board[0][0], board[1][1], board[2][2]];
    if ((tempArr.filter(function(item) { //1c. diagonal victory
            if (item === mMarker) return true;
        }).length === 2) && (tempArr.indexOf("") !== -1)) {
        temp = tempArr.indexOf("");
        board[temp][temp] = mMarker;
        $(".square:eq(" + (temp * 3 + temp) + ")>p").text(mMarker);
        return;
    } else {
        tempArr = [];
    }

    tempArr = [board[0][2], board[1][1], board[2][0]];
    if ((tempArr.filter(function(item) { //1d. diagonal victory
            if (item === mMarker) return true;
        }).length === 2) && (tempArr.indexOf("") !== -1)) {
        temp = tempArr.indexOf("");
        board[temp][2 - temp] = mMarker;
        $(".square:eq(" + (temp * 3 + (2 - temp)) + ")>p").text(mMarker);
        return;
    } else {
        tempArr = [];
    }


    for (q = 0; q < 3; q++) {
        if ((board[q].filter(function(item) { //2a. row block
                if (item === pMarker) return true;
            }).length === 2) && (board[q].indexOf("") !== -1)) {
            temp = board[q].indexOf("");
            board[q][temp] = mMarker;
            $(".square:eq(" + (q * 3 + temp) + ")>p").text(mMarker);
            return;
        } else { //2b. column block
            for (var w = 0; w < 3; w++) {
                tempArr.push(board[w][q]);
            }
            if ((tempArr.filter(function(item) {
                    if (item === pMarker) return true;
                }).length === 2) && (tempArr.indexOf("") !== -1)) {
                temp = tempArr.indexOf("");
                board[temp][q] = mMarker;
                $(".square:eq(" + (temp * 3 + q) + ")>p").text(mMarker);
                return;
            } else {
                tempArr = [];
            }
        }
    }

    tempArr = [board[0][0], board[1][1], board[2][2]];
    if ((tempArr.filter(function(item) { //2c. diagonal victory
            if (item === pMarker) return true;
        }).length === 2) && (tempArr.indexOf("") !== -1)) {
        temp = tempArr.indexOf("");
        board[temp][temp] = mMarker;
        $(".square:eq(" + (temp * 3 + temp) + ")>p").text(mMarker);
        return;
    } else {
        tempArr = [];
    }

    tempArr = [board[0][2], board[1][1], board[2][0]];
    if ((tempArr.filter(function(item) { //2d. diagonal victory
            if (item === pMarker) return true;
        }).length === 2) && (tempArr.indexOf("") !== -1)) {
        temp = tempArr.indexOf("");
        board[temp][2 - temp] = mMarker;
        $(".square:eq(" + (temp * 3 + (2 - temp)) + ")>p").text(mMarker);
        return;
    } else {
        tempArr = [];
    }

    //3. if a corner or the center is free, take it
    while (true) {
        tempArr = [board[0][0], board[0][2], board[1][1], board[2][0], board[2][2]];
        if (tempArr.every(function(item) {
                return item !== "";
            })) break;
        else {
            temp = Math.floor(Math.random() * 5);
            if (tempArr[temp] === "") {
                switchCorner(temp);
                return;
            }
        }
    }

    //4.Take any other free tile
    while (true) {
        if (board.every(function(item) {
                return item === ["", "", ""];
            })) break;
        temp = Math.floor(Math.random() * 9);
        if (board[Math.floor(temp / 3)][temp % 3] === "") {
            board[Math.floor(temp / 3)][temp % 3] = mMarker;
            $(".square:eq(" + temp + ")>p").text(mMarker);
            return;
        }
    }
    return;
}

function checkWin(mkr) {
    var notif = document.createElement("audio");
    notif.volume = "0.5";
    notif.src = "notif.mp3";

    win = false;

    for (var i = 0; i < 3; i++) {
        if ((board[i][0] === mkr) && (board[i][1] === mkr) && (board[i][2] === mkr)) { //check each row for a win
            win = true;
            $(".square:eq(" + (i * 3 + 0) + ")").addClass("blink");
            $(".square:eq(" + (i * 3 + 1) + ")").addClass("blink");
            $(".square:eq(" + (i * 3 + 2) + ")").addClass("blink");
        }
        if ((board[0][i] === mkr) && (board[1][i] === mkr) && (board[2][i] === mkr)) { //check each column for a win
            win = true;
            $(".square:eq(" + i + ")").addClass("blink");
            $(".square:eq(" + (i + 3) + ")").addClass("blink");
            $(".square:eq(" + (i + 6) + ")").addClass("blink");

        }
    }
    if ((board[0][0] === mkr) && (board[1][1] === mkr) && (board[2][2] === mkr)) { //check top to bottom diagonal for a win
        win = true;
        $(".square:eq(0)").addClass("blink");
        $(".square:eq(4)").addClass("blink");
        $(".square:eq(8)").addClass("blink");
    }
    if ((board[2][0] === mkr) && (board[1][1] === mkr) && (board[0][2] === mkr)) { //check bottom to top diagonal for a win
        win = true;
        $(".square:eq(2)").addClass("blink");
        $(".square:eq(4)").addClass("blink");
        $(".square:eq(6)").addClass("blink");
    }


    if (win) {
        notif.play();
        window.setTimeout(function() {
            $(".square").removeClass("blink");
        }, 1500);
        if (mkr === pMarker) {
            speech(5);
            pScore++;
            $("h4:eq(1)").text("You: " + pScore.toString());
        } else {
            speech(6);
            mScore++;
            $("h4:eq(0)").text("Millhiore: " + mScore.toString());
        }
        nextGame();
    } else {
        var full = true;
        for (var d = 0; d < 3; d++) {
            for (var b = 0; b < 3; b++) {
                if (board[d][b] === "")
                    full = false;
            }
        }
        if (full) { //if the board is full and no win condition was met
            notif.play();
            $(".square").addClass("blink");
            window.setTimeout(function() {
                $(".square").removeClass("blink");
            }, 1500);
            speech(7);
            win = true; //so the AI doesn't move afterwards
            nextGame();
        }
    }
}

function nextGame() {
    playerTurn = false;
    firstMove = true;
    window.setTimeout(function() {
        $(".square>p").fadeOut();
        window.setTimeout(function() {
            $(".square>p").text("");
            $(".square>p").fadeIn();
            board = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ];
            gameStart = false;
        }, 500);
        pMarker = nextMarker;
    }, 2000);
}

function switchCorner(temp) {
    switch (temp) {
        case 0:
            board[0][0] = mMarker;
            $(".square:eq(0)>p").text(mMarker);
            break;
        case 1:
            board[0][2] = mMarker;
            $(".square:eq(2)>p").text(mMarker);
            break;
        case 2:
            board[1][1] = mMarker;
            $(".square:eq(4)>p").text(mMarker);
            break;
        case 3:
            board[2][0] = mMarker;
            $(".square:eq(6)>p").text(mMarker);
            break;
        case 4:
            board[2][2] = mMarker;
            $(".square:eq(8)>p").text(mMarker);
            break;
    }
}
