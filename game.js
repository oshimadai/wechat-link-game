/**
 * 1V1 连线桌游 - 微信小游戏
 * 版本：v3.25 - 卡牌加大 + BUG-002/004 修复
 * 规则版本：完整规则书
 * 日期：2026-03-14
 * 
 * v3.25 修复:
 * - 卡牌尺寸：70→85，间距 8→10
 * - BUG-002: P2 卡牌被消除后给 P1 计分（所有消除的牌都给激活玩家计分）
 * - BUG-004: 3 个技能可以对全局任意 5 张牌使用（包括对手的）
 * 
 * v3.24 修复:
 * - 布局：按照用户指定方案（P1 左/P2 右，纵向手牌）
 */

const CONFIG = {
  WIN_SCORE: 40,
  HAND_SIZE: 5,
  CARD_SIZE: 85,
  CARD_GAP: 10,
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
  // 补充至 5 张牌（填补空位）
  for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
    if (!player.hand[i] && player.deck.length > 0) {
      player.hand[i] = player.deck.pop()
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
  
  ctx.fillStyle = '#2C3E50'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  const cardSize = CONFIG.CARD_SIZE
  const cardGap = CONFIG.CARD_GAP
  const totalWidth = CONFIG.HAND_SIZE * cardSize + (CONFIG.HAND_SIZE - 1) * cardGap
  
  // 布局按照用户指定方案
  const centerX = canvas.width / 2
  const headerY = safeTop + 30
  const infoY = safeTop + 60
  const handStartY = safeTop + 100
  
  // 顶部标题
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🔗 1V1 连线桌游 v3.24', centerX, headerY)
  
  // 玩家 1 区域（左侧）
  const player1X = centerX - 150
  const isPlayer1Turn = gameState.currentPlayer === 1
  ctx.fillStyle = isPlayer1Turn ? '#FFD700' : '#666666'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 P1`, player1X, infoY - 10)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.fillText(`${gameState.player1.score}分`, player1X, infoY + 10)
  ctx.fillText(`扣:${gameState.player1.penalty}`, player1X, infoY + 28)
  
  // 玩家 1 手牌（纵向一列）
  gameState.player1.hand.forEach((card, index) => {
    if (card) {
      drawCard(card, player1X - 35, handStartY + index * (cardSize + cardGap), 'right')
    } else {
      const x = player1X - 35
      const y = handStartY + index * (cardSize + cardGap)
      ctx.strokeStyle = '#666666'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(x, y, cardSize, cardSize)
      ctx.setLineDash([])
    }
  })
  
  // 中间信息
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`回合：${gameState.round}`, centerX, infoY)
  
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 18px Arial'
  ctx.fillText(`▶ 玩家${gameState.currentPlayer} ◀`, centerX, infoY + 25)
  
  if (gameState.waitingForAbility && gameState.abilitySourceCard) {
    const ability = gameState.abilitySourceCard.card.ability
    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 12px Arial'
    ctx.fillText(`${ability.icon} ${ability.name}`, centerX, infoY + 50)
  }
  
  if (gameState.autoChainMode) {
    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`⚡ 自动消除中`, centerX, infoY + 50)
  }
  
  if (gameState.selectedCard && !gameState.waitingForAbility && !gameState.autoChainMode) {
    // 激活按钮
    ctx.fillStyle = '#00FF00'
    ctx.fillRect(centerX - 50, infoY + 55, 100, 25)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 12px Arial'
    ctx.fillText('⚡ 激活', centerX, infoY + 72)
  }
  
  // 玩家 2 区域（右侧）
  const player2X = centerX + 150
  const isPlayer2Turn = gameState.currentPlayer === 2
  ctx.fillStyle = isPlayer2Turn ? '#FFD700' : '#666666'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 P2`, player2X, infoY - 10)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.fillText(`${gameState.player2.score}分`, player2X, infoY + 10)
  ctx.fillText(`扣:${gameState.player2.penalty}`, player2X, infoY + 28)
  
  // 玩家 2 手牌（纵向一列）
  gameState.player2.hand.forEach((card, index) => {
    if (card) {
      drawCard(card, player2X - 35, handStartY + index * (cardSize + cardGap), 'left')
    } else {
      const x = player2X - 35
      const y = handStartY + index * (cardSize + cardGap)
      ctx.strokeStyle = '#666666'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(x, y, cardSize, cardSize)
      ctx.setLineDash([])
    }
  })
  
  // 游戏日志
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(centerX - 80, canvas.height - safeBottom - 50, 160, 40)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '9px Arial'
  ctx.textAlign = 'left'
  gameState.gameLog.slice(0, 3).forEach((log, index) => {
    ctx.fillText(log.substring(0, 15), centerX - 75, canvas.height - safeBottom - 35 + index * 11)
  })
}

function drawCard(card, x, y, direction) {
  ctx.save()
  
  const centerX = x + card.width / 2
  const centerY = y + card.height / 2
  
  // 左右布局旋转
  if (direction === 'right') {
    // 玩家 1：旋转 90°（面向右）
    ctx.translate(centerX, centerY)
    ctx.rotate(Math.PI / 2)
    ctx.translate(-centerX, -centerY)
  } else if (direction === 'left') {
    // 玩家 2：旋转 -90°（面向左）
    ctx.translate(centerX, centerY)
    ctx.rotate(-Math.PI / 2)
    ctx.translate(-centerX, -centerY)
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
  const centerX = canvas.width / 2
  const infoY = safeTop + 60
  const handStartY = safeTop + 100
  
  const player1X = centerX - 150
  const player2X = centerX + 150
  
  // 检查是否当前回合玩家正在自动消除中（该玩家不能操作）
  if (gameState.autoChainMode && gameState.autoChainPlayer === gameState.currentPlayer) {
    addLog(`⚡ ${gameState.currentPlayer === 1 ? 'P1' : 'P2'} 请等待...`)
    return
  }
  
  // 检查激活按钮点击
  if (gameState.selectedCard && !gameState.waitingForAbility && !gameState.autoChainMode) {
    if (x >= centerX - 50 && x <= centerX + 50 &&
        y >= infoY + 55 && y <= infoY + 80) {
      activateSelectedCard()
      return
    }
  }
  
  // 检查卡牌点击
  // 如果正在等待技能目标，可以点击全场任意卡牌（包括对手）- 修复 BUG-004
  if (gameState.waitingForAbility && gameState.abilitySourceCard) {
    // 检查玩家 1 的牌
    gameState.player1.hand.forEach((card, index) => {
      const cardX = player1X - 35
      const cardY = handStartY + index * (cardSize + cardGap)
      if (x >= cardX && x <= cardX + cardSize && y >= cardY && y <= cardY + cardSize) {
        if (card && !card.triggered) handleAbilityTarget(1, index)
      }
    })
    // 检查玩家 2 的牌
    gameState.player2.hand.forEach((card, index) => {
      const cardX = player2X - 35
      const cardY = handStartY + index * (cardSize + cardGap)
      if (x >= cardX && x <= cardX + cardSize && y >= cardY && y <= cardY + cardSize) {
        if (card && !card.triggered) handleAbilityTarget(2, index)
      }
    })
    return
  }
  
  // 正常回合：只能点击自己面前的牌
  const currentPlayer = gameState.currentPlayer
  const currentHand = currentPlayer === 1 ? gameState.player1.hand : gameState.player2.hand
  const currentX = currentPlayer === 1 ? player1X - 35 : player2X - 35
  
  currentHand.forEach((card, index) => {
    const cardX = currentX
    const cardY = handStartY + index * (cardSize + cardGap)
    if (x >= cardX && x <= cardX + cardSize && y >= cardY && y <= cardY + cardSize) {
      if (card) selectCard(currentPlayer, index)
    }
  })
})

// 选中卡牌（不触发）
function selectCard(player, index) {
  if (gameState.gameOver) return
  
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card || card.triggered) return
  
  // 如果正在等待能力目标或连线
  if (gameState.waitingForAbility && gameState.selectedCard) {
    handleAbilityTarget(player, index)
    return
  }
  
  if (gameState.waitingForChain && gameState.chainCards.length > 0) {
    continueChain(player, index)
    return
  }
  
  // 选中卡牌
  gameState.selectedCard = { player, index, card }
  addLog(`选中 ${card.attrEmoji} - 点击⚡激活`)
  render()
}

// 激活选中的卡牌 - 修复 BUG-002 (自动消除)
function activateSelectedCard() {
  if (!gameState.selectedCard) return
  
  const { player, index, card } = gameState.selectedCard
  
  // 检查是否只能激活自己面前的卡牌
  const currentHand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  if (!currentHand[index]) {
    addLog('❌ 只能激活自己面前的卡牌')
    return
  }
  
  // 如果卡牌有技能，进入技能选择模式
  if (card.ability) {
    gameState.waitingForAbility = true
    gameState.abilitySourceCard = { player, index, card }
    addLog(`⚡ 使用能力：${card.ability.icon} ${card.ability.name} - 点击目标卡牌`)
    render()
  } else {
    // 没有技能，直接开始自动消除流程
    startAutoChain(player, index, card)
  }
}

// 处理卡牌点击（用于能力目标和连线）
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
}

function triggerCard(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card || card.triggered) return
  
  // 触发后从手牌移除（放入得分区）
  hand[index] = null
  gameState.triggeredCards.push({ ...card })
  
  const points = card.score
  if (player === 1) gameState.player1.score += points
  else gameState.player2.score += points
  
  addLog(`触发 ${card.attrEmoji} +${points}分`)
}

// checkChain 和 continueChain 已废弃，使用新的自动消除系统
// startAutoChain -> collectChainCards -> executeAutoChain

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
  // 获取目标卡牌的手牌（支持全场任意卡牌）
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const targetCard = hand[index]
  if (!targetCard || targetCard.triggered) return
  
  const ability = gameState.abilitySourceCard.card.ability
  
  if (ability.id === 1) {
    // 旋转：改变目标卡牌箭头方向（全场任意）- 修复 BUG-004
    const arrowMap = { '↑': '→', '→': '↓', '↓': '←', '←': '↑' }
    targetCard.arrow = arrowMap[targetCard.arrow]
    addLog(`${ability.icon} 旋转 ${targetCard.attrEmoji}`)
    gameState.waitingForAbility = false
    startAutoChain(gameState.abilitySourceCard.player, gameState.abilitySourceCard.index, gameState.abilitySourceCard.card)
  } else if (ability.id === 2) {
    // 变色：改变目标卡牌属性（全场任意）- 修复 BUG-004
    targetCard.attr = gameState.abilitySourceCard.card.attr
    targetCard.attrEmoji = gameState.abilitySourceCard.card.attrEmoji
    addLog(`${ability.icon} ${targetCard.attrEmoji} 变色`)
    gameState.waitingForAbility = false
    startAutoChain(gameState.abilitySourceCard.player, gameState.abilitySourceCard.index, gameState.abilitySourceCard.card)
  } else if (ability.id === 3) {
    // 换位：需要选择两张目标卡牌（全场任意）- 修复 BUG-004
    if (!gameState.abilityTarget1) {
      gameState.abilityTarget1 = { player, index, card: targetCard }
      addLog('请选择第二张牌')
    } else {
      const target2 = gameState.abilityTarget1
      const hand2 = target2.player === 1 ? gameState.player1.hand : gameState.player2.hand
      const temp = { ...hand2[target2.index] }
      hand2[target2.index] = { ...targetCard }
      hand[index] = { ...temp }
      addLog(`${ability.icon} 交换位置`)
      gameState.waitingForAbility = false
      gameState.abilityTarget1 = null
      startAutoChain(gameState.abilitySourceCard.player, gameState.abilitySourceCard.index, gameState.abilitySourceCard.card)
    }
  }
  
  render()
}

// 开始自动消除流程 - 修复 BUG-002 核心
function startAutoChain(player, index, card) {
  addLog(`⚡ 自动消除中，${player === 1 ? '玩家 1' : '玩家 2'} 请等待...`)
  
  // 标记当前回合玩家，该玩家不能操作
  gameState.autoChainMode = true
  gameState.autoChainPlayer = player  // 记录当前不能操作的玩家
  gameState.autoChainCards = []
  
  // 收集所有要消除的卡牌
  collectChainCards(player, index, card)
  
  // 执行消除
  executeAutoChain(player)
}

// 收集连线卡牌（递归）
function collectChainCards(player, index, card) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  
  // 检查这张卡牌是否已经收集过
  const alreadyCollected = gameState.autoChainCards.some(c => c.player === player && c.index === index)
  if (alreadyCollected) return
  
  // 收集这张卡牌
  gameState.autoChainCards.push({ player, index, card })
  
  // 根据箭头方向继续收集
  const arrow = card.arrow
  
  if (arrow === '←') {
    // 向左，穿过空位
    for (let i = index - 1; i >= 0; i--) {
      if (hand[i] === null) continue
      if (hand[i].triggered) break
      if (card.attr === hand[i].attr || card.attr === 'wild' || hand[i].attr === 'wild') {
        collectChainCards(player, i, hand[i])
        break
      } else {
        break
      }
    }
  } else if (arrow === '→') {
    // 向右，穿过空位
    for (let i = index + 1; i < hand.length; i++) {
      if (hand[i] === null) continue
      if (hand[i].triggered) break
      if (card.attr === hand[i].attr || card.attr === 'wild' || hand[i].attr === 'wild') {
        collectChainCards(player, i, hand[i])
        break
      } else {
        break
      }
    }
  } else if (arrow === '↑' || arrow === '↓') {
    // 上下方向，连对手
    const opponentHand = player === 1 ? gameState.player2.hand : gameState.player1.hand
    if (opponentHand[index] && !opponentHand[index].triggered &&
        (card.attr === opponentHand[index].attr || card.attr === 'wild' || opponentHand[index].attr === 'wild')) {
      collectChainCards(player === 1 ? 2 : 1, index, opponentHand[index])
    }
  }
}

// 执行自动消除 - 修复 BUG-002: 所有消除的牌都给激活玩家计分
function executeAutoChain(player) {
  // 按顺序触发所有收集的卡牌，但分数都给激活玩家
  gameState.autoChainCards.forEach(item => {
    const { player: p, index: i, card: c } = item
    
    // 从手牌移除
    const hand = p === 1 ? gameState.player1.hand : gameState.player2.hand
    hand[i] = null
    gameState.triggeredCards.push({ ...card })
    
    // 分数都给激活玩家（不是卡牌所属玩家）
    if (player === 1) gameState.player1.score += c.score
    else gameState.player2.score += c.score
    
    addLog(`触发 ${c.attrEmoji} +${c.score}分 → ${player === 1 ? 'P1' : 'P2'}`)
  })
  
  addLog(`✅ 消除完成，共 ${gameState.autoChainCards.length} 张卡牌`)
  
  // 清除自动消除状态
  gameState.autoChainMode = false
  gameState.autoChainPlayer = null
  gameState.autoChainCards = []
  gameState.selectedCard = null
  gameState.abilitySourceCard = null
  
  // 结束回合
  endTurn(player)
}

function cancelSelection() {
  if (gameState.waitingForAbility || gameState.waitingForChain) return  // 能力/连线中不能取消
  
  gameState.selectedCard = null
  addLog('❌ 取消选择')
  render()
}

function applyDecay(hand) {
  const arrowMap = { '↑': '→', '→': '↓', '↓': '←', '←': '↑' }
  
  hand.forEach((card, index) => {
    if (card && !card.triggered && card.hp !== '∞') {
      // 箭头顺时针旋转 90°
      card.arrow = arrowMap[card.arrow]
      
      // 血量 -1
      const newHp = typeof card.hp === 'number' ? card.hp - 1 : card.hp
      if (newHp <= 0) {
        card.hp = 0
        card.triggered = true
        hand[index] = null  // 从手牌移除
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
