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
const { windowWidth, windowHeight } = wx.getSystemInfoSync()

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
    attrEmoji: CONFIG.ATTR_EMOJIS[data.attr]
  }
}

// 生成牌组
function generateDeck() {
  const deck = FIXED_DECK.map(data => createCard(data))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [deck[i], deck[j]] = [deck[j], deck[i]]
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
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('1V1 连线桌游 v3.22', canvas.width / 2, 25)
  
  // 玩家信息
  ctx.font = '14px Arial'
  ctx.fillText(`玩家 1: ${gameState.player1.score}分`, 80, 50)
  ctx.fillText(`玩家 2: ${gameState.player2.score}分`, canvas.width - 80, 50)
  
  // 当前玩家
  ctx.fillStyle = gameState.currentPlayer === 1 ? '#FFD700' : '#FFFFFF'
  ctx.fillText(`当前：玩家${gameState.currentPlayer}`, canvas.width / 2, 50)
  
  // Token
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '12px Arial'
  ctx.fillText(`🔥${gameState.player1.tokens.fire} 💧${gameState.player1.tokens.water} 🌿${gameState.player1.tokens.wood}`, canvas.width / 2, 68)
  
  // 回合
  ctx.fillText(`回合：${gameState.round}`, canvas.width / 2, 82)
  
  // 能力提示
  if (gameState.selectedCard && gameState.selectedCard.card.ability) {
    const ability = gameState.selectedCard.card.ability
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`能力：${ability.icon} ${ability.name} - 点击目标卡牌使用`, canvas.width / 2, 100)
  }
  
  // 绘制玩家 1 区域（上方，5 张牌）
  const cardWidth = 60
  const cardHeight = 84
  const cardGap = 8
  const totalWidth = CONFIG.HAND_SIZE * cardWidth + (CONFIG.HAND_SIZE - 1) * cardGap
  const startX = (canvas.width - totalWidth) / 2
  
  // 玩家 1 手牌
  gameState.player1.hand.forEach((card, index) => {
    if (card) {
      drawCard(card, startX + index * (cardWidth + cardGap), 120, false)
    }
  })
  
  // 玩家 2 手牌（下方，旋转 180°）
  gameState.player2.hand.forEach((card, index) => {
    if (card) {
      drawCard(card, startX + index * (cardWidth + cardGap), canvas.height - 120 - cardHeight, true)
    }
  })
  
  // 游戏日志
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(10, canvas.height - 100, canvas.width - 20, 90)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '10px Arial'
  ctx.textAlign = 'left'
  gameState.gameLog.slice(0, 5).forEach((log, index) => {
    ctx.fillText(log, 20, canvas.height - 85 + index * 15)
  })
  
  // 操作提示
  ctx.fillStyle = '#AAAAAA'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('点击卡牌选择，点击能力图标使用能力，或点击相邻同属性牌连线', canvas.width / 2, canvas.height - 15)
}

// 绘制卡牌
function drawCard(card, x, y, rotate180) {
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
  
  // 属性
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(card.attrEmoji, x + card.width / 2, y + card.height / 2 + 5)
  
  // 血量
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'left'
  const hpText = card.hp === '∞' ? '∞' : `HP:${card.hp}`
  ctx.fillText(hpText, x + 5, y + 18)
  
  // 分数
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`+${card.score}`, x + card.width / 2, y + card.height - 10)
  
  // 能力图标
  if (card.ability) {
    ctx.font = '14px Arial'
    ctx.fillText(card.ability.icon, x + card.width - 15, y + 18)
  }
  
  ctx.restore()
}

// 处理触摸事件
wx.onTouchStart((res) => {
  if (gameState.gameOver) return
  
  const touch = res.touches[0]
  const x = touch.clientX
  const y = touch.clientY
  
  const cardWidth = 60
  const cardHeight = 84
  const cardGap = 8
  const totalWidth = CONFIG.HAND_SIZE * cardWidth + (CONFIG.HAND_SIZE - 1) * cardGap
  const startX = (canvas.width - totalWidth) / 2
  
  // 检查玩家 1 区域
  gameState.player1.hand.forEach((card, index) => {
    const cardX = startX + index * (cardWidth + cardGap)
    const cardY = 120
    if (x >= cardX && x <= cardX + cardWidth && y >= cardY && y <= cardY + cardHeight) {
      handleCardClick(1, index)
    }
  })
  
  // 检查玩家 2 区域
  gameState.player2.hand.forEach((card, index) => {
    const cardX = startX + index * (cardWidth + cardGap)
    const cardY = canvas.height - 120 - cardHeight
    if (x >= cardX && x <= cardX + cardWidth && y >= cardY && y <= cardY + cardHeight) {
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
