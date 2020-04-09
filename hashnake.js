import {Food} from './food.js';
import {Snake} from './snake.js';
import {Screen} from './screen.js';
import * as Rules  from './rules.js';

const REFRESH_TIME = 100; //15 FPS

let food = undefined;
let snake = undefined;
let screen = undefined;
let movement = undefined;
let playerOnGame = false;

$(document).ready(() => {
    window.addEventListener("orientationchange", () => handleOrientationChange());

    $('.up-arrow').on('click', () => handleArrowButton(Rules.UP));
    $('.down-arrow').on('click', () => handleArrowButton(Rules.DOWN));
    $('.left-arrow').on('click', () => handleArrowButton(Rules.LEFT));
    $('.right-arrow').on('click', () => handleArrowButton(Rules.RIGHT));

    playGame(true/*first time*/);
});

$(document).keydown((e) => {
    let newMove = e.key;

    console.log(e.code);
    if (e.code === 'Space' && !screen.isDisplayingAnimation && !playerOnGame) {
        continueGame();
    }

    if (Rules.movementIsAllowed(newMove, movement)) {
        movement = newMove;
        e.preventDefault(); //Prevent the default action (scroll)
    }
});

function handleArrowButton(newMove) {
    if (Rules.movementIsAllowed(newMove, movement))
        movement = newMove;
}

function initializeGame() {
    movement = Rules.RIGHT;
    screen = new Screen($('#screen'), window);
    food = new Food(screen.bounds);
    snake = new Snake(screen.snakeBeginPosition);
}

async function playGame(firstTime) {
    initializeGame();
    if (firstTime)
        await screen.drawIntroPoster();
    else
        await screen.drawGameOverPoster();
}

function continueGame() {
    playerOnGame = true;
    setTimeout(() => {
        screen.clear();
        screen.drawFood(food);
        snake.move(movement, screen.cellSide);
        if (snake.ate(food)) {
            food = new Food(screen.bounds);
            snake.grow();
        }
        screen.drawSnake(snake);
        if (Rules.snakeIsAlive(snake, screen))
            continueGame();
        else
            restartGame();
    }, REFRESH_TIME);
}

async function restartGame() {
    playerOnGame = false;
    playGame(false/*first time*/);
}

function handleOrientationChange() {
    location.reload();
}