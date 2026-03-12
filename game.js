/**
 * 1V1 连线桌游 - 微信小游戏
 * 规则版本：v2.0
 * 
 * 核心规则：
 * - 连线：只能相同属性连接（火/水/木）
 * - 衰减：每回合结束未触发卡牌 -1 血
 * - 胜利：率先达到 30 分 (公平回合)
 * - 血量分布：0 血 5%、1 血 15%、2 血 35%、4 血 45%
 * - 特殊卡：无限血量 3 张 + 万能属性 4 张
 * - Token：单次连线≥3 张获得对应属性 Token
 * - 分数：4 血 +1/2 血 +2/1 血 +3/0 血 0，死亡每张 -1 分
 */

// 游戏配置
const CONFIG = {
  CARD_WIDTH: 80,
  CARD_HEIGHT: 110,
  CARD_GAP: 10,
  GRID_COLS: 6,
  GRID_ROWS: 6,
  ATTRS: ['fire', 'water', 'wood', 'universal'], // 火、水、木、万能
  ATTR_COLORS: {
    fire: '#FF6464',
    water: '#6464FF',
    wood: '#64FF64',
    universal: '#FFFF64'
  },
  // 血量分布（67 张牌）
  HP_DISTRIBUTION: {
    '0': 0.05,  // 5%
    '1': 0.15,  // 15%
    '2': 0.35,  // 35%
    '4': 0.45   // 45%
  },
  // 得分规则
  SCORE_RULES: {
    '4': 1,
    '2': 2,
    '1': 3,
    '0': 0,
    'infinity': 0  // 无限血卡牌不计分
  },
  // 特殊卡数量
  SPECIAL_CARDS: {
    infinity: 3,  // 无限血 3 张
    universal: 4  // 万能属性 4 张
  },
  WIN_SCORE: 30  // 胜利分数
}

// 游戏状态
let gameState = {
  deck: [],           // 牌库
  cards: [],          // 场上卡牌
  selectedCard: null, // 当前选择的卡牌
  score1: 0,          // 玩家 1 分数
  score2: 0,          // 玩家 2 分数
  currentPlayer: 1,   // 当前玩家
  tokens: { fire: 0, water: 0, wood: 0 }, // Token 计数
  linkedCards: [],    // 本回合已连线的卡牌（用于衰减判断）
  round: 1            // 回合数
}

// 获取 canvas
const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

// 创建牌组（67 张）
function createDeck() {
  const deck = []
  let cardId = 0
  
  // 计算各血量牌的数量（67 张 - 3 张无限血 - 4 张万能 = 60 张普通牌）
  const normalCards = 60
  const hp0 = Math.round(normalCards * 0.05)
  const hp1 = Math.round(normalCards * 0.15)
  const hp2 = Math.round(normalCards * 0.35)
  const hp4 = normalCards - hp0 - hp1 - hp2
  
  console.log(`牌组配置：0 血${hp0}张，1 血${hp1}张，2 血${hp2}张，4 血${hp4}张，无限血 3 张，万能 4 张`)
  
  // 添加普通牌（火/水/木）
  const attrs = ['fire', 'water', 'wood']
  const hpTypes = [
    { hp: 0, count: hp0 },
    { hp: 1, count: hp1 },
    { hp: 2, count: hp2 },
    { hp: 4, count: hp4 }
  ]
  
  hpTypes.forEach(({ hp, count }) => {
    const perAttr = Math.floor(count / 3)
    attrs.forEach(attr => {
      for (let i = 0; i < perAttr; i++) {
        deck.push({
          id: `card_${cardId++}`,
          attr,
          hp,
          maxHp: hp,
          isInfinite: false
        })
      }
    })
  })
  
  // 添加无限血牌（3 张，随机属性）
  for (let i = 0; i < CONFIG.SPECIAL_CARDS.infinity; i++) {
    const attr = attrs[Math.floor(Math.random() * attrs.length)]
    deck.push({
      id: `card_${cardId++}`,
      attr,
      hp: Infinity,
      maxHp: Infinity,
      isInfinite: true
    })
  }
  
  // 添加万能牌（4 张）
  for (let i = 0; i < CONFIG.SPECIAL_CARDS.universal; i++) {
    deck.push({
      id: `card_${cardId++}`,
      attr: 'universal',
      hp: 2,  // 万能牌默认 2 血
      maxHp: 2,
      isInfinite: false
    })
  }
  
  // 洗牌
  shuffleDeck(deck)
  
  return deck
}

// 洗牌算法
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
}

// 初始化游戏
function initGame() {
  console.log('初始化游戏')
  
  // 创建牌库
  gameState.deck = createDeck()
  
  // 发牌到场上（6x6 网格 = 36 张）
  gameState.cards = []
  for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
    for (let col = 0; col < CONFIG.GRID_COLS; col++) {
      const template = gameState.deck.pop()
      if (template) {
        gameState.cards.push({
          ...template,
          row,
          col,
          x: 50 + col * (CONFIG.CARD_WIDTH + CONFIG.CARD_GAP),
          y: 150 + row * (CONFIG.CARD_HEIGHT + CONFIG.CARD_GAP),
          width: CONFIG.CARD_WIDTH,
          height: CONFIG.CARD_HEIGHT,
          linked: false  // 本回合是否被连线
        })
      }
    }
  }
  
  gameState.selectedCard = null
  gameState.score1 = 0
  gameState.score2 = 0
  gameState.currentPlayer = 1
  gameState.tokens = { fire: 0, water: 0, wood: 0 }
  gameState.linkedCards = []
  gameState.round = 1
  
  render()
}

// 渲染游戏
function render() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制背景
  ctx.fillStyle = '#2C3E50'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制标题
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('1V1 连线桌游 v2.0', canvas.width / 2, 30)
  
  // 绘制玩家信息
  ctx.font = '14px Arial'
  ctx.fillText(`玩家 1: ${gameState.score1}分`, 80, 60)
  ctx.fillText(`玩家 2: ${gameState.score2}分`, canvas.width - 80, 60)
  
  // 绘制当前玩家
  ctx.fillStyle = gameState.currentPlayer === 1 ? '#FFD700' : '#FFFFFF'
  ctx.fillText(`当前：玩家${gameState.currentPlayer}`, canvas.width / 2, 60)
  
  // 绘制 Token
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '12px Arial'
  ctx.fillText(`🔥${gameState.tokens.fire} 💧${gameState.tokens.water} 🌿${gameState.tokens.wood}`, canvas.width / 2, 80)
  
  // 绘制回合数
  ctx.fillText(`回合：${gameState.round}`, canvas.width / 2, 95)
  
  // 绘制卡牌
  gameState.cards.forEach(card => {
    if (card.hp > 0 || card.isInfinite) {
      drawCard(card)
    }
  })
  
  // 绘制操作提示
  ctx.fillStyle = '#AAAAAA'
  ctx.font = '12px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('点击卡牌选择，再点击相邻同属性卡牌连线', 20, canvas.height - 15)
}

// 绘制单张卡牌
function drawCard(card) {
  const { x, y, width, height, attr, hp, isInfinite, linked } = card
  
  // 卡牌背景
  ctx.fillStyle = CONFIG.ATTR_COLORS[attr] || '#FFFFFF'
  ctx.fillRect(x, y, width, height)
  
  // 卡牌边框
  ctx.strokeStyle = linked ? '#FFD700' : '#FFFFFF'
  ctx.lineWidth = linked ? 3 : 2
  ctx.strokeRect(x, y, width, height)
  
  // 选中效果
  if (gameState.selectedCard === card) {
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 4
    ctx.strokeRect(x - 2, y - 2, width + 4, height + 4)
  }
  
  // 血量显示
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'left'
  const hpText = isInfinite ? '∞' : `HP:${hp}`
  ctx.fillText(hpText, x + 5, y + 18)
  
  // 属性文字
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  const attrNames = { fire: '火', water: '水', wood: '木', universal: '万' }
  ctx.fillText(attrNames[attr] || attr, x + width / 2, y + height / 2 + 5)
  
  // 得分提示（小字）
  if (!isInfinite && hp > 0) {
    const score = CONFIG.SCORE_RULES[hp.toString()] || 0
    ctx.font = '10px Arial'
    ctx.fillStyle = '#EEEEEE'
    ctx.fillText(`+${score}`, x + width - 15, y + 15)
  }
}

// 处理触摸事件
wx.onTouchStart((e) => {
  const touch = e.touches[0]
  const x = touch.clientX
  const y = touch.clientY
  
  // 检查是否点击到卡牌
  for (let card of gameState.cards) {
    if (card.hp > 0 || card.isInfinite) {
      if (x >= card.x && x <= card.x + card.width &&
          y >= card.y && y <= card.y + card.height) {
        handleCardClick(card)
        return
      }
    }
  }
})

// 处理卡牌点击
function handleCardClick(card) {
  console.log(`点击卡牌：${card.id}, 属性：${card.attr}, 血量：${card.hp}`)
  
  if (gameState.selectedCard === null) {
    // 选择第一张牌
    gameState.selectedCard = card
  } else if (gameState.selectedCard === card) {
    // 取消选择
    gameState.selectedCard = null
  } else {
    // 尝试连线
    tryLink(gameState.selectedCard, card)
  }
  
  render()
}

// 尝试连线
function tryLink(card1, card2) {
  console.log(`尝试连线`)
  
  // 检查是否相邻
  const isAdjacent = (
    (Math.abs(card1.row - card2.row) === 1 && card1.col === card2.col) ||
    (Math.abs(card1.col - card2.col) === 1 && card1.row === card2.row)
  )
  
  if (!isAdjacent) {
    console.log('不相邻')
    gameState.selectedCard = null
    return
  }
  
  // 检查属性是否相同（万能牌可以匹配任何属性）
  const attrMatch = (
    card1.attr === card2.attr ||
    card1.attr === 'universal' ||
    card2.attr === 'universal'
  )
  
  if (!attrMatch) {
    console.log('属性不同')
    gameState.selectedCard = null
    return
  }
  
  // 连线成功！
  console.log('连线成功！')
  
  // 标记已连线
  card1.linked = true
  card2.linked = true
  gameState.linkedCards.push(card1, card2)
  
  // 计算得分（按血量规则）
  const score1 = card1.isInfinite ? 0 : (CONFIG.SCORE_RULES[card1.hp] || 0)
  const score2 = card2.isInfinite ? 0 : (CONFIG.SCORE_RULES[card2.hp] || 0)
  const totalScore = score1 + score2
  
  console.log(`连线得分：${totalScore}`)
  
  // 更新分数
  if (gameState.currentPlayer === 1) {
    gameState.score1 += totalScore
  } else {
    gameState.score2 += totalScore
  }
  
  // 检查 Token 获取（连线≥3 张才获得）
  // 这里简化：每次成功连线都检查是否需要给 Token
  // 实际应该统计连续连线数量
  const linkCount = gameState.linkedCards.length
  if (linkCount >= 3) {
    const tokenAttr = card1.attr === 'universal' ? card2.attr : card1.attr
    if (tokenAttr !== 'universal') {
      gameState.tokens[tokenAttr]++
      console.log(`获得${tokenAttr} Token`)
    }
  }
  
  // 清除选择
  gameState.selectedCard = null
  
  // 检查是否结束回合（简单规则：每次连线后结束回合）
  endTurn()
}

// 结束回合
function endTurn() {
  console.log('结束回合')
  
  // 应用衰减（未连线的卡牌 -1 血）
  applyDecay()
  
  // 检查死亡卡牌并扣分
  applyDeathPenalty()
  
  // 重置连线状态
  gameState.cards.forEach(card => {
    card.linked = false
  })
  gameState.linkedCards = []
  
  // 切换玩家
  gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1
  
  // 回合数 +1
  if (gameState.currentPlayer === 1) {
    gameState.round++
  }
  
  // 检查游戏结束
  checkGameOver()
  
  render()
}

// 应用衰减
function applyDecay() {
  gameState.cards.forEach(card => {
    if (!card.linked && card.hp > 0 && !card.isInfinite) {
      card.hp--
      console.log(`卡牌${card.id}衰减，剩余${card.hp}血`)
    }
  })
}

// 应用死亡惩罚
function applyDeathPenalty() {
  gameState.cards.forEach(card => {
    if (card.hp <= 0 && !card.isInfinite) {
      // 死亡扣分（-1 分）
      if (gameState.currentPlayer === 1) {
        gameState.score2 -= 1  // 对手死亡，当前玩家扣分（公平规则）
      } else {
        gameState.score1 -= 1
      }
      console.log(`卡牌死亡，扣 1 分`)
    }
  })
}

// 检查游戏结束
function checkGameOver() {
  // 检查是否有人达到 30 分
  if (gameState.score1 >= CONFIG.WIN_SCORE || gameState.score2 >= CONFIG.WIN_SCORE) {
    // 公平回合规则：如果一人达到 30 分，另一人还有一次机会
    // 简化处理：直接结束
    const winner = gameState.score1 >= CONFIG.WIN_SCORE ? '玩家 1' : '玩家 2'
    console.log(`${winner}获胜！`)
    
    wx.showModal({
      title: '游戏结束',
      content: `${winner}获胜！最终比分 ${gameState.score1} : ${gameState.score2}`,
      showCancel: false,
      success: () => {
        initGame()
      }
    })
  }
}

// 启动游戏
console.log('游戏启动 - 规则 v2.0')
initGame()
