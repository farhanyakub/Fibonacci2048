var score;
var board;
var rows = 4;
var cols = 4;
var map = new Map();
var moved;
var foundMove;
var diffValue = Math.floor(Math.random() * 15);
var count = 0;

document.addEventListener('DOMContentLoaded', function() {
    createSequence();
    initializeGame();
});

function initializeGame() {
    score = 0;
    const boardGame = document.getElementById("board");
    boardGame.innerHTML = '';
    document.getElementById("score").innerText = 0;
    document.getElementById("endGame").innerText = "";
    document.getElementById("highScore").innerText = getHighScore();

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = i.toString() + "-" + j.toString();
            setTile(tile, board[i][j]);
            boardGame.appendChild(tile)
        }
    }

    setRandomTile();
    setRandomTile();
}

function createSequence() {
    let previous = 1;
    let curr = 1;
    for (let i = 0; i < 30; i++) {
        let next = previous + curr;
        map.set(curr, new Set([previous, next]));

        previous = curr;
        curr = next;
    }
}

function setRandomTile() {
    if (!checkFull()) {
        let randRow = Math.floor(Math.random() * rows);
        let randCol = Math.floor(Math.random() * cols);
        while (board[randRow][randCol] !== 0) {
            randRow = Math.floor(Math.random() * rows);
            randCol = Math.floor(Math.random() * cols);
        }
        if (count === diffValue) {
            let num = 2;
            board[randRow][randCol] = num
            const tile = document.getElementById(randRow.toString() + "-" + randCol.toString());
            setTile(tile, num);
            diffValue = Math.floor(Math.random() * 15);
            count = 0;
        } else {
            board[randRow][randCol] = 1;
            const tile = document.getElementById(randRow.toString() + "-" + randCol.toString());
            setTile(tile, 1);
            count++;
        }
    }
}

function setTile(tile, num) {
    tile.classList.value = "";
    tile.innerText = "";
    tile.classList.add("tile");
    if (num > 0) {
        if (num >= 28657) {
            tile.innerText = num;
            tile.classList.add("x28657");
        } else {
            tile.innerText = num;
            tile.classList.add("x" + num.toString());
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") {
        moved = true;
        moveLeft();
        checkFull();
    } else if (e.code === "ArrowRight") {
        moved = true;
        moveRight();
        checkFull();
    } else if (e.code === "ArrowUp") {
        moved = true;
        moveUp();
        checkFull();
    } else if (e.code === "ArrowDown") {
        moved = true;
        moveDown();
        checkFull();
    }
    document.getElementById("score").innerText = score;
})

function moveLeft() {
    for (let i = 0; i < rows; i++) {
        let row = board[i];
        let oldRow = [...row];
        row = slideLeft(row);

        if (moved !== false) {
            moved = checkSame(row, oldRow);
        }
        
        board[i] = row;

        for (let j = 0; j < cols; j++) {
            const tile = document.getElementById(i.toString() + "-" + j.toString());
            setTile(tile, board[i][j]);
        }
    }
    if (!moved) {
        setRandomTile();
    }
}

function slideLeft(row) {
    row = filterZeros(row);
    for (let i = 0; i < row.length; i++) {
        if (row.length === 1) {
            break;
        }
        if (map.has(row[i]) && map.get(row[i]).has(row[i + 1])) {
            row[i] += row[i + 1];
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZeros(row);
    row = addZeros(row);
    return row;
}

function moveRight() {
    for (let i = 0; i < rows; i++) {
        let row = board[i];
        let oldRow = [...row];
        row = slideRight(row);

        if (moved !== false) {
            moved = checkSame(row, oldRow);
        }

        board[i] = row;

        for (let j = 0; j < cols; j++) {
            const tile = document.getElementById(i.toString() + "-" + j.toString());
            setTile(tile, board[i][j]);
        }
    }
    if (!moved) {
        setRandomTile();
    }
}

function slideRight(row) {
    row = filterZeros(row);
    for (let i = row.length - 1; i >= 0; i--) {
        if (row.length === 1) {
            break;
        }
        if (map.has(row[i]) && map.get(row[i]).has(row[i - 1])) {
            row[i] += row[i - 1];
            row[i - 1] = 0;
            score += row[i]; 
        }
    }
    row = filterZeros(row);
    row = row.reverse();
    row = addZeros(row);
    row = row.reverse();
    return row;
}

function moveUp() {
    for (let i = 0; i < cols; i++) {
        let row = [board[0][i], board[1][i], board[2][i], board[3][i]];
        let oldRow = [...row];
        row = slideLeft(row);

        if (moved !== false) {
            moved = checkSame(row, oldRow);
        }
        
        board[0][i] = row[0];
        board[1][i] = row[1];
        board[2][i] = row[2];
        board[3][i] = row[3];

        for (let j = 0; j < rows; j++) {
            const tile = document.getElementById(j.toString() + "-" + i.toString());
            setTile(tile, board[j][i]);
        }
    }
    if (!moved) {
        setRandomTile();
    }
}

function moveDown() {
    for (let i = 0; i < cols; i++) {
        let row = [board[0][i], board[1][i], board[2][i], board[3][i]];
        let oldRow = [...row];
        row = slideRight(row);

        if (moved !== false) {
            moved = checkSame(row, oldRow);
        }

        board[0][i] = row[0];
        board[1][i] = row[1];
        board[2][i] = row[2];
        board[3][i] = row[3];

        for (let j = 0; j < rows; j++) {
            const tile = document.getElementById(j.toString() + "-" + i.toString());
            setTile(tile, board[j][i]);
        }
    }
    if (!moved) {
        setRandomTile();
    }
}

function filterZeros(row) {
    return row.filter((num) => num !== 0);
}

function addZeros(row) {
    while (row.length < cols) {
        row.push(0);
    }
    return row;
}

function checkSame(row1, row2) {
    return JSON.stringify(row1) === JSON.stringify(row2);
}

function checkFull() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    checkEndGame();
    return true;
}

function checkEndGame() {
    foundMove = false;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (checkMove(i, j)) {
                foundMove = true;
                break;
            }
        }
    }
    if (foundMove !== true) {
        endGame();
    }
}

function checkMove(row, col) {
    let tile = board[row][col];
    let tileRight = board[row][col + 1];
    if (row === 3) {
        if (col === 3) {
            return false;
        } else {
            if (map.get(tile).has(tileRight)) {
                return true;
            }
        }
    } else {
        let tileDown = board[row + 1][col];
        if (col === 3) {
            if (map.get(tile).has(tileDown)) {
                return true;
            }
        } else {
            if (map.get(tile).has(tileRight)) {
                return true;
            } else if (map.get(tile).has(tileDown)) {
                return true;
            }
        }
    }
    return false;
}

function restart() {
    if (score > getHighScore()) {
        setHighScore(score);
    }
    initializeGame();
}

function endGame() {
    const highScore = getHighScore();
    if (score > highScore) {
        setHighScore(highScore);
    }
    const endGame = document.getElementById("endGame");
    endGame.innerText = "Game Over! Press New Game To Restart!";
}

function getHighScore() {
    return localStorage.getItem('highScore') || 0;
}

function setHighScore(highScore) {
    return localStorage.setItem('highScore', highScore);
}