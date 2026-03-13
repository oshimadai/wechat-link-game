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
  HAND_SIZE: 5,  // ✅ 每名玩家 5 张手牌
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
  // 🔥 火属性 22 张
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
  // 💧 水属性 22 张
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
  // 🌿 木属性 22 张
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
  // 🌈 万能属性 4 张
  { attr: 'wild', hp: 3, score: 1, arrow: '→', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '↑', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '↓', abilityId: null },
  { attr: 'wild', hp: 3, score: 1, arrow: '←', abilityId: null },
]

// 游戏状态
let gameState = {
  player1: {
    hand: [],
    deck: [],
    score: 0,
    penalty: 0,
    tokens: { fire: 0, water: 0, wood: 0 }
  },
  player2: {
    hand: [],
    deck: [],
    score: 0,
    penalty: 0,
    tokens: { fire: 0, water: 0, wood: 0 }
  },
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

// 创建卡牌对象
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
  // 洗牌
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

// 初始化游戏
function initGame() {
  console.log('初始化游戏 v3.22')
  
  // 创建玩家
  gameState.player1 = {
    hand: [],
    deck: generateDeck(),
    score: 0,
    penalty: 0,
    tokens: { fire: 0, water: 0, wood: 0 }
  }
  gameState.player2 = {
    hand: [],
    deck: generateDeck(),
    score: 0,
    penalty: 0,
    tokens: { fire: 0, water: 0, wood: 0 }
  }
  
  // 各抽 5 张牌
  for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
    if (gameState.player1.deck.length > 0) {
      gameState.player1.hand.push(gameState.player1.deck.pop())
    }
    if (gameState.player2.deck.length > 0) {
      gameState.player2.hand.push(gameState.player2.deck.pop())
    }
  }
  
  // 重置状态
  gameState.currentPlayer = 1
  gameState.round = 1
  gameState.selectedCard = null
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  gameState.waitingForAbility = false
  gameState.triggeredCards = []
  gameState.gameOver = false
  gameState.gameLog = ['🎮 游戏开始！', `玩家 1 和玩家 2 各抽取 5 张牌`]
  
  addLog(`玩家 1 手牌：${gameState.player1.hand.map(c => c.attrEmoji).join(' ')}`)
  addLog(`玩家 2 手牌：${gameState.player2.hand.map(c => c.attrEmoji).join(' ')}`)
  
  updateUI()
}

// 添加日志
function addLog(message) {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  gameState.gameLog.unshift(`[${timestamp}] ${message}`)
  if (gameState.gameLog.length > 50) {
    gameState.gameLog.pop()
  }
}

// 更新 UI
function updateUI() {
  const currentPage = getCurrentPages()[getCurrentPages().length - 1]
  if (currentPage && currentPage.setData) {
    currentPage.setData({
      player1Cards: gameState.player1.hand,
      player2Cards: gameState.player2.hand,
      score1: gameState.player1.score,
      score2: gameState.player2.score,
      penalty1: gameState.player1.penalty,
      penalty2: gameState.player2.penalty,
      tokens: {
        ...gameState.player1.tokens,
        ...gameState.player2.tokens
      },
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

// 玩家 1 区域
function getPlayer1Hand() {
  return gameState.player1.hand
}

// 玩家 2 区域
function getPlayer2Hand() {
  return gameState.player2.hand
}

// 处理卡牌点击
function handleCardTap(player, index) {
  if (gameState.gameOver) return
  
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const card = hand[index]
  
  if (!card || card.triggered) return
  
  // 如果正在等待能力目标
  if (gameState.waitingForAbility && gameState.selectedCard) {
    handleAbilityTarget(player, index)
    return
  }
  
  // 选择卡牌
  gameState.selectedCard = { player, index, card }
  addLog(`${player === 1 ? '玩家 1' : '玩家 2'} 选择了 ${card.attrEmoji}`)
  
  // 如果有能力，等待选择目标
  if (card.ability) {
    gameState.waitingForAbility = true
    addLog(`使用能力：${card.ability.icon} ${card.ability.name}`)
  } else {
    // 没有能力，直接触发连线
    resolveChain(player, index)
  }
  
  updateUI()
}

// 处理能力目标选择
function handleAbilityTarget(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const targetCard = hand[index]
  
  if (!targetCard) return
  
  const ability = gameState.selectedCard.card.ability
  
  if (ability.id === 1) {
    // 旋转
    targetCard.arrow = rotateArrow(targetCard.arrow)
    addLog(`${ability.icon} 旋转 ${targetCard.attrEmoji} 箭头→${targetCard.arrow}`)
    gameState.waitingForAbility = false
    resolveChain(gameState.selectedCard.player, gameState.selectedCard.index)
  } else if (ability.id === 2) {
    // 变色
    targetCard.attr = gameState.selectedCard.card.attr
    targetCard.attrEmoji = gameState.selectedCard.card.attrEmoji
    addLog(`${ability.icon} ${targetCard.attrEmoji} 变为 ${gameState.selectedCard.card.attr}`)
    gameState.waitingForAbility = false
    resolveChain(gameState.selectedCard.player, gameState.selectedCard.index)
  } else if (ability.id === 3) {
    // 换位 - 需要选择第二张牌
    if (!gameState.abilityTarget1) {
      gameState.abilityTarget1 = { player, index, card: targetCard }
      addLog(`请选择第二张牌`)
    } else {
      const target2 = gameState.abilityTarget1
      // 交换
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

// 旋转箭头
function rotateArrow(arrow) {
  const map = { '↑': '→', '→': '↓', '↓': '←', '←': '↑' }
  return map[arrow] || arrow
}

// 解析连线
function resolveChain(player, index) {
  const hand = player === 1 ? gameState.player1.hand : gameState.player2.hand
  const opponentHand = player === 1 ? gameState.player2.hand : gameState.player1.hand
  const startCard = hand[index]
  
  if (!startCard) return
  
  // 标记为已触发
  startCard.triggered = true
  gameState.triggeredCards.push({ ...startCard })
  
  // 计算分数
  const points = startCard.score
  if (player === 1) {
    gameState.player1.score += points
  } else {
    gameState.player2.score += points
  }
  
  addLog(`${player === 1 ? '玩家 1' : '玩家 2'} 触发 ${startCard.attrEmoji} 获得 +${points}分`)
  
  // 检查胜利
  if (gameState.player1.score >= CONFIG.WIN_SCORE || gameState.player2.score >= CONFIG.WIN_SCORE) {
    gameState.gameOver = true
    addLog(`🎉 游戏结束！`)
  } else {
    // 衰减阶段
    applyDecay(hand)
    applyDecay(opponentHand)
    
    // 补充手牌
    refillHand(player === 1 ? gameState.player1 : gameState.player2)
    
    // 交换回合
    if (gameState.currentPlayer === 1) {
      gameState.currentPlayer = 2
    } else {
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
  hand.forEach((card, index) => {
    if (!card.triggered && card.hp !== '∞') {
      const newHp = typeof card.hp === 'number' ? card.hp - 1 : card.hp
      if (newHp <= 0) {
        // 卡牌死亡
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
  if (needed > 0) {
    addLog(`补充 ${needed} 张牌`)
  }
}

// 取消选择
function cancelSelection() {
  gameState.selectedCard = null
  gameState.waitingForAbility = false
  gameState.abilityTarget1 = null
  gameState.abilityTarget2 = null
  addLog('❌ 取消选择')
  updateUI()
}

// 使用 Token
function useToken(type) {
  if (gameState.gameOver) return
  
  const player = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2
  
  if (player.tokens[type] <= 0) {
    addLog(`没有${type}Token`)
    return
  }
  
  player.tokens[type]--
  addLog(`使用${type}Token`)
  
  // TODO: 实现 Token 效果
  
  updateUI()
}

// 显示规则
function showRules() {
  const currentPage = getCurrentPages()[getCurrentPages().length - 1]
  if (currentPage && currentPage.setData) {
    currentPage.setData({ showRulesModal: true })
  }
}

// 隐藏规则
function hideRules() {
  const currentPage = getCurrentPages()[getCurrentPages().length - 1]
  if (currentPage && currentPage.setData) {
    currentPage.setData({ showRulesModal: false })
  }
}

// Page 生命周期
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

  // 开始游戏
  startGame() {
    initGame()
    this.setData({ showRulesModal: false })
  },

  // 显示规则
  showRules() {
    showRules()
  },

  // 隐藏规则
  hideRules() {
    hideRules()
  },

  // 处理卡牌点击
  handleCardTap(e) {
    const { player, index } = e.currentTarget.dataset
    handleCardTap(parseInt(player), parseInt(index))
  },

  // 处理能力点击
  handleAbilityTap(e) {
    console.log('能力点击', e)
  },

  // 取消选择
  cancelSelection() {
    cancelSelection()
  },

  // 使用 Token
  useToken(e) {
    const { type } = e.currentTarget.dataset
    useToken(type)
  }
})
