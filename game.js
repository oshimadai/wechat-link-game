/**
 * 1V1 连线桌游 - 微信小游戏
 * 版本：v1.0 - 首发版
 * 规则版本：完整规则书
 * 日期：2026-03-13
 */

const CONFIG = {
  WIN_SCORE: 40,
  HAND_SIZE: 5,
  CARD_SIZE: 70,
  CARD_GAP: 8,
  ATTRS: ['fire', 'water', 'wood', 'wild'],
  ARROWS: ['↑', '→', '↓', '←'],
  ATTR_EMOJIS: {
    fire: '🔥',
    water: '💧',
    wood: '🌿',
    wild: '🌈'
  },
  SCORE_RULES: {
    '4': 1,
    '3': 2,
    '2': 3,
    '1': 0,
    '∞': 1
  }
}

const FIXED_DECK = [
  { attr: 'fire', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '↑', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '↑', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '↓', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '↓', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'fire', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'fire', hp: 3, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'fire', hp: 3, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'fire', hp: 3, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'fire', hp: 3, score: 2, arrow: '←', abilityId: 3 },
  { attr: 'fire', hp: 3, score: 2, arrow: '←', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'fire', hp: 3, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'fire', hp: 3, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'fire', hp: 2, score: 3, arrow: '→', abilityId: 1 },
  { attr: 'fire', hp: 2, score: 3, arrow: '↑', abilityId: 2 },
  { attr: 'fire', hp: 2, score: 3, arrow: '↓', abilityId: 3 },
  { attr: 'fire', hp: 1, score: 0, arrow: '←', abilityId: 1 },
  { attr: 'fire', hp: '∞', score: 1, arrow: '↑', abilityId: null },
  { attr: 'fire', hp: '∞', score: 1, arrow: '↓', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '↑', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '↑', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '↓', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '↓', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'water', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'water', hp: 3, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 3, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'water', hp: 3, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'water', hp: 3, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'water', hp: 3, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'water', hp: 3, score: 2, arrow: '←', abilityId: 3 },
  { attr: 'water', hp: 3, score: 2, arrow: '←', abilityId: 1 },
  { attr: 'water', hp: 3, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'water', hp: 3, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'water', hp: 3, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'water', hp: 3, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'water', hp: 2, score: 3, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 2, score: 3, arrow: '↑', abilityId: 2 },
  { attr: 'water', hp: 2, score: 3, arrow: '↓', abilityId: 3 },
  { attr: 'water', hp: 1, score: 0, arrow: '←', abilityId: 1 },
  { attr: 'water', hp: '∞', score: 1, arrow: '↑', abilityId: null },
  { attr: 'water', hp: '∞', score: 1, arrow: '↓', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '→', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '↑', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '↑', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '↓', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '↓', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'wood', hp: 4, score: 1, arrow: '←', abilityId: null },
  { attr: 'wood', hp: 3, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 2, arrow: '←', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 2, arrow: '←', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'wood', hp: 2, score: 3, arrow: '→', abilityId: 1 },
  { attr: 'wood', hp: 2, score: 3, arrow: '↑', abilityId: 2 },
  { attr: 'wood', hp: 2, score: 3, arrow: '↓', abilityId: 3 },
  { attr: 'wood', hp: 1, score: 0, arrow: '←', abilityId: 1 },
  { attr: 'wood', hp: '∞', score: 1, arrow: '↑', abilityId: null },
  { attr: 'wood', hp: '∞', score: 1, arrow: '↓', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '→', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '↑', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '↓', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '←', abilityId: null },
]

let gameState = {
  player1: { hand: [], deck: [], score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } },
  player2: { hand: [], deck: [], score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } },
  currentPlayer: 1,
  round: 1,
  selectedCard: null,
  abilityTarget1: null,
  abilityTarget2: null,
  waitingForAbility: false,
  waitingForChain: false,
  chainCards: [],
  triggeredCards: [],
  gameOver: false,
  gameLog: []
}

const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

const { windowWidth, windowHeight, safeArea } = wx.getSystemInfoSync()
canvas.width = windowWidth
canvas.height = windowHeight

const safeTop = safeArea ? safeArea.top : 20
const safeBottom = safeArea ? (windowHeight - safeArea.bottom) : 20
const safeLeft = safeArea ? safeArea.left : 10
const safeRight = safeArea ? (windowWidth - safeArea.right) : 10

console.log(`🔗 1V1 连线桌游 v1.0 - Canvas: ${canvas.width}x${canvas.height}`)

function createCard(data) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    attr: data.attr,
    hp: data.hp,
    maxHp: data.hp,
    score: data.score,
    arrow: data.arrow,
    triggered: false,
    ability: data.abilityId ? { id: data.abilityId, name: ['旋转', '变色', '换位'][data.abilityId - 1], icon: ['🔄', '🎨', '💫'][data.abilityId - 1] } : null,
    attrEmoji: CONFIG.ATTR_EMOJIS[data.attr],
    width: CONFIG.CARD_SIZE,
    height: CONFIG.CARD_SIZE
  }
}

function generateDeck() {
  const deck = FIXED_DECK.map(data => createCard(data))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
  return deck
}

function initGame() {
  console.log('🔗 1V1 连线桌游 v1.0 - 初始化')
  
  gameState.player1 = { hand: [], deck: generateDeck(), score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } }
  gameState.player2 = { hand: [], deck: generateDeck(), score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } }
  
  for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
    if (gameState.player1.deck.length > 0) gameState.player1.hand.push(gameState.player1.deck.pop())
    if (gameState.player2.deck.length > 0) gameState.player2.hand.push(gameState.player2.deck.pop())
  }
  
  gameState.currentPlayer = 1
  gameState.round = 1
  gameState.selectedCard = null
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  gameState.waitingForAbility = false
  gameState.waitingForChain = false
  gameState.chainCards = []
  gameState.triggeredCards = []
  gameState.gameOver = false
  gameState.gameLog = ['🎮 游戏开始！点击卡牌触发']
  
  render()
}

function refillHand(player) {
  while (player.hand.length < CONFIG.HAND_SIZE && player.deck.length > 0) {
    player.hand.push(player.deck.pop())
  }
}

function addLog(message) {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  gameState.gameLog.unshift(`[${timestamp}] ${message}`)
  if (gameState.gameLog.length > 50) gameState.gameLog.pop()
  render()
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#2C3E50'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🔗 1V1 连线桌游 v1.0', canvas.width / 2, safeTop + 20)
  
  const cardSize = CONFIG.CARD_SIZE
  const cardGap = CONFIG.CARD_GAP
  const totalWidth = CONFIG.HAND_SIZE * cardSize + (CONFIG.HAND_SIZE - 1) * cardGap
  const startX = (canvas.width - totalWidth) / 2
  
  // 玩家 1 区域（上方）
  const player1Y = safeTop + 50
  const isPlayer1Turn = gameState.currentPlayer === 1
  ctx.fillStyle = isPlayer1Turn ? '#FFD700' : '#666666'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 玩家 1`, startX + totalWidth / 2, player1Y - 10)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.fillText(`${gameState.player1.score}分 | 扣：${gameState.player1.penalty}`, startX + totalWidth / 2, player1Y + 8)
  
  // 玩家 1 手牌（横向一排）
  gameState.player1.hand.forEach((card, index) => {
    if (card) drawCard(card, startX + index * (cardSize + cardGap), player1Y, 'down')
  })
  
  // 中间信息
  const middleY = player1Y + cardSize + 30
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`回合：${gameState.round}`, canvas.width / 2, middleY)
  
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 20px Arial'
  ctx.fillText(`▶ 玩家${gameState.currentPlayer} ◀`, canvas.width / 2, middleY + 25)
  
  if (gameState.waitingForAbility && gameState.selectedCard) {
    const ability = gameState.selectedCard.card.ability
    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`${ability.icon} ${ability.name}: 点击目标卡牌`, canvas.width / 2, middleY + 50)
  }
  
  if (gameState.waitingForChain && gameState.chainCards.length > 0) {
    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`点击继续连线`, canvas.width / 2, middleY + 50)
  }
  
  if (gameState.selectedCard && !gameState.waitingForAbility && !gameState.waitingForChain) {
    ctx.fillStyle = '#FF6B6B'
    ctx.fillRect(canvas.width / 2 - 50, middleY + 35, 100, 30)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 14px Arial'
    ctx.fillText('❌ 取消', canvas.width / 2, middleY + 55)
  }
  
  // 玩家 2 区域（下方）
  const player2Y = middleY + cardSize + 40
  const isPlayer2Turn = gameState.currentPlayer === 2
  ctx.fillStyle = isPlayer2Turn ? '#FFD700' : '#666666'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 玩家 2`, startX + totalWidth / 2, player2Y - 10)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.fillText(`${gameState.player2.score}分 | 扣：${gameState.player2.penalty}`, startX + totalWidth / 2, player2Y + 8)
  
  // 玩家 2 手牌（横向一排）
  gameState.player2.hand.forEach((card, index) => {
    if (card) drawCard(card, startX + index * (cardSize + cardGap), player2Y, 'up')
  })
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(canvas.width / 2 - 120, player2Y + cardSize + 10, 240, 40)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '10px Arial'
  ctx.textAlign = 'left'
  gameState.gameLog.slice(0, 2).forEach((log, index) => {
    ctx.fillText(log.substring(0, 18), canvas.width / 2 - 110, player2Y + cardSize + 25 + index * 12)
  })
  
  ctx.fillStyle = '#AAAAAA'
  ctx.font = '11px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('点击卡牌 • 上下可连对手 • 左右穿空位', canvas.width / 2, player2Y + cardSize + 55)
}

function drawCard(card, x, y, direction) {
  ctx.save()
  
  const centerX = x + card.width / 2
  const centerY = y + card.height / 2
  
  if (direction === 'down') {
    ctx.translate(centerX, centerY)
    ctx.rotate(Math.PI)
    ctx.translate(-centerX, -centerY)
  } else if (direction === 'up') {
    // 不旋转
  }
  
  const colors = {
    fire: '#FF6464',
    water: '#6464FF',
    wood: '#64FF64',
    wild: '#2C2C2C'
  }
  ctx.fillStyle = colors[card.attr] || '#FFFFFF'
  ctx.fillRect(x, y, card.width, card.height)
  
  const isSelected = gameState.selectedCard && gameState.selectedCard.card === card
  ctx.strokeStyle = isSelected ? '#FFD700' : '#FFFFFF'
  ctx.lineWidth = isSelected ? 4 : 2
  ctx.strokeRect(x, y, card.width, card.height)
  
  if (card.triggered) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(x, y, card.width, card.height)
  }
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(card.attrEmoji, x + card.width / 2, y + 24)
  
  ctx.font = 'bold 36px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(card.arrow, x + card.width / 2, y + card.height / 2 + 12)
  
  ctx.font = 'bold 10px Arial'
  ctx.textAlign = 'left'
  const hpText = card.hp === '∞' ? '∞' : `HP:${card.hp}`
  ctx.fillText(hpText, x + 4, y + 14)
  
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(`+${card.score}`, x + card.width / 2, y + card.height - 10)
  
  if (card.ability) {
    ctx.font = '14px Arial'
    ctx.fillText(card.ability.icon, x + card.width - 12, y + 14)
  }
  
  ctx.restore()
}

wx.onTouchStart((res) => {
  if (gameState.gameOver) return
  
  const touch = res.touches[0]
  const x = touch.clientX
  const y = touch.clientY
  
  const cardSize = CONFIG.CARD_SIZE
  const cardGap = CONFIG.CARD_GAP
  const totalWidth = CONFIG.HAND_SIZE * cardSize + (CONFIG.HAND_SIZE - 1) * cardGap
  const startX = (canvas.width - totalWidth) / 2
  
  const player1Y = safeTop + 50
  const middleY = player1Y + cardSize + 30
  const player2Y = middleY + cardSize + 40
  
  if (gameState.selectedCard && !gameState.waitingForAbility && !gameState.waitingForChain) {
    if (x >= canvas.width / 2 - 50 && x <= canvas.width / 2 + 50 &&
        y >= middleY + 35 && y <= middleY + 65) {
      cancelSelection()
      return
    }
  }
  
  gameState.player1.hand.forEach((card, index) => {
    const cardX = startX + index * (cardSize + cardGap)
    if (x >= cardX && x <= cardX + cardSize && y >= player1Y && y <= player1Y + cardSize) {
      handleCardClick(1, index)
    }
  })
  
  gameState.player2.hand.forEach((card, index) => {
    const cardX = startX + index * (cardSize + cardGap)
    if (x >= cardX && x <= cardX + cardSize && y >= player2Y && y <= player2Y + cardSize) {
      handleCardClick(2, index)
    }
  })
})

function handleCardClick(player, index) {
  if (gameState.gameOver) return
  
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card || card.triggered) return
  
  if (gameState.waitingForAbility && gameState.selectedCard) {
    handleAbilityTarget(player, index)
    return
  }
  
  if (gameState.waitingForChain && gameState.chainCards.length > 0) {
    continueChain(player, index)
    return
  }
  
  gameState.selectedCard = { player, index, card }
  addLog(`选择了 ${card.attrEmoji}`)
  
  if (card.ability) {
    gameState.waitingForAbility = true
    addLog(`使用能力：${card.ability.icon} ${card.ability.name}`)
  } else {
    triggerCard(player, index)
    checkChain(player, index)
  }
  
  render()
}

function triggerCard(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card || card.triggered) return
  
  card.triggered = true
  gameState.triggeredCards.push({ ...card })
  
  const points = card.score
  if (player === 1) gameState.player1.score += points
  else gameState.player2.score += points
  
  addLog(`触发 ${card.attrEmoji} +${points}分`)
}

function checkChain(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card) return
  
  const arrow = card.arrow
  let nextIndex = null
  
  if (arrow === '←') {
    for (let i = index - 1; i >= 0; i--) {
      if (hand[i]) {
        if (!hand[i].triggered && (card.attr === hand[i].attr || card.attr === 'wild' || hand[i].attr === 'wild')) {
          nextIndex = i
          break
        } else if (hand[i].triggered) {
          continue
        } else {
          break
        }
      }
    }
  } else if (arrow === '→') {
    for (let i = index + 1; i < hand.length; i++) {
      if (hand[i]) {
        if (!hand[i].triggered && (card.attr === hand[i].attr || card.attr === 'wild' || hand[i].attr === 'wild')) {
          nextIndex = i
          break
        } else if (hand[i].triggered) {
          continue
        } else {
          break
        }
      }
    }
  } else if (arrow === '↑' || arrow === '↓') {
    const opponentHand = player === 1 ? gameState.player2.hand : gameState.player1.hand
    nextIndex = index
    
    if (opponentHand[nextIndex] && !opponentHand[nextIndex].triggered &&
        (card.attr === opponentHand[nextIndex].attr || card.attr === 'wild' || opponentHand[nextIndex].attr === 'wild')) {
      gameState.waitingForChain = true
      gameState.chainCards = [{ player: player === 1 ? 2 : 1, index: nextIndex, isOpponent: true }]
      addLog(`点击对手${opponentHand[nextIndex].attrEmoji}继续连线`)
      render()
      return
    }
  }
  
  if (nextIndex !== null) {
    gameState.waitingForChain = true
    gameState.chainCards = [{ player, index }]
    addLog(`点击${hand[nextIndex].attrEmoji}继续连线`)
  } else {
    endTurn(player)
  }
  
  render()
}

function continueChain(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card) return
  
  triggerCard(player, index)
  checkChain(player, index)
}

function endTurn(player) {
  addLog(`--- 回合结束 ---`)
  
  // 衰减阶段：血量 -1 + 箭头旋转
  applyDecay(gameState.player1.hand)
  applyDecay(gameState.player2.hand)
  
  // 补充手牌
  refillHand(gameState.player1)
  refillHand(gameState.player2)
  
  // 检查胜利
  if (gameState.player1.score >= CONFIG.WIN_SCORE || gameState.player2.score >= CONFIG.WIN_SCORE) {
    gameState.gameOver = true
    const winner = gameState.player1.score >= CONFIG.WIN_SCORE ? '玩家 1' : '玩家 2'
    const winScore = gameState.player1.score >= CONFIG.WIN_SCORE ? gameState.player1.score : gameState.player2.score
    addLog(`🎉 ${winner}获胜！${winScore}分`)
  } else {
    if (gameState.currentPlayer === 1) {
      gameState.currentPlayer = 2
    } else {
      gameState.currentPlayer = 1
      gameState.round++
    }
    addLog(`回合 ${gameState.round} - 玩家${gameState.currentPlayer}`)
  }
  
  gameState.selectedCard = null
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  gameState.waitingForAbility = false
  gameState.waitingForChain = false
  gameState.chainCards = []
  
  render()
}

function handleAbilityTarget(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const targetCard = hand[index]
  if (!targetCard) return
  
  const ability = gameState.selectedCard.card.ability
  
  if (ability.id === 1) {
    const arrowMap = { '↑': '→', '→': '↓', '↓': '←', '←': '↑' }
    targetCard.arrow = arrowMap[targetCard.arrow]
    addLog(`${ability.icon} 旋转 ${targetCard.attrEmoji}`)
    gameState.waitingForAbility = false
    triggerCard(gameState.selectedCard.player, gameState.selectedCard.index)
    checkChain(gameState.selectedCard.player, gameState.selectedCard.index)
  } else if (ability.id === 2) {
    targetCard.attr = gameState.selectedCard.card.attr
    targetCard.attrEmoji = gameState.selectedCard.card.attrEmoji
    addLog(`${ability.icon} ${targetCard.attrEmoji} 变色`)
    gameState.waitingForAbility = false
    triggerCard(gameState.selectedCard.player, gameState.selectedCard.index)
    checkChain(gameState.selectedCard.player, gameState.selectedCard.index)
  } else if (ability.id === 3) {
    if (!gameState.abilityTarget1) {
      gameState.abilityTarget1 = { player, index, card: targetCard }
      addLog('请选择第二张牌')
    } else {
      const target2 = gameState.abilityTarget1
      const temp = { ...hand[target2.index] }
      hand[target2.index] = { ...targetCard }
      hand[index] = { ...temp }
      addLog(`${ability.icon} 交换位置`)
      gameState.waitingForAbility = false
      gameState.abilityTarget1 = null
      triggerCard(gameState.selectedCard.player, gameState.selectedCard.index)
      checkChain(gameState.selectedCard.player, gameState.selectedCard.index)
    }
  }
  
  render()
}

function cancelSelection() {
  gameState.selectedCard = null
  gameState.waitingForAbility = false
  gameState.waitingForChain = false
  gameState.chainCards = []
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  addLog('❌ 取消选择')
  render()
}

function applyDecay(hand) {
  const arrowMap = { '↑': '→', '→': '↓', '↓': '←', '←': '↑' }
  
  hand.forEach(card => {
    if (!card.triggered && card.hp !== '∞') {
      // 箭头顺时针旋转 90°
      card.arrow = arrowMap[card.arrow]
      
      // 血量 -1
      const newHp = typeof card.hp === 'number' ? card.hp - 1 : card.hp
      if (newHp <= 0) {
        card.hp = 0
        card.triggered = true
        if (card.maxHp > 0) {
          const player = hand === gameState.player1.hand ? gameState.player1 : gameState.player2
          player.penalty += 1
          addLog(`☠️ ${card.attrEmoji} 死亡 -1 分`)
        }
      } else {
        card.hp = newHp
      }
    }
  })
}

function gameLoop() {
  render()
  requestAnimationFrame(gameLoop)
}

initGame()
gameLoop()
