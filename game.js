/**
 * 1V1 连线桌游 - 微信小游戏
 * 核心玩法：连线相同属性的卡牌来得分
 */

// 游戏配置
const CONFIG = {
  CARD_WIDTH: 80,
  CARD_HEIGHT: 110,
  CARD_GAP: 10,
  GRID_COLS: 6,
  GRID_ROWS: 6,
  ATTRS: ['fire', 'water', 'wood'], // 火、水、木
  ATTR_COLORS: {
    fire: '#FF6464',
    water: '#6464FF',
    wood: '#64FF64'
  }
}

// 游戏状态
let gameState = {
  cards: [],
  selectedCard: null,
  score1: 0,
  score2: 0,
  currentPlayer: 1,
  tokens: { fire: 0, water: 0, wood: 0 }
}

// 获取 canvas 和上下文
const canvas = wx.getSharedCanvas ? wx.getSharedCanvas() : wx.createCanvas()
const ctx = canvas.getContext('2d')

// 初始化游戏
function initGame() {
  console.log('初始化游戏')
  
  // 创建卡牌网格
  gameState.cards = []
  for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
    for (let col = 0; col < CONFIG.GRID_COLS; col++) {
      const attr = CONFIG.ATTRS[Math.floor(Math.random() * CONFIG.ATTRS.length)]
      const hp = Math.floor(Math.random() * 4) + 1 // 1-4 血
      gameState.cards.push({
        id: `card_${row}_${col}`,
        row,
        col,
        attr,
        hp,
        maxHp: hp,
        score: 0,
        x: 50 + col * (CONFIG.CARD_WIDTH + CONFIG.CARD_GAP),
        y: 150 + row * (CONFIG.CARD_HEIGHT + CONFIG.CARD_GAP),
        width: CONFIG.CARD_WIDTH,
        height: CONFIG.CARD_HEIGHT
      })
    }
  }
  
  gameState.selectedCard = null
  gameState.score1 = 0
  gameState.score2 = 0
  gameState.currentPlayer = 1
  gameState.tokens = { fire: 0, water: 0, wood: 0 }
  
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
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('1V1 连线桌游', canvas.width / 2, 40)
  
  // 绘制玩家信息
  ctx.font = '16px Arial'
  ctx.fillText(`玩家 1 得分：${gameState.score1}`, 100, 80)
  ctx.fillText(`玩家 2 得分：${gameState.score2}`, canvas.width - 100, 80)
  
  // 绘制当前玩家
  ctx.fillStyle = gameState.currentPlayer === 1 ? '#FFD700' : '#FFFFFF'
  ctx.fillText(`当前：玩家${gameState.currentPlayer}`, canvas.width / 2, 100)
  
  // 绘制卡牌
  gameState.cards.forEach(card => {
    drawCard(card)
  })
  
  // 绘制操作提示
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '14px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('点击卡牌选择，再次点击相邻卡牌连线', 20, canvas.height - 20)
}

// 绘制单张卡牌
function drawCard(card) {
  const { x, y, width, height, attr, hp } = card
  
  // 卡牌背景
  ctx.fillStyle = CONFIG.ATTR_COLORS[attr] || '#FFFFFF'
  ctx.fillRect(x, y, width, height)
  
  // 卡牌边框
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, width, height)
  
  // 选中效果
  if (gameState.selectedCard === card) {
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 4
    ctx.strokeRect(x - 2, y - 2, width + 4, height + 4)
  }
  
  // 血量
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(`HP:${hp}`, x + 5, y + 20)
  
  // 属性文字
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  const attrNames = { fire: '火', water: '水', wood: '木' }
  ctx.fillText(attrNames[attr] || attr, x + width / 2, y + height / 2)
}

// 处理触摸事件
wx.onTouchStart && wx.onTouchStart((e) => {
  const touch = e.touches[0]
  const x = touch.clientX
  const y = touch.clientY
  
  console.log(`触摸：(${x}, ${y})`)
  
  // 检查是否点击到卡牌
  for (let card of gameState.cards) {
    if (x >= card.x && x <= card.x + card.width &&
        y >= card.y && y <= card.y + card.height) {
      handleCardClick(card)
      return
    }
  }
})

// 处理卡牌点击
function handleCardClick(card) {
  console.log(`点击卡牌：${card.id}, 属性：${card.attr}, 血量：${card.hp}`)
  
  if (gameState.selectedCard === null) {
    // 选择第一张牌
    gameState.selectedCard = card
    console.log('选择第一张牌')
  } else if (gameState.selectedCard === card) {
    // 取消选择
    gameState.selectedCard = null
    console.log('取消选择')
  } else {
    // 尝试连线
    tryLink(gameState.selectedCard, card)
  }
  
  render()
}

// 尝试连线
function tryLink(card1, card2) {
  console.log(`尝试连线：${card1.id} <-> ${card2.id}`)
  
  // 检查是否相邻
  const isAdjacent = (
    (Math.abs(card1.row - card2.row) === 1 && card1.col === card2.col) ||
    (Math.abs(card1.col - card2.col) === 1 && card1.row === card2.row)
  )
  
  if (!isAdjacent) {
    console.log('不相邻，无法连线')
    gameState.selectedCard = null
    return
  }
  
  // 检查属性是否相同
  if (card1.attr !== card2.attr) {
    console.log('属性不同，无法连线')
    gameState.selectedCard = null
    return
  }
  
  // 连线成功！
  console.log('连线成功！')
  
  // 计算得分
  const linkScore = card1.hp + card2.hp
  console.log(`连线得分：${linkScore}`)
  
  // 更新分数
  if (gameState.currentPlayer === 1) {
    gameState.score1 += linkScore
  } else {
    gameState.score2 += linkScore
  }
  
  // 获得 Token
  gameState.tokens[card1.attr]++
  console.log(`获得${card1.attr} Token`)
  
  // 切换玩家
  gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1
  
  // 清除选择
  gameState.selectedCard = null
  
  // 衰减其他卡牌
  applyDecay()
  
  // 检查游戏结束
  checkGameOver()
}

// 应用衰减（每回合未触发的卡牌 -1 血）
function applyDecay() {
  gameState.cards.forEach(card => {
    if (card.hp > 0) {
      card.hp--
      if (card.hp <= 0) {
        console.log(`卡牌${card.id}死亡`)
      }
    }
  })
}

// 检查游戏结束
function checkGameOver() {
  if (gameState.score1 >= 30 || gameState.score2 >= 30) {
    const winner = gameState.score1 >= 30 ? '玩家 1' : '玩家 2'
    console.log(`游戏结束！${winner}获胜！`)
    
    wx.showModal({
      title: '游戏结束',
      content: `${winner}获胜！`,
      showCancel: false,
      success: () => {
        initGame()
      }
    })
  }
}

// 启动游戏
console.log('游戏启动')
initGame()
