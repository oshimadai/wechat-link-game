/**
 * 1V1 连线桌游 - 微信小游戏
 * 版本：v1.0 - 首发版
 * 平台：微信小程序
 * 日期：2026-03-13
 */

const CONFIG = {
  WIN_SCORE: 20,
  HAND_SIZE: 5,
  CARD_SIZE: 90,  // 正方形卡牌
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
  { attr: 'fire', hp: 3, score: 1, arrow: '→', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 1, arrow: '↑', abilityId: 2 },
  { attr: 'fire', hp: 3, score: 1, arrow: '↑', abilityId: 3 },
  { attr: 'fire', hp: 3, score: 1, arrow: '↓', abilityId: 1 },
  { attr: 'fire', hp: 3, score: 1, arrow: '↓', abilityId: 2 },
  { attr: 'fire', hp: 3, score: 1, arrow: '←', abilityId: 3 },
  { attr: 'fire', hp: 3, score: 1, arrow: '←', abilityId: 1 },
  { attr: 'fire', hp: 2, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'fire', hp: 2, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'fire', hp: 2, score: 2, arrow: '→', abilityId: 3 },
  { attr: 'fire', hp: 2, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'fire', hp: 2, score: 2, arrow: '↓', abilityId: 2 },
  { attr: 'fire', hp: 2, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'fire', hp: 2, score: 2, arrow: '←', abilityId: 1 },
  { attr: 'fire', hp: 1, score: 3, arrow: '→', abilityId: 1 },
  { attr: 'fire', hp: 1, score: 3, arrow: '↑', abilityId: 2 },
  { attr: 'fire', hp: 1, score: 3, arrow: '↓', abilityId: 3 },
  { attr: 'fire', hp: 0, score: 0, arrow: '←', abilityId: 1 },
  { attr: 'fire', hp: '∞', score: 1, arrow: '→', abilityId: null },
  { attr: 'water', hp: 3, score: 1, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 3, score: 1, arrow: '→', abilityId: 2 },
  { attr: 'water', hp: 3, score: 1, arrow: '→', abilityId: 3 },
  { attr: 'water', hp: 3, score: 1, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 3, score: 1, arrow: '↑', abilityId: 2 },
  { attr: 'water', hp: 3, score: 1, arrow: '↑', abilityId: 3 },
  { attr: 'water', hp: 3, score: 1, arrow: '↓', abilityId: 1 },
  { attr: 'water', hp: 3, score: 1, arrow: '↓', abilityId: 2 },
  { attr: 'water', hp: 3, score: 1, arrow: '←', abilityId: 3 },
  { attr: 'water', hp: 3, score: 1, arrow: '←', abilityId: 1 },
  { attr: 'water', hp: 2, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 2, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'water', hp: 2, score: 2, arrow: '→', abilityId: 3 },
  { attr: 'water', hp: 2, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'water', hp: 2, score: 2, arrow: '↓', abilityId: 2 },
  { attr: 'water', hp: 2, score: 2, arrow: '↑', abilityId: 3 },
  { attr: 'water', hp: 2, score: 2, arrow: '←', abilityId: 1 },
  { attr: 'water', hp: 1, score: 3, arrow: '→', abilityId: 1 },
  { attr: 'water', hp: 1, score: 3, arrow: '↑', abilityId: 2 },
  { attr: 'water', hp: 1, score: 3, arrow: '↓', abilityId: 3 },
  { attr: 'water', hp: 0, score: 0, arrow: '←', abilityId: 1 },
  { attr: 'water', hp: '∞', score: 1, arrow: '→', abilityId: null },
  { attr: 'wood', hp: 3, score: 1, arrow: '→', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 1, arrow: '→', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 1, arrow: '→', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 1, arrow: '→', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 1, arrow: '↑', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 1, arrow: '↑', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 1, arrow: '↓', abilityId: 1 },
  { attr: 'wood', hp: 3, score: 1, arrow: '↓', abilityId: 2 },
  { attr: 'wood', hp: 3, score: 1, arrow: '←', abilityId: 3 },
  { attr: 'wood', hp: 3, score: 1, arrow: '←', abilityId: 1 },
  { attr: 'wood', hp: 2, score: 2, arrow: '→', abilityId: 1 },
  { attr: 'wood', hp: 2, score: 2, arrow: '→', abilityId: 2 },
  { attr: 'wood', hp: 2, score: 2, arrow: '→', abilityId: 3 },
  { attr: 'wood', hp: 2, score: 2, arrow: '↓', abilityId: 1 },
  { attr: 'wood', hp: 2, score: 2, arrow: '↓', abilityId: 2 },
  { attr: 'wood', hp: 2, score: 2, arrow: '↑', abilityId: 3 },
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
  player1: { hand: [], deck: [], score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } },
  player2: { hand: [], deck: [], score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } },
  currentPlayer: 1,
  round: 1,
  selectedCard: null,
  abilityTarget1: null,
  abilityTarget2: null,
  waitingForAbility: false,
  waitingForChain: false,
  chainStartCard: null,
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

console.log(`Canvas: ${canvas.width}x${canvas.height}, Safe: ${safeTop}/${safeBottom}/${safeLeft}/${safeRight}`)

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
  gameState.chainStartCard = null
  gameState.triggeredCards = []
  gameState.gameOver = false
  gameState.gameLog = ['🎮 游戏开始！点击卡牌开始']
  
  render()
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
  ctx.fillText('🔗 1V1 连线桌游', canvas.width / 2, safeTop + 25)
  
  const cardSize = CONFIG.CARD_SIZE
  const cardGap = 8
  const totalHeight = CONFIG.HAND_SIZE * cardSize + (CONFIG.HAND_SIZE - 1) * cardGap
  const startY = (canvas.height - totalHeight) / 2 + 10
  
  // 玩家 1 区域（左侧）
  const player1X = safeLeft + 5
  const isPlayer1Turn = gameState.currentPlayer === 1
  ctx.fillStyle = isPlayer1Turn ? '#FFD700' : '#666666'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 玩家 1`, player1X + cardSize / 2, safeTop + 45)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Arial'
  ctx.fillText(`${gameState.player1.score}分`, player1X + cardSize / 2, safeTop + 65)
  
  ctx.font = '12px Arial'
  ctx.fillText(`🔥${gameState.player1.tokens.fire} 💧${gameState.player1.tokens.water} 🌿${gameState.player1.tokens.wood}`, player1X + cardSize / 2, safeTop + 80)
  
  // 玩家 1 手牌
  gameState.player1.hand.forEach((card, index) => {
    if (card) drawCard(card, player1X, startY + index * (cardSize + cardGap), 'right')
  })
  
  // 玩家 2 区域（右侧）
  const player2X = canvas.width - cardSize - safeRight - 5
  const isPlayer2Turn = gameState.currentPlayer === 2
  ctx.fillStyle = isPlayer2Turn ? '#FFD700' : '#666666'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 玩家 2`, player2X + cardSize / 2, safeTop + 45)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Arial'
  ctx.fillText(`${gameState.player2.score}分`, player2X + cardSize / 2, safeTop + 65)
  
  ctx.font = '12px Arial'
  ctx.fillText(`🔥${gameState.player2.tokens.fire} 💧${gameState.player2.tokens.water} 🌿${gameState.player2.tokens.wood}`, player2X + cardSize / 2, safeTop + 80)
  
  // 玩家 2 手牌
  gameState.player2.hand.forEach((card, index) => {
    if (card) drawCard(card, player2X, startY + index * (cardSize + cardGap), 'left')
  })
  
  // 中间信息
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`回合：${gameState.round}`, canvas.width / 2, safeTop + 110)
  
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 22px Arial'
  ctx.fillText(`▶ 玩家${gameState.currentPlayer} ◀`, canvas.width / 2, safeTop + 138)
  
  // 能力提示
  if (gameState.waitingForAbility && gameState.selectedCard) {
    const ability = gameState.selectedCard.card.ability
    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(`${ability.icon} ${ability.name}: 点击目标卡牌`, canvas.width / 2, safeTop + 160)
  }
  
  // 连线提示
  if (gameState.waitingForChain && gameState.chainStartCard) {
    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`点击${gameState.chainStartCard.attrEmoji}继续连线`, canvas.width / 2, safeTop + 160)
  }
  
  // 取消按钮
  if (gameState.selectedCard && !gameState.waitingForAbility && !gameState.waitingForChain) {
    ctx.fillStyle = '#FF6B6B'
    ctx.fillRect(canvas.width / 2 - 50, safeTop + 145, 100, 35)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 16px Arial'
    ctx.fillText('❌ 取消', canvas.width / 2, safeTop + 168)
  }
  
  // 游戏日志
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(canvas.width / 2 - 120, canvas.height - safeBottom - 65, 240, 55)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '11px Arial'
  ctx.textAlign = 'left'
  gameState.gameLog.slice(0, 3).forEach((log, index) => {
    ctx.fillText(log.substring(0, 25), canvas.width / 2 - 110, canvas.height - safeBottom - 50 + index * 14)
  })
  
  ctx.fillStyle = '#AAAAAA'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('点击卡牌 • 连线得分', canvas.width / 2, canvas.height - safeBottom - 12)
}

function drawCard(card, x, y, direction) {
  ctx.save()
  
  const centerX = x + card.width / 2
  const centerY = y + card.height / 2
  
  if (direction === 'right') {
    ctx.translate(centerX, centerY)
    ctx.rotate(Math.PI / 2)
    ctx.translate(-centerX, -centerY)
  } else if (direction === 'left') {
    ctx.translate(centerX, centerY)
    ctx.rotate(-Math.PI / 2)
    ctx.translate(-centerX, -centerY)
  }
  
  // 背景
  const colors = {
    fire: '#FF6464',
    water: '#6464FF',
    wood: '#64FF64',
    wild: '#2C2C2C'  // 黑色
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
  ctx.fillStyle = card.attr === 'wild' ? '#FFFFFF' : '#FFFFFF'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(card.attrEmoji, x + card.width / 2, y + 28)
  
  // 箭头（大字体，白色）
  ctx.font = 'bold 42px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(card.arrow, x + card.width / 2, y + card.height / 2 + 14)
  
  // 血量
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'left'
  const hpText = card.hp === '∞' ? '∞' : `HP:${card.hp}`
  ctx.fillText(hpText, x + 5, y + 16)
  
  // 分数
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(`+${card.score}`, x + card.width / 2, y + card.height - 12)
  
  // 能力图标
  if (card.ability) {
    ctx.font = '18px Arial'
    ctx.fillText(card.ability.icon, x + card.width - 14, y + 16)
  }
  
  ctx.restore()
}

wx.onTouchStart((res) => {
  if (gameState.gameOver) return
  
  const touch = res.touches[0]
  const x = touch.clientX
  const y = touch.clientY
  
  const cardSize = CONFIG.CARD_SIZE
  const cardGap = 8
  const totalHeight = CONFIG.HAND_SIZE * cardSize + (CONFIG.HAND_SIZE - 1) * cardGap
  const startY = (canvas.height - totalHeight) / 2 + 10
  
  // 检查取消按钮
  if (gameState.selectedCard && !gameState.waitingForAbility && !gameState.waitingForChain) {
    if (x >= canvas.width / 2 - 50 && x <= canvas.width / 2 + 50 &&
        y >= safeTop + 145 && y <= safeTop + 180) {
      cancelSelection()
      return
    }
  }
  
  // 检查玩家 1 区域
  const player1X = safeLeft + 5
  gameState.player1.hand.forEach((card, index) => {
    const cardY = startY + index * (cardSize + cardGap)
    if (x >= player1X && x <= player1X + cardSize && y >= cardY && y <= cardY + cardSize) {
      handleCardClick(1, index)
    }
  })
  
  // 检查玩家 2 区域
  const player2X = canvas.width - cardSize - safeRight - 5
  gameState.player2.hand.forEach((card, index) => {
    const cardY = startY + index * (cardSize + cardGap)
    if (x >= player2X && x <= player2X + cardSize && y >= cardY && y <= cardY + cardSize) {
      handleCardClick(2, index)
    }
  })
})

function handleCardClick(player, index) {
  if (gameState.gameOver) return
  
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card || card.triggered) return
  
  // 如果正在等待能力目标
  if (gameState.waitingForAbility && gameState.selectedCard) {
    handleAbilityTarget(player, index)
    return
  }
  
  // 如果正在等待连线
  if (gameState.waitingForChain && gameState.chainStartCard) {
    continueChain(player, index)
    return
  }
  
  // 选择卡牌
  gameState.selectedCard = { player, index, card }
  addLog(`选择了 ${card.attrEmoji}`)
  
  if (card.ability) {
    gameState.waitingForAbility = true
    addLog(`使用能力：${card.ability.icon} ${card.ability.name}`)
  } else {
    // 没有能力，直接触发并检查连线
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
  
  // 增加分数
  const points = card.score
  if (player === 1) gameState.player1.score += points
  else gameState.player2.score += points
  
  addLog(`触发 ${card.attrEmoji} +${points}分 (总分：${player === 1 ? gameState.player1.score : gameState.player2.score})`)
}

function checkChain(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card) return
  
  const arrow = card.arrow
  let nextIndex = null
  
  // 根据箭头方向找下一张牌
  if (arrow === '→') {
    for (let i = index + 1; i < hand.length; i++) {
      if (hand[i] && !hand[i].triggered) {
        if (hand[i].attr === card.attr || hand[i].attr === 'wild' || card.attr === 'wild') {
          nextIndex = i
          break
        }
      }
    }
  } else if (arrow === '↓') {
    for (let i = index + 1; i < hand.length; i++) {
      if (hand[i] && !hand[i].triggered) {
        if (hand[i].attr === card.attr || hand[i].attr === 'wild' || card.attr === 'wild') {
          nextIndex = i
          break
        }
      }
    }
  } else if (arrow === '←') {
    for (let i = index - 1; i >= 0; i--) {
      if (hand[i] && !hand[i].triggered) {
        if (hand[i].attr === card.attr || hand[i].attr === 'wild' || card.attr === 'wild') {
          nextIndex = i
          break
        }
      }
    }
  } else if (arrow === '↑') {
    for (let i = index - 1; i >= 0; i--) {
      if (hand[i] && !hand[i].triggered) {
        if (hand[i].attr === card.attr || hand[i].attr === 'wild' || card.attr === 'wild') {
          nextIndex = i
          break
        }
      }
    }
  }
  
  if (nextIndex !== null) {
    gameState.waitingForChain = true
    gameState.chainStartCard = card
    addLog(`点击${card.attrEmoji}继续连线`)
  } else {
    endTurn(player)
  }
  
  render()
}

function continueChain(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card) return
  
  // 触发这张牌
  triggerCard(player, index)
  
  // 继续检查连线
  checkChain(player, index)
}

function endTurn(player) {
  addLog(`--- 回合结束 ---`)
  
  // 衰减阶段
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
    // 交换回合
    if (gameState.currentPlayer === 1) {
      gameState.currentPlayer = 2
    } else {
      gameState.currentPlayer = 1
      gameState.round++
    }
    addLog(`回合 ${gameState.round} - 玩家${gameState.currentPlayer}`)
  }
  
  // 重置状态
  gameState.selectedCard = null
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  gameState.waitingForAbility = false
  gameState.waitingForChain = false
  gameState.chainStartCard = null
  
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
  gameState.chainStartCard = null
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  addLog('❌ 取消选择')
  render()
}

function applyDecay(hand) {
  hand.forEach(card => {
    if (!card.triggered && card.hp !== '∞') {
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

function refillHand(player) {
  const needed = CONFIG.HAND_SIZE - player.hand.filter(c => c).length
  for (let i = 0; i < needed && player.deck.length > 0; i++) {
    player.hand.push(player.deck.pop())
  }
}

function gameLoop() {
  render()
  requestAnimationFrame(gameLoop)
}

initGame()
gameLoop()
