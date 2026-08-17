/**
 * app.js
 * メインゲームアプリケーション
 * patterns.json からパターンデータを読み込んで、ゲームに反映
 */

// ゲーム状態
let gameState = {
    difficulty: null,       // 難易度
    kukuBoard: null,        // 九九表（正解用）
    gameBoard: null,        // ゲーム中のボード状態
    pieces: [],             // 配置するピース一覧
    startTime: null,        // ゲーム開始時刻
    timerInterval: null,    // タイマーのinterval ID
    draggedPiece: null,     // ドラッグ中のピース
    dragOffset: { x: 0, y: 0 },
    currentPattern: null    // 現在のパターン
};

/**
 * patterns.json からパターンデータを読み込む
 */
async function loadPatterns() {
    try {
        const response = await fetch('data/patterns.json');
        const data = await response.json();
        return data.patterns;
    } catch (error) {
        console.error('パターンの読み込みに失敗しました:', error);
        return [];
    }
}

/**
 * ランダムにパターンを選択
 */
function selectRandomPattern(patterns) {
    if (!patterns || patterns.length === 0) {
        console.error('利用可能なパターンがありません');
        return null;
    }
const randomIndex = Math.floor(Math.random() * patterns.length);
return patterns[randomIndex]; 

}

/**
 * パターンデータからピースを生成
 */
function createPiecesFromPattern(pattern) {
    if (!pattern || !pattern.pieces) {
        console.error('パターンデータが無効です');
        return [];
    }

    const pieces = pattern.pieces.map((pieceData) => {
        return {
            id: pieceData.id,
            type: pieceData.type,
            shape: pieceData.shape,
            numbers: pieceData.numbers,
            cells: pieceData.cells,
            placed: false,
            position: null
        };
    });

    // ピース順をランダム化
    pieces.sort(() => Math.random() - 0.5);

    return pieces;
}

/**
 * ゲーム初期化
 */
async function initGame() {
    // パターンデータを読み込む
    const patterns = await loadPatterns();
    const selectedPattern = selectRandomPattern(patterns);
    
    if (!selectedPattern) {
        alert('ゲームの初期化に失敗しました。パターンデータを確認してください。');
        return;
    }

    gameState.currentPattern = selectedPattern;
    gameState.kukuBoard = generateKukuBoard();
    gameState.gameBoard = initializeGameBoard();
    gameState.pieces = createPiecesFromPattern(selectedPattern);
    gameState.startTime = Date.now();
    
    // UI初期化
    renderBoard();
    renderPieces();
    startTimer();
    
    console.log(`パターン「${selectedPattern.name}」でゲーム開始！`);
}

/**
 * 九九表をレンダリング
 */
function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
const cell = document.createElement('div');
cell.className = 'cell';
cell.id = `cell-${row}-${col}`;
cell.textContent = '';

cell.addEventListener('dragover', (e) => {
    e.preventDefault();
});

cell.addEventListener('drop', (e) => {
    e.preventDefault();

    if (!gameState.draggedPiece) return;

    attemptPlacePiece(
        gameState.draggedPiece,
        row,
        col
    );
});

if (gameState.gameBoard[row][col] !== null) {
    cell.classList.add('filled');

    cell.textContent =
        gameState.gameBoard[row][col].number;
}

boardEl.appendChild(cell);
            
            if (gameState.gameBoard[row][col] !== null) {
                cell.classList.add('filled');
            }
            
            boardEl.appendChild(cell);
        }
    }
}

/**
 * ピースをレンダリング
 */
function renderPieces() {
    const container = document.getElementById('pieces-container');
    container.innerHTML = '';
    
    gameState.pieces.forEach((piece, index) => {
        if (piece.placed) return; // 既に配置済みならスキ���プ
        
        const pieceEl = document.createElement('div');
        pieceEl.className = 'piece';
        pieceEl.id = piece.id;
        pieceEl.draggable = true;
        
        // ピースのグリッド表示
        const gridEl = document.createElement('div');
        gridEl.className = 'piece-grid';
        
        // グリッドのサイズを決定
        let maxRow = 0, maxCol = 0;
        for (const [r, c] of piece.shape) {
            maxRow = Math.max(maxRow, r);
            maxCol = Math.max(maxCol, c);
        }
        
        gridEl.style.gridTemplateColumns = `repeat(${maxCol + 1}, 1fr)`;
        
        // セルを配置
        for (let r = 0; r <= maxRow; r++) {
            for (let c = 0; c <= maxCol; c++) {
                const cellEl = document.createElement('div');
                const shapeIndex = piece.shape.findIndex(([sr, sc]) => sr === r && sc === c);
                
                if (shapeIndex !== -1) {
                    cellEl.className = 'piece-cell';
                    cellEl.textContent = piece.numbers[shapeIndex];
                } else {
                    cellEl.style.visibility = 'hidden';
                }
                
                gridEl.appendChild(cellEl);
            }
        }
        
        const idEl = document.createElement('div');
        idEl.className = 'piece-id';
        idEl.textContent = piece.id;
        
        pieceEl.appendChild(gridEl);
        pieceEl.appendChild(idEl);
        
        // ドラッグイベント
        pieceEl.addEventListener('dragstart', (e) => handleDragStart(e, piece));
        pieceEl.addEventListener('dragend', (e) => handleDragEnd(e));
        pieceEl.addEventListener('touchstart', (e) => handleTouchStart(e, piece));
        pieceEl.addEventListener('touchmove', (e) => handleTouchMove(e));
        pieceEl.addEventListener('touchend', (e) => handleTouchEnd(e, piece));
        
        container.appendChild(pieceEl);
    });
}

/**
 * ドラッグ開始
 */
function handleDragStart(e, piece) {
    gameState.draggedPiece = piece;
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
}

/**
 * ドラッグ終了
 */
function handleDragEnd(e) {
    if (gameState.draggedPiece) {
        const el = document.getElementById(gameState.draggedPiece.id);
        if (el) {
            el.classList.remove('dragging');
        }
    }
    gameState.draggedPiece = null;
}

/**
 * タッチ開始（iPad用）
 */
function handleTouchStart(e, piece) {
    gameState.draggedPiece = piece;
    const touch = e.touches[0];
    const el = e.target.closest('.piece');
    const rect = el.getBoundingClientRect();

    const ghost = document.getElementById('ghost-piece');

ghost.innerHTML = el.innerHTML;

ghost.style.left =
`${touch.clientX + 30}px`;

ghost.style.top =
`${touch.clientY + 30}px`;

ghost.style.display = 'block';

    gameState.dragOffset = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
    document.querySelector('.pieces-section')
    .style.overflowY = 'hidden';
}

/**
 * タッチ移動
 */
function handleTouchMove(e) {
    if (!gameState.draggedPiece) return;

    const touch = e.touches[0];

    const ghost =
        document.getElementById('ghost-piece');

   ghost.style.left =
`${touch.clientX - gameState.dragOffset.x}px`;

ghost.style.top =
`${touch.clientY - gameState.dragOffset.y}px`;
}

/**
 * タッチ終了（iPad用）
 */
function handleTouchEnd(e, piece) {
    if (!gameState.draggedPiece) return;
    
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (targetElement && targetElement.classList.contains('cell')) {
        const cellId = targetElement.id;
        const match = cellId.match(/cell-(\d+)-(\d+)/);
        if (match) {
            const [_, row, col] = match;
            attemptPlacePiece(piece, parseInt(row), parseInt(col));
        }
    }
    const ghost =
    document.getElementById('ghost-piece');

    ghost.style.display = 'none';
    ghost.innerHTML = '';
    gameState.draggedPiece = null;
    document.querySelector('.pieces-section')
    .style.overflowY = 'auto';
}

/**
 * ピース配置の試行
 * パターンデータのcells配列と照合して配置可能か検証
 */
function attemptPlacePiece(piece, startRow, startCol) {
    // パターンの座標は1-indexedなので、0-indexedに変換
    const expectedCells = piece.cells.map(([r, c]) => [r - 1, c - 1]);
    
    // 実際に配置されるセルを計算
    const actualCells = piece.shape.map(([r, c]) => [startRow + r, startCol + c]);
    
    // 配置可能か確認（ボード内か、既に埋まっていないか）
    for (const [r, c] of actualCells) {
        if (r < 0 || r >= 9 || c < 0 || c >= 9) {
            alert('この位置には置けません！（ボード外です）');
            return;
        }
        
        if (gameState.gameBoard[r][c] !== null) {
            alert('この位置には置けません！（既に埋まっています）');
            return;
        }
    }
    
    // パターンのexpectedCellsと一致しているか確認
    const expectedSet = new Set(expectedCells.map(([r, c]) => `${r},${c}`));
    const actualSet = new Set(actualCells.map(([r, c]) => `${r},${c}`));
    
    if (expectedSet.size !== actualSet.size || ![...expectedSet].every(cell => actualSet.has(cell))) {
        alert('この位置は間違っています。もう一度考えてみてください！');
        return;
    }
    
    // ピースを配置
    for (let i = 0; i < piece.shape.length; i++) {
    const [r, c] = piece.shape[i];

    gameState.gameBoard[startRow + r][startCol + c] = {
        pieceId: piece.id,
        number: piece.numbers[i]
    };
}
    
    piece.placed = true;
    piece.position = { row: startRow, col: startCol };
    
    renderBoard();
    renderPieces();
    
    // 全てのピースが配置されたかチェック
    checkCompletion();
}

/**
 * ゲーム完了チェック
 */
function checkCompletion() {
    const allPlaced = gameState.pieces.every(p => p.placed);
    
    if (allPlaced) {
        stopTimer();
        showCompletionModal();
    }
}

/**
 * タイマー開始
 */
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeStr;
    }, 100);
}

/**
 * タイマー停止
 */
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

/**
 * 完了モーダル表示
 */
function showCompletionModal() {
    const difficultyLabel =
    gameState.difficulty === 'easy'
        ? 'かんたん'
        : 'ふつう';const modal = document.getElementById('completion-modal');
    const finalTimeEl = document.getElementById('final-time');
    const timerText = document.getElementById('timer').textContent;
    finalTimeEl.innerHTML =
    `🎉 ${difficultyLabel}クリア！<br>
     タイム: ${timerText}`;
    modal.classList.remove('hidden');
}

/**
 * ゲームリセット
 */
function resetGame() {
    stopTimer();
    gameState = {
        kukuBoard: null,
        gameBoard: null,
        pieces: [],
        startTime: null,
        timerInterval: null,
        draggedPiece: null,
        dragOffset: { x: 0, y: 0 },
        currentPattern: null
    };
    document.getElementById('completion-modal').classList.add('hidden');
    initGame();
}

/**
 * 9×9の九九表を生成
 */
function generateKukuBoard() {
    const board = [];
    for (let row = 0; row < 9; row++) {
        const line = [];
        for (let col = 0; col < 9; col++) {
            line.push((row + 1) * (col + 1));
        }
        board.push(line);
    }
    return board;
}

/**
 * ゲーム用のボード（配置状態）を初期化
 */
function initializeGameBoard() {
    const board = [];
    for (let row = 0; row < 9; row++) {
        const line = [];
        for (let col = 0; col < 9; col++) {
            line.push(null);
        }
        board.push(line);
    }
    return board;
}

/**
 * リセットボタンイベント
 */
document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    // ゲーム開始
    const easyBtn = document.getElementById('easy-btn');
    const normalBtn = document.getElementById('normal-btn');

if (easyBtn) {
    easyBtn.addEventListener('click', () => {
        gameState.difficulty = 'easy';

        document
            .getElementById('start-screen')
            .style.display = 'none';

        initGame();
    });
}

if (normalBtn) {
    normalBtn.addEventListener('click', () => {
        gameState.difficulty = 'normal';

        document
            .getElementById('start-screen')
            .style.display = 'none';

        initGame();
    });
}

if (startBtn) {
    startBtn.addEventListener(
        'click',
        () => {

            document
                .getElementById('start-screen')
                .style.display = 'none';

            initGame();
        }
    );
}
});
