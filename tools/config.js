/**
 * config.js
 * Pattern Builder - 汎用設定ファイル
 * 
 * 複数のパズルタイプに対応するための設定管理
 */

// ===== 九九パズル設定 =====
const KUKU_CONFIG = {
    name: '九九パズル',
    type: 'kuku',
    boardSize: 9,
    totalCells: 81,
    
    // ピース定義（pieces.js から参照）
    pieces: [
        // 2マス
        { key: 'domino_h', label: 'Domino 横', shapes: [[[0, 0], [0, 1]]] },
        { key: 'domino_v', label: 'Domino 縦', shapes: [[[0, 0], [1, 0]]] },
        
        // 3マス
        { key: 'i_3_h', label: 'I3 横', shapes: [[[0, 0], [0, 1], [0, 2]]] },
        { key: 'i_3_v', label: 'I3 縦', shapes: [[[0, 0], [1, 0], [2, 0]]] },
        { 
            key: 'l_3', 
            label: 'L3', 
            shapes: [
                [[0, 0], [0, 1], [1, 1]],  // 右上向き
                [[0, 0], [1, 0], [1, 1]],  // 右下向き
                [[0, 1], [1, 0], [1, 1]],  // 左下向き
                [[0, 0], [0, 1], [1, 0]]   // 左上向き
            ]
        },
        
        // 4マス
        { key: 'i_4_h', label: 'I4 横', shapes: [[[0, 0], [0, 1], [0, 2], [0, 3]]] },
        { key: 'i_4_v', label: 'I4 縦', shapes: [[[0, 0], [1, 0], [2, 0], [3, 0]]] },
        { key: 'o_4', label: 'O (2×2)', shapes: [[[0, 0], [0, 1], [1, 0], [1, 1]]] },
        {
            key: 't_4',
            label: 'T',
            shapes: [
                [[0, 1], [1, 0], [1, 1], [1, 2]],  // 上向き
                [[0, 0], [1, 0], [1, 1], [2, 0]],  // 左向き
                [[0, 0], [0, 1], [0, 2], [1, 1]],  // 下向き
                [[0, 1], [1, 0], [1, 1], [2, 1]]   // 右向き
            ]
        },
        {
            key: 's_4',
            label: 'S',
            shapes: [
                [[0, 1], [0, 2], [1, 0], [1, 1]],  // 横S
                [[0, 0], [1, 0], [1, 1], [2, 1]]   // 縦S
            ]
        },
        {
            key: 'z_4',
            label: 'Z',
            shapes: [
                [[0, 0], [0, 1], [1, 1], [1, 2]],  // 横Z
                [[0, 1], [1, 0], [1, 1], [2, 0]]   // 縦Z
            ]
        },
        {
            key: 'l_4',
            label: 'L',
            shapes: [
                [[0, 0], [1, 0], [2, 0], [2, 1]],  // 右向き
                [[0, 1], [1, 1], [2, 0], [2, 1]],  // 上向き
                [[0, 0], [0, 1], [1, 1], [2, 1]],  // 左向き
                [[0, 0], [0, 1], [1, 0], [2, 0]]   // 下向き
            ]
        },
        {
            key: 'j_4',
            label: 'J',
            shapes: [
                [[0, 1], [1, 1], [2, 0], [2, 1]],  // 左向き
                [[0, 0], [1, 0], [2, 0], [2, 1]],  // 下向き
                [[0, 0], [0, 1], [1, 0], [2, 0]],  // 右向き
                [[0, 0], [0, 1], [1, 1], [2, 1]]   // 上向き
            ]
        },
        
        // 5マス
        { key: 'i_5_h', label: 'I5 横', shapes: [[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]] },
        { key: 'i_5_v', label: 'I5 縦', shapes: [[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]] },
        {
            key: 'p_5',
            label: 'P',
            shapes: [
                [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0]],  // 左向き
                [[0, 0], [1, 0], [1, 1], [2, 0], [2, 1]],  // 右向き
                [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2]],  // 上向き
                [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2]]   // 下向き
            ]
        }
    ],
    
    // 九九表の値を計算
    getCellValue: (row, col) => (row + 1) * (col + 1),
    
    // 座標の妥当性チェック
    isValidCell: (row, col) => row >= 0 && row < 9 && col >= 0 && col < 9,
    
    // 隣接チェック（オプション：将来使用）
    isAdjacent: (cell1, cell2) => {
        const [r1, c1] = cell1;
        const [r2, c2] = cell2;
        return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
    }
};

// ===== ピース色パレット（ランダムに割り当て） =====
const PIECE_COLORS = [
    '#FF6B6B',  // 赤
    '#4ECDC4',  // 青緑
    '#FFE66D',  // 黄
    '#95E1D3',  // 緑
    '#C7CEEA',  // 紫
    '#FFDAB9',  // オレンジ
    '#FF8C94',  // ピンク
    '#A8D8EA',  // 水色
    '#AA96DA',  // 薄紫
    '#FCBAD3'   // 薄ピンク
];

// ===== デフォルト設定 =====
const DEFAULT_CONFIG = KUKU_CONFIG;

/**
 * ランダムに色を選択
 */
function getRandomColor() {
    return PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)];
}

/**
 * ピース定義から指定キーを検索
 */
function getPieceDefinition(pieceKey) {
    return DEFAULT_CONFIG.pieces.find(p => p.key === pieceKey);
}

/**
 * ピースの全ての方向を取得
 */
function getPieceShapes(pieceKey) {
    const piece = getPieceDefinition(pieceKey);
    return piece ? piece.shapes : [];
}
