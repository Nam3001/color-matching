import {
  getGameBackground,
  getGameOverlays,
  getGameTimerItem,
  getPlayBtn,
  getGameResult
} from './section.js'

import { getRandomColor } from './util.js'
import { PAIR_COUNT, GAME_TIME, GAME_STATE } from './constant.js'

let gameState = GAME_STATE.PENDING

let randomColorList = getRandomColor(PAIR_COUNT)

const overlayList = getGameOverlays()

let backgroundGame = getGameBackground()

let gameResult = getGameResult()

const playBtn = getPlayBtn()

function loadGame() {
  backgroundGame.style.backgroundColor = randomColorList[6]
  playBtn.style.backgroundColor = randomColorList[6]
}
loadGame()

// disable click when color flipped
overlayList.forEach((overlay, order) => {
  overlay.style.backgroundColor = randomColorList[order]
  overlay.addEventListener('click', (e) => {
    e.stopPropagation()
  })
})

function startGame() {
  let timerDisplay = getGameTimerItem()
  if (gameState === GAME_STATE.PLAYING) {
    timerDisplay.classList.add('active')
    timerDisplay.textContent = `${GAME_TIME}s`
  }

  // flip color
  let firstFlippedItem = null
  let firstColor = null
  const handleOverlayClick = (e) => {
    const flipped = e.target.firstElementChild
    flipped.classList.add('active')
    if (!firstFlippedItem) {
      firstFlippedItem = flipped
      firstColor = firstFlippedItem.style.backgroundColor
      return
    }

    // if color match
    const newFlippedColor = flipped.style.backgroundColor
    const newFlippedItem = flipped
    if (newFlippedColor === firstColor) {
      backgroundGame.style.backgroundColor = newFlippedColor
      
      if(checkWinner()) {
        gameState = GAME_STATE.FINISHED
        handleFinishGame(gameState)
      }
      firstFlippedItem = null
      firstColor = null
      return
    }

    // if color not match case
    setTimeout(() => {
      firstFlippedItem.classList.toggle('active')
      newFlippedItem.classList.toggle('active')

      firstFlippedItem = null
      firstColor = null
    }, 300)
  }
  
  document.querySelectorAll('.game-board > li').forEach((item) => {
    item.addEventListener('click', handleOverlayClick)
  })

  function checkWinner() {
    let isWinner = Array.from(overlayList).every((overlay) => {
      return overlay.classList.contains('active')
    })
    if (!isWinner) return isWinner
    if (intervalId)
      clearInterval(intervalId)
    return isWinner
  }

  function handleFinishGame(status) {
    let isWinner = checkWinner()
    if (status !== GAME_STATE.FINISHED) return

    gameResult.classList.add('active')
    timerDisplay.classList.remove('active')
    removeEventListener('click', handleOverlayClick)
    
    playBtn.textContent = 'Play again'
    playBtn.classList.add('active')
    playBtn.style.backgroundColor = backgroundGame.style.backgroundColor

    document.querySelectorAll('.game-board > li').forEach((item) => {
      item.removeEventListener('click', handleOverlayClick)
    })

    if (isWinner) {
      gameResult.textContent = 'You win!'
    } else {
      gameResult.textContent = 'Game Over!'
    }
  }

  let timer = GAME_TIME
  const intervalId = setInterval(() => {
    timer--
    timerDisplay.textContent = `${timer}s`
    if (timer <= 0) {
      clearInterval(intervalId)
      gameState = GAME_STATE.FINISHED
      handleFinishGame(gameState)
    }
  }, 1000)
}

playBtn.addEventListener('click', (e) => {
  e.target.classList.remove('active')
  gameResult.classList.toggle('active')
  
  if (gameState === GAME_STATE.FINISHED) {
    randomColorList = getRandomColor(PAIR_COUNT)
    overlayList.forEach((overlay, i) => {
      overlay.classList.remove('active')
      overlay.style.backgroundColor = randomColorList[i]
    })
  }

  gameState = GAME_STATE.PLAYING
  startGame()
})