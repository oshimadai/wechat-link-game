/**
 * 1V1 连线桌游 - 微信小游戏
 * 版本：v1.0 - 首发版
 * 平台：微信小程序
 * 日期：2026-03-13
 * 
 * 核心规则:
 * - 3×3 棋盘布局
 * - 箭头指向决定连线
 * - 同属性才能连线
 * - 未触发卡牌每回合 -1 血
 */

const CONFIG = {
  WIN_SCORE: 30,
  HAND_SIZE: 5,
  BOARD_SIZE: 3,  // 3×3 棋盘
  CARD_SIZE: 80,
  CARD_GAP: 8,
  ATTRS: ['fire', 'water', 'wood', 'wild'],
  ARROWS: ['↑', '→', '↓', '←'],
  ATTR_EMOJIS: {
    fire: '🔥',
    water: '💧',
    wood: '🌿',
    wild: '🌈'
  },
  ABILITIES: [
    { id: 1, name: '旋转', icon: '🔄', desc: '选择一张牌顺时针旋转 90°' },
    { id: 2, name: '变色', icon: '🎨', desc: '选择一张牌变为激活卡牌的属性' },
    { id: 3, name: '换位', icon: '💫', desc: '选择两张牌交换位置' }
  ]
}

const FIXED_DECK = [
  { attr: 'fire', hp: 3, score: 1, arrow: '→', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 1, arrow: '→', abilityId: 2 },
  { attr: 'fire', hp: 3, score: 1, arrow: '→', abilityId: 3 },
  { attr: 'fire', hp: 3, score: 1, arrow: '↑', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 1, arrow: '↑', abilityId: 2 },
  { attr: 'fire', hp: 3, score: 1, arrow: '↓', abilityId: 3 },
  { attr: 'fire', hp: 3, score: 1, arrow: '↓', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 1, arrow: '←', abilityId: 2 },
  { attr: 'fire', hp: 3, score: 1, arrow: '←', abilityId: 3 },
  { attr: 'fire', hp: 3, score: 1, arrow: '←', abilityId: 1 },
  { attr: 'fire', hp: 2, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'fire', hp: 2, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'fire', hp: 2, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'fire', hp: 2, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'fire', hp: 2, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'fire', hp: 2, score: 2, arrow: '←', abilityId: 3 },
  { attr: 'fire', hp: 2, score: 2, arrow: '←', abilityId: 1 },
  { attr: 'fire', hp: 1, score: 3, arrow: '→', abilityId: 1 },
  { attr: 'fire', hp: 1, score: 3, arrow: '↑', abilityId: 2 },
  { attr: 'fire', hp: 1, score: 3, arrow: '↓', abilityId: 3 },
  { attr: 'fire', hp: 0, score: 0, arrow: '←', abilityId: 1 },
  { attr: 'fire', hp: '∞', score: 1, arrow: '→', abilityId: null },
  { attr: 'water', hp: 3, score: 1, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 3, score: 1, arrow: '→', abilityId: 2 },
  { attr: 'water', hp: 3, score: 1, arrow: '→', abilityId: 3 },
  { attr: 'water', hp: 3, score: 1, arrow: '↑', abilityId: 1 },
  { attr: 'water', hp: 3, score: 1, arrow: '↑', abilityId: 2 },
  { attr: 'water', hp: 3, score: 1, arrow: '↓', abilityId: 3 },
  { attr: 'water', hp: 3, score: 1, arrow: '↓', abilityId: 1 },
  { attr: 'water', hp: 3, score: 1, arrow: '←', abilityId: 2 },
  { attr: 'water', hp: 3, score: 1, arrow: '←', abilityId: 3 },
  { attr: 'water', hp: 3, score: 1, arrow: '←', abilityId: 1 },
  { attr: 'water', hp: 2, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 2, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'water', hp: 2, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'water', hp: 2, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'water', hp: 2, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'water', hp: 2, score: 2, arrow: '←', abilityId: 3 },
  { attr: 'water', hp: 2, score: 2, arrow: '←', abilityId: 1 },
  { attr: 'water', hp: 1, score: 3, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 1, score: 3, arrow: '↑', abilityId: 2 },
  { attr: 'water', hp: 1, score: 3, arrow: '↓', abilityId: 3 },
  { attr: 'water', hp: 0, score: 0, arrow: '←', abilityId: 1 },
  { attr: 'water', hp: '∞', score: 1, arrow: '→', abilityId: null },
  { attr: 'wood', hp: 3, score: 1, arrow: '→', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 1, arrow: '→', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 1, arrow: '→', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 1, arrow: '↑', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 1, arrow: '↑', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 1, arrow: '↓', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 1, arrow: '↓', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 1, arrow: '←', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 1, arrow: '←', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 1, arrow: '←', abilityId: 1 },
  { attr: 'wood', hp: 2, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'wood', hp: 2, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'wood', hp: 2, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'wood', hp: 2, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'wood', hp: 2, score: 2, arrow: '←', abilityId: 2 },
  { attr: 'wood', hp: 2, score: 2, arrow: '←', abilityId: 3 },
  { attr: 'wood', hp: 2, score: 2, arrow: '←', abilityId: 1 },
  { attr: 'wood', hp: 1, score: 3, arrow: '→', abilityId: 1 },
  { attr: 'wood', hp: 1, score: 3, arrow: '↑', abilityId: 2 },
  { attr: 'wood', hp: 1, score: 3, arrow: '↓', abilityId: 3 },
  { attr: 'wood', hp: 0, score: 0, arrow: '←', abilityId: 1 },
  { attr: 'wood', hp: '∞', score: 1, arrow: '→', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '→', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '↑', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '↓', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '←', abilityId: null },
]

let gameState = {
  player1: { board: [], deck: [], score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } },
  player2: { board: [], deck: [], score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } },
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
    ability: data.abilityId ? CONFIG.ABILITIES.find(a => a.id === data.abilityId) : null,
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
  
  gameState.player1 = { board: createEmptyBoard(), deck: generateDeck(), score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } }
  gameState.player2 = { board: createEmptyBoard(), deck: generateDeck(), score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } }
  
  refillBoard(gameState.player1)
  refillBoard(gameState.player2)
  
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

function createEmptyBoard() {
  const board = []
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    board[row] = []
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      board[row][col] = null
    }
  }
  return board
}

function refillBoard(player) {
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      if (!player.board[row][col] && player.deck.length > 0) {
        player.board[row][col] = player.deck.pop()
      }
    }
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
  
  // 背景
  ctx.fillStyle = '#2C3E50'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 标题
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🔗 1V1 连线桌游 v1.0', canvas.width / 2, safeTop + 20)
  
  const cardSize = CONFIG.CARD_SIZE
  const cardGap = CONFIG.CARD_GAP
  const boardPixelSize = CONFIG.BOARD_SIZE * cardSize + (CONFIG.BOARD_SIZE - 1) * cardGap
  
  // 玩家 1 区域（上半部分）
  const player1Y = safeTop + 50
  const player1BoardX = (canvas.width / 2 - 20 - boardPixelSize) / 2
  
  const isPlayer1Turn = gameState.currentPlayer === 1
  ctx.fillStyle = isPlayer1Turn ? '#FFD700' : '#666666'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 玩家 1`, player1BoardX + boardPixelSize / 2, player1Y - 10)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.fillText(`${gameState.player1.score}分 | 扣：${gameState.player1.penalty}`, player1BoardX + boardPixelSize / 2, player1Y + 8)
  
  // 绘制玩家 1 棋盘
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      const card = gameState.player1.board[row][col]
      if (card) {
        const x = player1BoardX + col * (cardSize + cardGap)
        const y = player1Y + row * (cardSize + cardGap)
        drawCard(card, x, y, 'down')  // 玩家 1 卡牌顶部朝下（朝向中线）
      }
    }
  }
  
  // 玩家 2 区域（下半部分）
  const player2Y = player1Y + boardPixelSize + 80
  const player2BoardX = (canvas.width / 2 + 20 + boardPixelSize) / 2 - boardPixelSize
  
  const isPlayer2Turn = gameState.currentPlayer === 2
  ctx.fillStyle = isPlayer2Turn ? '#FFD700' : '#666666'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 玩家 2`, player2BoardX + boardPixelSize / 2, player2Y - 10)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.fillText(`${gameState.player2.score}分 | 扣：${gameState.player2.penalty}`, player2BoardX + boardPixelSize / 2, player2Y + 8)
  
  // 绘制玩家 2 棋盘
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      const card = gameState.player2.board[row][col]
      if (card) {
        const x = player2BoardX + col * (cardSize + cardGap)
        const y = player2Y + row * (cardSize + cardGap)
        drawCard(card, x, y, 'up')  // 玩家 2 卡牌顶部朝上（朝向中线）
      }
    }
  }
  
  // 中间信息
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`回合：${gameState.round}`, canvas.width / 2, player1Y + boardPixelSize + 35)
  
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 20px Arial'
  ctx.fillText(`▶ 玩家${gameState.currentPlayer} ◀`, canvas.width / 2, player1Y + boardPixelSize + 60)
  
  // 能力提示
  if (gameState.waitingForAbility && gameState.selectedCard) {
    const ability = gameState.selectedCard.card.ability
    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`${ability.icon} ${ability.name}: 点击目标卡牌`, canvas.width / 2, player1Y + boardPixelSize + 85)
  }
  
  // 取消按钮
  if (gameState.selectedCard && !gameState.waitingForAbility && !gameState.waitingForChain) {
    ctx.fillStyle = '#FF6B6B'
    ctx.fillRect(canvas.width / 2 - 50, player1Y + boardPixelSize + 70, 100, 30)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 14px Arial'
    ctx.fillText('❌ 取消', canvas.width / 2, player1Y + boardPixelSize + 90)
  }
  
  // 游戏日志
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(canvas.width / 2 - 120, canvas.height - safeBottom - 55, 240, 45)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '10px Arial'
  ctx.textAlign = 'left'
  gameState.gameLog.slice(0, 2).forEach((log, index) => {
    ctx.fillText(log.substring(0, 20), canvas.width / 2 - 110, canvas.height - safeBottom - 40 + index * 13)
  })
  
  ctx.fillStyle = '#AAAAAA'
  ctx.font = '11px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('点击卡牌 • 箭头连线', canvas.width / 2, canvas.height - safeBottom - 10)
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
  
  // 背景
  const colors = {
    fire: '#FF6464',
    water: '#6464FF',
    wood: '#64FF64',
    wild: '#2C2C2C'
  }
  ctx.fillStyle = colors[card.attr] || '#FFFFFF'
  ctx.fillRect(x, y, card.width, card.height)
  
  // 边框
  const isSelected = gameState.selectedCard && gameState.selectedCard.card === card
  ctx.strokeStyle = isSelected ? '#FFD700' : '#FFFFFF'
  ctx.lineWidth = isSelected ? 4 : 2
  ctx.strokeRect(x, y, card.width, card.height)
  
  // 已触发标记
  if (card.triggered) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(x, y, card.width, card.height)
  }
  
  // 属性
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(card.attrEmoji, x + card.width / 2, y + 24)
  
  // 箭头
  ctx.font = 'bold 36px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(card.arrow, x + card.width / 2, y + card.height / 2 + 12)
  
  // 血量
  ctx.font = 'bold 10px Arial'
  ctx.textAlign = 'left'
  const hpText = card.hp === '∞' ? '∞' : `HP:${card.hp}`
  ctx.fillText(hpText, x + 4, y + 14)
  
  // 分数
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(`+${card.score}`, x + card.width / 2, y + card.height - 10)
  
  // 能力图标
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
  const boardPixelSize = CONFIG.BOARD_SIZE * cardSize + (CONFIG.BOARD_SIZE - 1) * cardGap
  
  // 玩家 1 区域
  const player1Y = safeTop + 50
  const player1BoardX = (canvas.width / 2 - 20 - boardPixelSize) / 2
  
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      const card = gameState.player1.board[row][col]
      if (card) {
        const cardX = player1BoardX + col * (cardSize + cardGap)
        const cardY = player1Y + row * (cardSize + cardGap)
        if (x >= cardX && x <= cardX + cardSize && y >= cardY && y <= cardY + cardSize) {
          handleCardClick(1, row, col)
          return
        }
      }
    }
  }
  
  // 玩家 2 区域
  const player2Y = player1Y + boardPixelSize + 80
  const player2BoardX = (canvas.width / 2 + 20 + boardPixelSize) / 2 - boardPixelSize
  
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      const card = gameState.player2.board[row][col]
      if (card) {
        const cardX = player2BoardX + col * (cardSize + cardGap)
        const cardY = player2Y + row * (cardSize + cardGap)
        if (x >= cardX && x <= cardX + cardSize && y >= cardY && y <= cardY + cardSize) {
          handleCardClick(2, row, col)
          return
        }
      }
    }
  }
  
  // 取消按钮
  if (gameState.selectedCard && !gameState.waitingForAbility && !gameState.waitingForChain) {
    if (x >= canvas.width / 2 - 50 && x <= canvas.width / 2 + 50 &&
        y >= player1Y + boardPixelSize + 70 && y <= player1Y + boardPixelSize + 100) {
      cancelSelection()
    }
  }
})

function handleCardClick(player, row, col) {
  if (gameState.gameOver) return
  
  const board = player === 1 ? gameState.player1.board : gameState.player2.board
  const card = board[row][col]
  
  if (!card || card.triggered) return
  
  if (gameState.waitingForAbility && gameState.selectedCard) {
    handleAbilityTarget(player, row, col)
    return
  }
  
  gameState.selectedCard = { player, row, col, card }
  addLog(`选择了 ${card.attrEmoji}`)
  
  if (card.ability) {
    gameState.waitingForAbility = true
    addLog(`使用能力：${card.ability.icon} ${card.ability.name}`)
  } else {
    triggerCard(player, row, col)
    checkChain(player, row, col)
  }
  
  render()
}

function triggerCard(player, row, col) {
  const board = player === 1 ? gameState.player1.board : gameState.player2.board
  const card = board[row][col]
  
  if (!card || card.triggered) return
  
  card.triggered = true
  gameState.triggeredCards.push({ ...card })
  
  const points = card.score
  if (player === 1) gameState.player1.score += points
  else gameState.player2.score += points
  
  addLog(`触发 ${card.attrEmoji} +${points}分`)
}

function checkChain(player, row, col) {
  const board = player === 1 ? gameState.player1.board : gameState.player2.board
  const card = board[row][col]
  
  if (!card) return
  
  const arrow = card.arrow
  let nextRow = row
  let nextCol = col
  
  // 根据箭头方向找下一张牌
  if (arrow === '↑') nextRow = row - 1
  else if (arrow === '↓') nextRow = row + 1
  else if (arrow === '←') nextCol = col - 1
  else if (arrow === '→') nextCol = col + 1
  
  // 检查是否在棋盘内
  if (nextRow < 0 || nextRow >= CONFIG.BOARD_SIZE || nextCol < 0 || nextCol >= CONFIG.BOARD_SIZE) {
    endTurn(player)
    return
  }
  
  const nextCard = board[nextRow][nextCol]
  
  // 检查是否有牌
  if (!nextCard) {
    endTurn(player)
    return
  }
  
  // 检查是否已触发
  if (nextCard.triggered) {
    endTurn(player)
    return
  }
  
  // 检查属性是否匹配
  const isMatch = card.attr === nextCard.attr || card.attr === 'wild' || nextCard.attr === 'wild'
  
  if (isMatch) {
    gameState.waitingForChain = true
    gameState.chainCards = [{ player, row, col }]
    addLog(`点击${nextCard.attrEmoji}继续连线`)
  } else {
    endTurn(player)
  }
  
  render()
}

function continueChain(player, row, col) {
  const board = player === 1 ? gameState.player1.board : gameState.player2.board
  const card = board[row][col]
  
  if (!card) return
  
  triggerCard(player, row, col)
  checkChain(player, row, col)
}

function endTurn(player) {
  addLog(`--- 回合结束 ---`)
  
  // 衰减阶段
  applyDecay(gameState.player1.board)
  applyDecay(gameState.player2.board)
  
  // 补充手牌
  refillBoard(gameState.player1)
  refillBoard(gameState.player2)
  
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

function handleAbilityTarget(player, row, col) {
  const board = player === 1 ? gameState.player1.board : gameState.player2.board
  const targetCard = board[row][col]
  if (!targetCard) return
  
  const ability = gameState.selectedCard.card.ability
  
  if (ability.id === 1) {
    const arrowMap = { '↑': '→', '→': '↓', '↓': '←', '←': '↑' }
    targetCard.arrow = arrowMap[targetCard.arrow]
    addLog(`${ability.icon} 旋转 ${targetCard.attrEmoji}`)
    gameState.waitingForAbility = false
    triggerCard(gameState.selectedCard.player, gameState.selectedCard.row, gameState.selectedCard.col)
    checkChain(gameState.selectedCard.player, gameState.selectedCard.row, gameState.selectedCard.col)
  } else if (ability.id === 2) {
    targetCard.attr = gameState.selectedCard.card.attr
    targetCard.attrEmoji = gameState.selectedCard.card.attrEmoji
    addLog(`${ability.icon} ${targetCard.attrEmoji} 变色`)
    gameState.waitingForAbility = false
    triggerCard(gameState.selectedCard.player, gameState.selectedCard.row, gameState.selectedCard.col)
    checkChain(gameState.selectedCard.player, gameState.selectedCard.row, gameState.selectedCard.col)
  } else if (ability.id === 3) {
    if (!gameState.abilityTarget1) {
      gameState.abilityTarget1 = { player, row, col, card: targetCard }
      addLog('请选择第二张牌')
    } else {
      const target2 = gameState.abilityTarget1
      const temp = { ...board[target2.row][target2.col] }
      board[target2.row][target2.col] = { ...targetCard }
      board[row][col] = { ...temp }
      addLog(`${ability.icon} 交换位置`)
      gameState.waitingForAbility = false
      gameState.abilityTarget1 = null
      triggerCard(gameState.selectedCard.player, gameState.selectedCard.row, gameState.selectedCard.col)
      checkChain(gameState.selectedCard.player, gameState.selectedCard.row, gameState.selectedCard.col)
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

function applyDecay(board) {
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      const card = board[row][col]
      if (card && !card.triggered && card.hp !== '∞') {
        const newHp = typeof card.hp === 'number' ? card.hp - 1 : card.hp
        if (newHp <= 0) {
          card.hp = 0
          card.triggered = true
          if (card.maxHp > 0) {
            // 找到对应的 player 并增加 penalty
            const player = board === gameState.player1.board ? gameState.player1 : gameState.player2
            player.penalty += 1
            addLog(`☠️ ${card.attrEmoji} 死亡 -1 分`)
          }
        } else {
          card.hp = newHp
        }
      }
    }
  }
}

function gameLoop() {
  render()
  requestAnimationFrame(gameLoop)
}

initGame()
gameLoop()
