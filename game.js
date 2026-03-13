/**
 * 1V1 连线桌游 - 微信小游戏
 * 版本：v3.22 - 正确布局版
 * 
 * 核心规则：
 * - 每名玩家 5 张手牌
 * - 上下布局，面对面设计
 * - 连线规则：只能相同属性连接
 * - 衰减规则：每回合未触发卡牌 -1 血
 * - 胜利条件：率先达到 20 分
 */

const CONFIG = {
  WIN_SCORE: 20,
  HAND_SIZE: 5,
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

// 固定牌组 v2.4（70 张）
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

// 游戏状态
let gameState = {
  player1: { hand: [], deck: [], score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } },
  player2: { hand: [], deck: [], score: 0, penalty: 0, tokens: { fire: 0, water: 0, wood: 0 } },
  currentPlayer: 1,
  round: 1,
  selectedCard: null,
  abilityTarget1: null,
  abilityTarget2: null,
  waitingForAbility: false,
  triggeredCards: [],
  gameOver: false,
  gameLog: []
}

// Canvas 和上下文
const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

// 设置 Canvas 尺寸为屏幕尺寸
const { windowWidth, windowHeight } = wx.getSystemInfoSync()
canvas.width = windowWidth
canvas.height = windowHeight

console.log(`Canvas 尺寸：${canvas.width}x${canvas.height}`)

// 创建卡牌
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
    width: 60,
    height: 84
  }
}

// 生成牌组
function generateDeck() {
  const deck = FIXED_DECK.map(data => createCard(data))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // 使用传统交换方式，避免解构赋值
    const temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
  return deck
}

// 初始化游戏
function initGame() {
  console.log('初始化游戏 v3.22')
  
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
  gameState.triggeredCards = []
  gameState.gameOver = false
  gameState.gameLog = ['🎮 游戏开始！']
  
  render()
}

// 添加日志
function addLog(message) {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  gameState.gameLog.unshift(`[${timestamp}] ${message}`)
  if (gameState.gameLog.length > 50) gameState.gameLog.pop()
  render()
}

// 渲染游戏
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 背景
  ctx.fillStyle = '#2C3E50'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 标题
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🔗 1V1 连线桌游 v3.22', canvas.width / 2, 30)
  
  // 卡牌尺寸（左右布局，更大）
  const cardWidth = 80
  const cardHeight = 112
  const cardGap = 10
  const totalHeight = CONFIG.HAND_SIZE * cardHeight + (CONFIG.HAND_SIZE - 1) * cardGap
  const startY = (canvas.height - totalHeight) / 2
  
  // 玩家 1 区域（左侧）
  const player1X = 40
  ctx.fillStyle = gameState.currentPlayer === 1 ? '#FFD700' : '#FFFFFF'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 玩家 1`, player1X + cardWidth / 2, 20)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.fillText(`${gameState.player1.score}分`, player1X + cardWidth / 2, 38)
  
  // 玩家 1 Token
  ctx.font = '12px Arial'
  ctx.fillText(`🔥${gameState.player1.tokens.fire} 💧${gameState.player1.tokens.water} 🌿${gameState.player1.tokens.wood}`, player1X + cardWidth / 2, 52)
  
  // 玩家 1 手牌（左侧，从上到下）
  gameState.player1.hand.forEach((card, index) => {
    if (card) {
      drawCard(card, player1X, startY + index * (cardHeight + cardGap), false, true)
    }
  })
  
  // 玩家 2 区域（右侧）
  const player2X = canvas.width - cardWidth - 40
  ctx.fillStyle = gameState.currentPlayer === 2 ? '#FFD700' : '#FFFFFF'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`👤 玩家 2`, player2X + cardWidth / 2, 20)
  
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.fillText(`${gameState.player2.score}分`, player2X + cardWidth / 2, 38)
  
  // 玩家 2 Token
  ctx.font = '12px Arial'
  ctx.fillText(`🔥${gameState.player2.tokens.fire} 💧${gameState.player2.tokens.water} 🌿${gameState.player2.tokens.wood}`, player2X + cardWidth / 2, 52)
  
  // 玩家 2 手牌（右侧，从上到下，旋转 180°）
  gameState.player2.hand.forEach((card, index) => {
    if (card) {
      drawCard(card, player2X, startY + index * (cardHeight + cardGap), true, true)
    }
  })
  
  // 中间信息
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`回合：${gameState.round}`, canvas.width / 2, 60)
  
  // 当前玩家提示
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 18px Arial'
  ctx.fillText(`当前：玩家${gameState.currentPlayer}`, canvas.width / 2, 85)
  
  // 能力提示
  if (gameState.selectedCard && gameState.selectedCard.card.ability) {
    const ability = gameState.selectedCard.card.ability
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`能力：${ability.icon} ${ability.name}`, canvas.width / 2, 105)
  }
  
  // 游戏日志
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(canvas.width / 2 - 150, canvas.height - 80, 300, 70)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '11px Arial'
  ctx.textAlign = 'left'
  gameState.gameLog.slice(0, 4).forEach((log, index) => {
    ctx.fillText(log, canvas.width / 2 - 140, canvas.height - 65 + index * 15)
  })
  
  // 操作提示
  ctx.fillStyle = '#AAAAAA'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('点击卡牌选择 • 点击能力图标使用能力', canvas.width / 2, canvas.height - 15)
}

// 绘制卡牌
function drawCard(card, x, y, rotate180, isVertical) {
  ctx.save()
  
  if (rotate180) {
    ctx.translate(x + card.width / 2, y + card.height / 2)
    ctx.rotate(Math.PI)
    ctx.translate(-(x + card.width / 2), -(y + card.height / 2))
  }
  
  // 背景
  const colors = {
    fire: '#FF6464',
    water: '#6464FF',
    wood: '#64FF64',
    wild: '#FFFF64'
  }
  ctx.fillStyle = colors[card.attr] || '#FFFFFF'
  ctx.fillRect(x, y, card.width, card.height)
  
  // 边框
  ctx.strokeStyle = gameState.selectedCard && gameState.selectedCard.card === card ? '#FFD700' : '#FFFFFF'
  ctx.lineWidth = gameState.selectedCard && gameState.selectedCard.card === card ? 3 : 2
  ctx.strokeRect(x, y, card.width, card.height)
  
  // 属性（顶部）
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(card.attrEmoji, x + card.width / 2, y + 25)
  
  // 箭头（中间，大字体）
  ctx.font = 'bold 40px Arial'
  ctx.fillText(card.arrow, x + card.width / 2, y + card.height / 2 + 12)
  
  // 血量（左上）
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'left'
  const hpText = card.hp === '∞' ? '∞' : `HP:${card.hp}`
  ctx.fillText(hpText, x + 5, y + 15)
  
  // 分数（底部）
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillText(`+${card.score}`, x + card.width / 2, y + card.height - 15)
  
  // 能力图标（右上）
  if (card.ability) {
    ctx.font = '16px Arial'
    ctx.fillText(card.ability.icon, x + card.width - 12, y + 15)
  }
  
  ctx.restore()
}

// 处理触摸事件
wx.onTouchStart((res) => {
  if (gameState.gameOver) return
  
  const touch = res.touches[0]
  const x = touch.clientX
  const y = touch.clientY
  
  // 卡牌尺寸（与 render 一致）
  const cardWidth = 80
  const cardHeight = 112
  const cardGap = 10
  const totalHeight = CONFIG.HAND_SIZE * cardHeight + (CONFIG.HAND_SIZE - 1) * cardGap
  const startY = (canvas.height - totalHeight) / 2
  
  // 检查玩家 1 区域（左侧）
  const player1X = 40
  gameState.player1.hand.forEach((card, index) => {
    const cardY = startY + index * (cardHeight + cardGap)
    if (x >= player1X && x <= player1X + cardWidth && y >= cardY && y <= cardY + cardHeight) {
      handleCardClick(1, index)
    }
  })
  
  // 检查玩家 2 区域（右侧）
  const player2X = canvas.width - cardWidth - 40
  gameState.player2.hand.forEach((card, index) => {
    const cardY = startY + index * (cardHeight + cardGap)
    if (x >= player2X && x <= player2X + cardWidth && y >= cardY && y <= cardY + cardHeight) {
      handleCardClick(2, index)
    }
  })
})

// 处理卡牌点击
function handleCardClick(player, index) {
  if (gameState.gameOver) return
  
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card || card.triggered) return
  
  if (gameState.waitingForAbility && gameState.selectedCard) {
    handleAbilityTarget(player, index)
    return
  }
  
  gameState.selectedCard = { player, index, card }
  addLog(`${player === 1 ? '玩家 1' : '玩家 2'} 选择了 ${card.attrEmoji}`)
  
  if (card.ability) {
    gameState.waitingForAbility = true
    addLog(`使用能力：${card.ability.icon} ${card.ability.name}`)
  } else {
    resolveChain(player, index)
  }
  
  render()
}

// 处理能力目标
function handleAbilityTarget(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const targetCard = hand[index]
  if (!targetCard) return
  
  const ability = gameState.selectedCard.card.ability
  
  if (ability.id === 1) {
    const arrowMap = { '↑': '→', '→': '↓', '↓': '←', '←': '↑' }
    targetCard.arrow = arrowMap[targetCard.arrow]
    addLog(`${ability.icon} 旋转 ${targetCard.attrEmoji} 箭头→${targetCard.arrow}`)
    gameState.waitingForAbility = false
    resolveChain(gameState.selectedCard.player, gameState.selectedCard.index)
  } else if (ability.id === 2) {
    targetCard.attr = gameState.selectedCard.card.attr
    targetCard.attrEmoji = gameState.selectedCard.card.attrEmoji
    addLog(`${ability.icon} ${targetCard.attrEmoji} 变为 ${gameState.selectedCard.card.attr}`)
    gameState.waitingForAbility = false
    resolveChain(gameState.selectedCard.player, gameState.selectedCard.index)
  } else if (ability.id === 3) {
    if (!gameState.abilityTarget1) {
      gameState.abilityTarget1 = { player, index, card: targetCard }
      addLog('请选择第二张牌')
    } else {
      const target2 = gameState.abilityTarget1
      const temp = { ...hand[target2.index] }
      hand[target2.index] = { ...targetCard }
      hand[index] = { ...temp }
      addLog(`${ability.icon} 交换位置 ${target2.index + 1} 和 ${index + 1}`)
      gameState.waitingForAbility = false
      gameState.abilityTarget1 = null
      resolveChain(gameState.selectedCard.player, gameState.selectedCard.index)
    }
  }
  render()
}

// 解析连线
function resolveChain(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const startCard = hand[index]
  if (!startCard) return
  
  startCard.triggered = true
  gameState.triggeredCards.push({ ...startCard })
  
  const points = startCard.score
  if (player === 1) gameState.player1.score += points
  else gameState.player2.score += points
  
  addLog(`${player === 1 ? '玩家 1' : '玩家 2'} 触发 ${startCard.attrEmoji} 获得 +${points}分`)
  
  if (gameState.player1.score >= CONFIG.WIN_SCORE || gameState.player2.score >= CONFIG.WIN_SCORE) {
    gameState.gameOver = true
    addLog('🎉 游戏结束！')
  } else {
    applyDecay(hand)
    applyDecay(player === 1 ? gameState.player2.hand : gameState.player1.hand)
    refillHand(player === 1 ? gameState.player1 : gameState.player2)
    
    if (gameState.currentPlayer === 1) gameState.currentPlayer = 2
    else {
      gameState.currentPlayer = 1
      gameState.round++
    }
    addLog(`--- 回合 ${gameState.round} ---`)
  }
  
  gameState.selectedCard = null
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  gameState.waitingForAbility = false
  render()
}

// 应用衰减
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
          addLog(`☠️ ${card.attrEmoji} 死亡，扣 1 分`)
        }
      } else {
        card.hp = newHp
      }
    }
  })
}

// 补充手牌
function refillHand(player) {
  const needed = CONFIG.HAND_SIZE - player.hand.filter(c => c).length
  for (let i = 0; i < needed && player.deck.length > 0; i++) {
    player.hand.push(player.deck.pop())
  }
  if (needed > 0) addLog(`补充 ${needed} 张牌`)
}

// 游戏主循环
function gameLoop() {
  render()
  requestAnimationFrame(gameLoop)
}

// 启动游戏
initGame()
gameLoop()
