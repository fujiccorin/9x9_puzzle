/**
 * ============================================================
 * Pattern Builder
 * builder.js
 *
 * Phase 2-3A-1
 *  初期化・状態管理
 * ============================================================
 */

"use strict";

/* ============================================================
   アプリケーション状態
============================================================ */

const BuilderState = {

    /** 現在選択中のピース */
    selectedPiece: null,

    /** 盤面に配置済みピース */
    placedPieces: [],

    /** Undo用 */
    undoStack: [],

    /** Redo用 */
    redoStack: [],

    /** 9×9盤面 */
    board: [],

    /** pieces.jsから読み込んだ全ピース */
    pieces: [],

    /** クリック中フラグ */
    placing: false

};


/* ============================================================
   DOM
============================================================ */

const UI = {

    board: null,

    pieceList: null,

    selectedPiece: null,

    messageArea: null,

    placedCount: null,

    remainingCount: null,

    pieceTotal: null,

    count2: null,

    count3: null,

    count4: null,

    count5: null,

    undoButton: null,

    redoButton: null,

    resetButton: null,

    exportButton: null

};


/* ============================================================
   DOM取得
============================================================ */

function cacheDOM() {

    UI.board =
        document.getElementById("board");

    UI.pieceList =
        document.getElementById("piece-list");

    UI.selectedPiece =
        document.getElementById("selected-piece");

    UI.messageArea =
        document.getElementById("message-area");

    UI.placedCount =
        document.getElementById("placed-count");

    UI.remainingCount =
        document.getElementById("remaining-count");

    UI.pieceTotal =
        document.getElementById("piece-total");

    UI.count2 =
        document.getElementById("count-2");

    UI.count3 =
        document.getElementById("count-3");

    UI.count4 =
        document.getElementById("count-4");

    UI.count5 =
        document.getElementById("count-5");

    UI.undoButton =
        document.getElementById("undo-btn");

    UI.redoButton =
        document.getElementById("redo-btn");

    UI.resetButton =
        document.getElementById("reset-btn");

    UI.exportButton =
        document.getElementById("export-btn");

}


/* ============================================================
   初期メッセージ
============================================================ */

function initializeMessage() {

    UI.messageArea.textContent =
        "ピースを選択してください。";

    UI.selectedPiece.textContent =
        "なし";

}


/* ============================================================
   pieces.js 読み込み
============================================================ */

function loadPieces() {

    if (typeof generatePieces !== "function") {

        console.error(
            "generatePieces() が見つかりません。"
        );

        alert(
            "pieces.js の読み込みに失敗しました。"
        );

        return false;

    }

    BuilderState.pieces =
        generatePieces();

    console.log(
        "Loaded Pieces:",
        BuilderState.pieces.length
    );

    return true;

}


/* ============================================================
   初期化
============================================================ */

function initializeBuilder() {

    console.log(
        "Pattern Builder Start"
    );

    cacheDOM();

    initializeMessage();

    if (!loadPieces()) {

        return;

    }

    // 以降の処理は
    // Phase2-3A-2
    // Phase2-3A-3
    // で追加

}


/* ============================================================
   起動
============================================================ */

document.addEventListener(

    "DOMContentLoaded",

    initializeBuilder

);
