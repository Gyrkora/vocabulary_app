// File: games/crossword.js
// Backtracking crossword generator with auto‐focus on user input,
// and with clues now showing each word’s definition.
// This code generates a 15×15 grid, uses backtracking to place all words
// (sorted longest first), trims the grid to its bounding box, and renders it.
// When the user types a letter in a cell, focus automatically moves to the next cell in the active word.

import { getVocabularyFromLocalStorage } from '../utilities.js';

const GRID_SIZE = 15;
let grid = [];
let placements = []; // Each placement: { id, word, definition, row, col, direction }
let activeClueId = null; // The currently active placement ID

// --- Backtracking Crossword Generator Functions ---

function createEmptyGrid() {
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''));
}

function canPlaceWord(word, row, col, direction) {
    if (direction === 'across') {
        if (col + word.length > GRID_SIZE) return false;
    } else { // 'down'
        if (row + word.length > GRID_SIZE) return false;
    }
    for (let i = 0; i < word.length; i++) {
        let r = row, c = col;
        if (direction === 'across') c += i; else r += i;
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        let r = row, c = col;
        if (direction === 'across') c += i; else r += i;
        grid[r][c] = word[i];
    }
}

function removeWord(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        let r = row, c = col;
        if (direction === 'across') c += i; else r += i;
        if (grid[r][c] === word[i]) {
            grid[r][c] = '';
        }
    }
}

// For the first word, try fixed positions.
// For later words, only consider placements that overlap at least one nonblank cell.
function getCandidates(word) {
    const candidates = [];
    if (placements.length === 0) {
        candidates.push({
            row: Math.floor(GRID_SIZE / 2),
            col: Math.floor((GRID_SIZE - word.length) / 2),
            direction: 'across'
        });
        candidates.push({
            row: Math.floor((GRID_SIZE - word.length) / 2),
            col: Math.floor(GRID_SIZE / 2),
            direction: 'down'
        });
        return candidates;
    }
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            for (const direction of ['across', 'down']) {
                if (!canPlaceWord(word, row, col, direction)) continue;
                let intersects = false;
                for (let i = 0; i < word.length; i++) {
                    let r = row, c = col;
                    if (direction === 'across') c += i; else r += i;
                    if (grid[r][c] !== '') {
                        intersects = true;
                        break;
                    }
                }
                if (intersects) {
                    candidates.push({ row, col, direction });
                }
            }
        }
    }
    return candidates;
}

// Recursive backtracking function.
// 'words' is an array of objects: { word, definition } (all in uppercase for word)
function placeWordsBacktracking(words, index) {
    if (index === words.length) return true;
    const current = words[index];
    const candidates = getCandidates(current.word);
    for (const cand of candidates) {
        if (canPlaceWord(current.word, cand.row, cand.col, cand.direction)) {
            placeWord(current.word, cand.row, cand.col, cand.direction);
            placements.push({
                id: placements.length + 1,
                word: current.word,
                definition: current.definition,
                row: cand.row,
                col: cand.col,
                direction: cand.direction
            });
            if (placeWordsBacktracking(words, index + 1)) {
                return true;
            }
            removeWord(current.word, cand.row, cand.col, cand.direction);
            placements.pop();
        }
    }
    return false;
}

export function generateCrosswordBacktracking(wordList) {
    grid = createEmptyGrid();
    placements = [];
    // Convert vocabulary to an array of objects with uppercase word and definition.
    const words = wordList.map(v => ({
        word: v.word.toUpperCase(),
        definition: v.definition
    }));
    // Sort words by descending length.
    words.sort((a, b) => b.word.length - a.word.length);
    const success = placeWordsBacktracking(words, 0);
    return { success, grid, placements };
}

function getBoundingBox(grid) {
    let minRow = GRID_SIZE, maxRow = -1, minCol = GRID_SIZE, maxCol = -1;
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] !== '') {
                if (r < minRow) minRow = r;
                if (r > maxRow) maxRow = r;
                if (c < minCol) minCol = c;
                if (c > maxCol) maxCol = c;
            }
        }
    }
    return { minRow, maxRow, minCol, maxCol };
}

// --- Rendering & Auto-Focus Integration ---

export function startCrossword() {
    // 1) Retrieve vocabulary (assumed to be an array of objects { word, definition })
    const vocabulary = getVocabularyFromLocalStorage();
    if (vocabulary.length < 5 || vocabulary.length > 10) {
        alert("Crossword requires at least 5 words and a maximum of 10.");
        return;
    }
    // 2) Generate crossword using backtracking.
    const { success, grid: finalGrid, placements: placed } = generateCrosswordBacktracking(vocabulary);
    if (!success) {
        alert("Could not generate crossword with the given words.");
        return;
    }
    placements = placed; // Save placements globally for event listeners

    // 3) Compute bounding box.
    const { minRow, maxRow, minCol, maxCol } = getBoundingBox(finalGrid);

    // 4) Render the grid into #crossword-container.
    const crosswordContainer = document.getElementById('crossword-container');
    crosswordContainer.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'crossword-grid';

    // Helper: highlight active clue (adds CSS class "active-clue")
    function highlightActiveClue(clueId) {
        crosswordContainer.querySelectorAll('input.crossword-input').forEach(inp => {
            inp.classList.remove('active-clue');
        });
        crosswordContainer.querySelectorAll(`input.crossword-input[data-placements*="${clueId}"]`)
            .forEach(inp => {
                inp.classList.add('active-clue');
            });
    }

    for (let r = minRow; r <= maxRow; r++) {
        const tr = document.createElement('tr');
        for (let c = minCol; c <= maxCol; c++) {
            const td = document.createElement('td');
            const cellValue = finalGrid[r][c];
            if (cellValue !== '') {
                td.className = 'active-cell';
                const cellContainer = document.createElement('div');
                cellContainer.className = 'cell-container';
                cellContainer.style.position = 'relative';

                // Check if this cell is the start of any placement.
                const startingPlacements = placements.filter(p => p.row === r && p.col === c);
                if (startingPlacements.length > 0) {
                    const clueNumber = Math.min(...startingPlacements.map(p => p.id));
                    const clueSpan = document.createElement('span');
                    clueSpan.textContent = clueNumber;
                    clueSpan.className = 'clue-number';
                    clueSpan.style.position = 'absolute';
                    clueSpan.style.top = '0';
                    clueSpan.style.left = '0';
                    clueSpan.style.fontSize = '0.6em';
                    clueSpan.style.color = 'red';
                    cellContainer.appendChild(clueSpan);
                }

                // Create an input element.
                const input = document.createElement('input');
                input.maxLength = 1;
                input.dataset.gridRow = r;
                input.dataset.gridCol = c;
                input.value = '';
                input.className = 'crossword-input';

                // Keydown: if retyping, clear the cell.
                input.addEventListener('keydown', function (e) {
                    if (
                        input.value.length === 1 &&
                        e.key.length === 1 &&
                        !e.ctrlKey &&
                        !e.metaKey &&
                        !e.altKey
                    ) {
                        input.value = '';
                    }
                });

                // Click: set the active clue based on this cell.
                input.addEventListener('click', function () {
                    if (input.dataset.placements) {
                        const placementsArr = input.dataset.placements.split(',').map(Number);
                        activeClueId = placementsArr[0];
                        highlightActiveClue(activeClueId);
                    }
                });

                // Input: when a letter is typed, move focus to the next cell in the active clue.
                input.addEventListener('input', function () {
                    if (input.value.length !== 1) return;

                    if (input.dataset.placements) {
                        const placementsArr = input.dataset.placements.split(',').map(Number);
                        if (!activeClueId || !placementsArr.includes(activeClueId)) {
                            activeClueId = placementsArr[0];
                            highlightActiveClue(activeClueId);
                        }
                    }

                    if (activeClueId) {
                        const activePlacement = placements.find(p => p.id === activeClueId);
                        if (!activePlacement) return;
                        let nextRow, nextCol;
                        if (activePlacement.direction === 'across') {
                            const currentIndex = parseInt(input.dataset.gridCol) - activePlacement.col;
                            nextRow = activePlacement.row;
                            nextCol = activePlacement.col + currentIndex + 1;
                        } else {
                            const currentIndex = parseInt(input.dataset.gridRow) - activePlacement.row;
                            nextRow = activePlacement.row + currentIndex + 1;
                            nextCol = activePlacement.col;
                        }
                        const nextInput = crosswordContainer.querySelector(
                            `input[data-grid-row="${nextRow}"][data-grid-col="${nextCol}"]`
                        );
                        if (nextInput) {
                            nextInput.focus();
                        }
                    }
                });

                cellContainer.appendChild(input);
                td.appendChild(cellContainer);
            } else {
                td.className = 'inactive-cell';
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    crosswordContainer.appendChild(table);

    // 5) Mark each cell with its placement IDs.
    placements.forEach(p => {
        for (let i = 0; i < p.word.length; i++) {
            let rr = p.row, cc = p.col;
            if (p.direction === 'across') cc += i; else rr += i;
            if (rr < minRow || rr > maxRow || cc < minCol || cc > maxCol) continue;
            const cellInput = crosswordContainer.querySelector(
                `input[data-grid-row="${rr}"][data-grid-col="${cc}"]`
            );
            if (cellInput) {
                if (cellInput.dataset.placements) {
                    cellInput.dataset.placements += `,${p.id}`;
                } else {
                    cellInput.dataset.placements = `${p.id}`;
                }
            }
        }
    });

    // 6) Render clues using definitions instead of the words.
    const cluesContainer = document.getElementById('crossword-clues');
    cluesContainer.innerHTML = '';
    placements.forEach((p, idx) => {
        const clueNumber = idx + 1;
        const clueDiv = document.createElement('div');
        // Use the definition as the clue text.
        clueDiv.textContent = `${clueNumber}. ${p.definition}`;
        clueDiv.style.cursor = 'pointer';
        clueDiv.addEventListener('click', () => {
            activeClueId = p.id;
            highlightActiveClue(activeClueId);
            const firstInput = crosswordContainer.querySelector(
                `input[data-grid-row="${p.row}"][data-grid-col="${p.col}"]`
            );
            if (firstInput) firstInput.focus();
        });
        cluesContainer.appendChild(clueDiv);
    });

    // (Optional) You can add a "Check Crossword" button here to validate user input.
}
