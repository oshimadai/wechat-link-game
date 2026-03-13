// index.js - 微信小程序页面逻辑
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
  
  updateUI()
}

// 添加日志
function addLog(message) {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  gameState.gameLog.unshift(`[${timestamp}] ${message}`)
  if (gameState.gameLog.length > 50) gameState.gameLog.pop()
  updateUI()
}

// 更新 UI
function updateUI() {
  const page = getCurrentPages()[getCurrentPages().length - 1]
  if (page && page.setData) {
    page.setData({
      player1Cards: gameState.player1.hand,
      player2Cards: gameState.player2.hand,
      score1: gameState.player1.score,
      score2: gameState.player2.score,
      penalty1: gameState.player1.penalty,
      penalty2: gameState.player2.penalty,
      tokens: { ...gameState.player1.tokens, ...gameState.player2.tokens },
      currentPlayer: gameState.currentPlayer,
      round: gameState.round,
      selectedCard: gameState.selectedCard,
      actionPrompt: gameState.waitingForAbility ? '请选择能力目标' : '',
      triggeredCards: gameState.triggeredCards,
      gameLog: gameState.gameLog,
      gameOver: gameState.gameOver,
      winnerText: gameState.gameOver ? (gameState.player1.score >= CONFIG.WIN_SCORE ? '🎉 玩家 1 获胜！' : '🎉 玩家 2 获胜！') : '',
      finalScore: `玩家 1: ${gameState.player1.score}分 | 玩家 2: ${gameState.player2.score}分`
    })
  }
}

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
  
  updateUI()
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
  updateUI()
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
  updateUI()
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

// 取消选择（全局函数）
function cancelSelectionGlobal() {
  gameState.selectedCard = null
  gameState.waitingForAbility = false
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  addLog('❌ 取消选择')
  updateUI()
}

// 使用 Token（全局函数）
function useTokenGlobal(type) {
  if (gameState.gameOver) return
  const player = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2
  if (player.tokens[type] <= 0) {
    addLog(`没有${type}Token`)
    return
  }
  player.tokens[type]--
  addLog(`使用${type}Token`)
  updateUI()
}

Page({
  data: {
    player1Cards: [],
    player2Cards: [],
    score1: 0,
    score2: 0,
    penalty1: 0,
    penalty2: 0,
    tokens: { fire: 0, water: 0, wood: 0 },
    currentPlayer: 1,
    round: 1,
    selectedCard: null,
    actionPrompt: '',
    triggeredCards: [],
    gameLog: [],
    gameOver: false,
    winnerText: '',
    finalScore: '',
    showRulesModal: false
  },

  onLoad() {
    console.log('小程序加载')
  },

  onReady() {
    console.log('小程序就绪')
  },

  startGame() {
    initGame()
    this.setData({ showRulesModal: false })
  },

  showRules() {
    this.setData({ showRulesModal: true })
  },

  hideRules() {
    this.setData({ showRulesModal: false })
  },

  handleCardTap(e) {
    const { player, index } = e.currentTarget.dataset
    handleCardClick(parseInt(player), parseInt(index))
  },

  handleAbilityTap(e) {
    console.log('能力点击', e)
  },

  cancelSelection() {
    cancelSelectionGlobal()
  },

  useToken(e) {
    const { type } = e.currentTarget.dataset
    useTokenGlobal(type)
  }
})
