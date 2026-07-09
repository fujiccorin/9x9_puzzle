/**
 * ============================================================
 * Pattern Builder
 * builder.js
 *
 * Phase 2-3A-1 to 2-3A-3
 *  初期化・状態管理・ピース一覧・ピース選択
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
   9×9盤面生成
============================================================ */

function initializeBoard() {

    BuilderState.board = [];

    for (let row = 0; row < 9; row++) {

        const line = [];

        for (let col = 0; col < 9; col++) {

            line.push(null);

        }

        BuilderState.board.push(line);

    }

    console.log("Board Initialized");

}


/* ============================================================
   統計情報初期化
============================================================ */

function initializeStatistics() {

    if (UI.placedCount) {
        UI.placedCount.textContent = "0";
    }

    if (UI.remainingCount) {
        UI.remainingCount.textContent = "81";
    }

    if (UI.pieceTotal) {
        UI.pieceTotal.textContent = "0";
    }

    if (UI.count2) {
        UI.count2.textContent = "0";
    }

    if (UI.count3) {
        UI.count3.textContent = "0";
    }

    if (UI.count4) {
        UI.count4.textContent = "0";
    }

    if (UI.count5) {
        UI.count5.textContent = "0";
    }

}


/* ============================================================
   ピース一覧生成
============================================================ */

function getPieceSize(piece) {

    return piece.shape.length;

}


function updatePieceStatistics() {

    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;

    BuilderState.pieces.forEach(piece => {

        switch (piece.shape.length) {

            case 2:
                count2++;
                break;

            case 3:
                count3++;
                break;

            case 4:
                count4++;
                break;

            case 5:
                count5++;
                break;

        }

    });

    UI.pieceTotal.textContent =
        BuilderState.pieces.length;

    UI.count2.textContent =
        count2;

    UI.count3.textContent =
        count3;

    UI.count4.textContent =
        count4;

    UI.count5.textContent =
        count5;

}


function createPieceButton(piece) {

    const button =
        document.createElement("button");

    button.className =
        "piece-button";

    button.dataset.id =
        piece.id;

    button.textContent =
        `${piece.id} (${piece.shape.length}マス)`;

    button.addEventListener(

        "click",

        () => {

            selectPiece(piece.id);

        }

    );

    return button;

}


function renderPieceList() {

    UI.pieceList.innerHTML = "";

    BuilderState.pieces.forEach(piece => {

        UI.pieceList.appendChild(

            createPieceButton(piece)

        );

    });

    updatePieceStatistics();

}


/* ============================================================
   ピース選択
============================================================ */

function selectPiece(pieceId) {

    BuilderState.selectedPiece =

        BuilderState.pieces.find(

            piece => piece.id === pieceId

        );

    document

        .querySelectorAll(".piece-button")

        .forEach(button => {

            button.classList.remove("selected");

        });

    const selected =

        document.querySelector(

            `[data-id="${pieceId}"]`

        );

    if (selected) {

        selected.classList.add("selected");

    }

    UI.selectedPiece.textContent =

        BuilderState.selectedPiece.name;

    UI.messageArea.textContent =

        "盤面上をクリックして配置します。";

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

    initializeBoard();
    initializeStatistics();
    renderPieceList();

}


/* ============================================================
   起動
============================================================ */

document.addEventListener(

    "DOMContentLoaded",

    initializeBuilder

);
