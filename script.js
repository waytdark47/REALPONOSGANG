const gameBoard = document.getElementById('game-board');
const flagsCountEl = document.getElementById('flags-count');
const minesCountEl = document.getElementById('mines-count');
const messageEl = document.getElementById('message');
const difficultySelect = document.getElementById('difficulty');
const restartBtn = document.getElementById('restart-btn');

let board = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let rows = 9;
let cols = 9;
let mines = 10;
let flagsPlaced = 0;
let firstClick = true;

const difficulties = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
};

function initGame() {
    const diff = difficulties[difficultySelect.value];
    rows = diff.rows;
    cols = diff.cols;
    mines = diff.mines;
    
    gameOver = false;
    firstClick = true;
    flagsPlaced = 0;
    board = [];
    revealed = [];
    flagged = [];
    
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        revealed[i] = [];
        flagged[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = 0;
            revealed[i][j] = false;
            flagged[i][j] = false;
        }
    }
    
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 32px)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 32px)`;
    
    updateUI();
    renderBoard();
    messageEl.textContent = '';
    messageEl.className = 'message';
}

function placeMines(excludeRow, excludeCol) {
    let placed = 0;
    while (placed < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        
        if (board[row][col] !== -1 && !(row === excludeRow && col === excludeCol)) {
            board[row][col] = -1;
            placed++;
        }
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === -1) continue;
            
            let count = 0;
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    const ni = i + di;
                    const nj = j + dj;
                    if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && board[ni][nj] === -1) {
                        count++;
                    }
                }
            }
            board[i][j] = count;
        }
    }
}

function revealCell(row, col) {
    if (revealed[row][col] || flagged[row][col] || gameOver) return;
    
    revealed[row][col] = true;
    const cell = gameBoard.children[row * cols + col];
    cell.classList.add('revealed');
    
    if (board[row][col] === -1) {
        cell.classList.add('mine');
        cell.textContent = '💣';
        endGame(false);
        return;
    }
    
    if (board[row][col] > 0) {
        cell.textContent = board[row][col];
        cell.setAttribute('data-number', board[row][col]);
    } else {
        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                const ni = row + di;
                const nj = col + dj;
                if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                    revealCell(ni, nj);
                }
            }
        }
    }
    
    checkWin();
}

function toggleFlag(row, col) {
    if (revealed[row][col] || gameOver) return;
    
    const cell = gameBoard.children[row * cols + col];
    
    if (flagged[row][col]) {
        flagged[row][col] = false;
        cell.classList.remove('flagged');
        cell.textContent = '';
        flagsPlaced--;
    } else {
        flagged[row][col] = true;
        cell.classList.add('flagged');
        cell.textContent = '🚩';
        flagsPlaced++;
    }
    
    updateUI();
}

function updateUI() {
    flagsCountEl.textContent = flagsPlaced;
    minesCountEl.textContent = mines - flagsPlaced;
}

function checkWin() {
    let unrevealed = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!revealed[i][j]) unrevealed++;
        }
    }
    
    if (unrevealed === mines) {
        endGame(true);
    }
}

function endGame(won) {
    gameOver = true;
    
    if (won) {
        messageEl.textContent = '🎉 Поздравляем! Вы выиграли!';
        messageEl.className = 'message win';
    } else {
        messageEl.textContent = '💥 Игра окончена! Вы проиграли.';
        messageEl.className = 'message lose';
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === -1 && !revealed[i][j]) {
                    const cell = gameBoard.children[i * cols + j];
                    cell.classList.add('revealed', 'mine');
                    cell.textContent = '💣';
                }
            }
        }
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            cell.addEventListener('click', () => {
                if (firstClick) {
                    firstClick = false;
                    placeMines(i, j);
                }
                revealCell(i, j);
            });
            
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(i, j);
            });
            
            gameBoard.appendChild(cell);
        }
    }
}

difficultySelect.addEventListener('change', initGame);
restartBtn.addEventListener('click', initGame);

initGame();