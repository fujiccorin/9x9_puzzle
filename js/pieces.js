/**
 * pieces.js
 * ピース定義とロジック
 * 
 * ピースは以下の形から構成される：
 * - 2マス: Domino（1×2 or 2×1）
 * - 3マス: I（1×3 or 3×1）, L（ブーメラン型）
 * - 4マス: テトリスピース全て（I, O, T, S, Z, L, J）
 * - 5マス: 大ブーメラン型, I（1×5 or 5×1）
 */

// ピース定義
// 各ピースは、相対座標（row, col）と数値で表現される
// 例: [[[0,0,3], [0,1,6], [0,2,9]]] は 1×3 の横長で「3の段」

const PIECES_DEFINITIONS = {
    // 2マス - Domino
    domino_h: { // 横長ドミノ
        shapes: [
            [[0, 0], [0, 1]]
        ],
        numbers: [
            [2, 4], [3, 6], [4, 8], [5, 10], [6, 12], [7, 14], [8, 16], [9, 18]
        ],
        name: "Domino (Horizontal)"
    },
    domino_v: { // 縦長ドミノ
        shapes: [
            [[0, 0], [1, 0]]
        ],
        numbers: [
            [2, 4], [3, 6], [4, 8], [5, 10], [6, 12], [7, 14], [8, 16], [9, 18]
        ],
        name: "Domino (Vertical)"
    },

    // 3マス - I（1×3）
    i_3_h: { // 横長
        shapes: [
            [[0, 0], [0, 1], [0, 2]]
        ],
        numbers: [
            [2, 4, 6], [3, 6, 9], [4, 8, 12], [5, 10, 15], [6, 12, 18]
        ],
        name: "I-3 (Horizontal)"
    },
    i_3_v: { // 縦長
        shapes: [
            [[0, 0], [1, 0], [2, 0]]
        ],
        numbers: [
            [2, 4, 6], [3, 6, 9], [4, 8, 12], [5, 10, 15], [6, 12, 18]
        ],
        name: "I-3 (Vertical)"
    },

    // 3マス - L（ブーメラン型）
    l_3: {
        shapes: [
            [[0, 0], [0, 1], [1, 1]],  // 右上向き
            [[0, 0], [1, 0], [1, 1]],  // 右下向き
            [[0, 1], [1, 0], [1, 1]],  // 左下向き
            [[0, 0], [0, 1], [1, 0]]   // 左上向き
        ],
        numbers: [
            [2, 4, 6], [3, 6, 9], [4, 8, 12], [5, 10, 15], [6, 12, 18]
        ],
        name: "L-3 (Boomerang)"
    },

    // 4マス - テトリスピース

    // I（1×4）
    i_4_h: {
        shapes: [
            [[0, 0], [0, 1], [0, 2], [0, 3]]
        ],
        numbers: [
            [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16], [5, 10, 15, 20], [6, 12, 18, 24]
        ],
        name: "I-4 (Horizontal)"
    },
    i_4_v: {
        shapes: [
            [[0, 0], [1, 0], [2, 0], [3, 0]]
        ],
        numbers: [
            [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16], [5, 10, 15, 20], [6, 12, 18, 24]
        ],
        name: "I-4 (Vertical)"
    },

    // O（2×2）
    o_4: {
        shapes: [
            [[0, 0], [0, 1], [1, 0], [1, 1]]
        ],
        numbers: [
            [2, 4, 4, 8], [3, 6, 6, 12]
        ],
        name: "O (Square)"
    },

    // T（T字）
    t_4: {
        shapes: [
            [[0, 1], [1, 0], [1, 1], [1, 2]],  // 上向き
            [[0, 0], [1, 0], [1, 1], [2, 0]],  // 左向き
            [[0, 0], [0, 1], [0, 2], [1, 1]],  // 下向き
            [[0, 1], [1, 0], [1, 1], [2, 1]]   // 右向き
        ],
        numbers: [
            [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16], [5, 10, 15, 20], [6, 12, 18, 24]
        ],
        name: "T-4"
    },

    // S（S字）
    s_4: {
        shapes: [
            [[0, 1], [0, 2], [1, 0], [1, 1]],  // 横S
            [[0, 0], [1, 0], [1, 1], [2, 1]]   // 縦S
        ],
        numbers: [
            [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16], [5, 10, 15, 20], [6, 12, 18, 24]
        ],
        name: "S-4"
    },

    // Z（Z字）
    z_4: {
        shapes: [
            [[0, 0], [0, 1], [1, 1], [1, 2]],  // 横Z
            [[0, 1], [1, 0], [1, 1], [2, 0]]   // 縦Z
        ],
        numbers: [
            [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16], [5, 10, 15, 20], [6, 12, 18, 24]
        ],
        name: "Z-4"
    },

    // L（L字）
    l_4: {
        shapes: [
            [[0, 0], [1, 0], [2, 0], [2, 1]],  // 右向き
            [[0, 1], [1, 1], [2, 0], [2, 1]],  // 上向き
            [[0, 0], [0, 1], [1, 1], [2, 1]],  // 左向き
            [[0, 0], [0, 1], [1, 0], [2, 0]]   // 下向き
        ],
        numbers: [
            [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16], [5, 10, 15, 20], [6, 12, 18, 24]
        ],
        name: "L-4"
    },

    // J（J字）
    j_4: {
        shapes: [
            [[0, 1], [1, 1], [2, 0], [2, 1]],  // 左向き
            [[0, 0], [1, 0], [2, 0], [2, 1]],  // 下向き
            [[0, 0], [0, 1], [1, 0], [2, 0]],  // 右向き
            [[0, 0], [0, 1], [1, 1], [2, 1]]   // 上向き
        ],
        numbers: [
            [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16], [5, 10, 15, 20], [6, 12, 18, 24]
        ],
        name: "J-4"
    },

    // 5マス - I（1×5）
    i_5_h: {
        shapes: [
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
        ],
        numbers: [
            [2, 4, 6, 8, 10], [3, 6, 9, 12, 15]
        ],
        name: "I-5 (Horizontal)"
    },
    i_5_v: {
        shapes: [
            [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]
        ],
        numbers: [
            [2, 4, 6, 8, 10], [3, 6, 9, 12, 15]
        ],
        name: "I-5 (Vertical)"
    },

    // 5マス - 大ブーメラン型（P型）
    p_5: {
        shapes: [
            [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0]],  // 左向き
            [[0, 0], [1, 0], [1, 1], [2, 0], [2, 1]],  // 右向き
            [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2]],  // 上向き
            [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2]]   // 下向き
        ],
        numbers: [
            [2, 4, 6, 8, 10], [3, 6, 9, 12, 15]
        ],
        name: "P-5 (Big Boomerang)"
    }
};

/**
 * ピース定義から、実際のピースオブジェクトを生成
 */
function generatePieces() {
    const pieces = [];
    let pieceId = 0;

    for (const [key, definition] of Object.entries(PIECES_DEFINITIONS)) {
        for (const numberSet of definition.numbers) {
            for (const shape of definition.shapes) {
                pieces.push({
                    id: `piece_${pieceId++}`,
                    key: key,
                    shape: shape,
                    numbers: numberSet,
                    name: definition.name,
                    placed: false,
                    position: null // {row, col} ゲーム中に設定
                });
            }
        }
    }

    return pieces;
}

/**
 * ピースが置ける位置を検証
 * @param {Array} shape - ピースの形（相対座標の配列）
 * @param {Array} numbers - ピースの数字
 * @param {number} startRow - 配置開始行
 * @param {number} startCol - 配置開始列
 * @param {Array} board - 9x9のボード状態
 * @returns {boolean} 配置可能かどうか
 */
function canPlacePiece(shape, numbers, startRow, startCol, board) {
    // ボード外に出ていないか確認
    for (const [r, c] of shape) {
        const actualRow = startRow + r;
        const actualCol = startCol + c;
        
        if (actualRow < 0 || actualRow >= 9 || actualCol < 0 || actualCol >= 9) {
            return false;
        }
        
        // 既に埋まっているか確認
        if (board[actualRow][actualCol] !== null) {
            return false;
        }
    }
    
    return true;
}

/**
 * ピースが正しい位置に置かれているか検証
 * @param {Array} shape - ピースの形
 * @param {Array} numbers - ピースの数字
 * @param {number} startRow - 配置開始行
 * @param {number} startCol - 配置開始列
 * @param {Array} expectedValues - その位置に来るべき九九の答え（配列）
 * @returns {boolean} 正しい位置か
 */
function isCorrectPlacement(shape, numbers, startRow, startCol, expectedValues) {
    // shapeの順序と、numbersの順序が対応している
    for (let i = 0; i < shape.length; i++) {
        const [r, c] = shape[i];
        const actualRow = startRow + r;
        const actualCol = startCol + c;
        
        // expectedValuesは2次元配列として九九表を表現している
        if (expectedValues[actualRow][actualCol] !== numbers[i]) {
            return false;
        }
    }
    
    return true;
}

/**
 * 9×9の九九表を生成
 * @returns {Array} 9×9の配列（[1][1]=1, [9][9]=81）
 */
function generateKukuBoard() {
    const board = [];
    for (let row = 0; row < 9; row++) {
        const line = [];
        for (let col = 0; col < 9; col++) {
            // row, col は 0-indexed なので、+1 して計算
            line.push((row + 1) * (col + 1));
        }
        board.push(line);
    }
    return board;
}

/**
 * ゲーム用のボード（配置状態）を初期化
 * @returns {Array} 9×9の配列（null で初期化）
 */
function initializeGameBoard() {
    const board = [];
    for (let row = 0; row < 9; row++) {
        const line = [];
        for (let col = 0; col < 9; col++) {
            line.push(null); // 未配置
        }
        board.push(line);
    }
    return board;
}
