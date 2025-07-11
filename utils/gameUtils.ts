export interface MathQuestion {
  question: string
  answer: number
  points: number
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
}

export interface Fruit {
  x: number
  y: number
  size: number
  type: string
  color: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
}

export interface Chicken {
  x: number
  y: number
  velocity: number
  size: number
  wingFlap: number
  lookDirection: number
  lastLookChange: number
  isFlapping: boolean
  flapDuration: number
  autoFlyTime: number
  isAutoFlying: boolean
  lastDamageTime: number
}

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'rock' | 'lightning'
}

/**
 * Generate math question based on difficulty level
 */
export const generateMathQuestion = (difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): MathQuestion => {
  let num1: number, num2: number, answer: number, question: string, points: number

  switch (difficulty) {
    case 'easy': // Apples - basic arithmetic
      const easyOps = ['+', '-']
      const easyOp = easyOps[Math.floor(Math.random() * easyOps.length)]
      if (easyOp === '+') {
        num1 = Math.floor(Math.random() * 25) + 1
        num2 = Math.floor(Math.random() * 25) + 1
        answer = num1 + num2
        question = `${num1} + ${num2} = ?`
      } else {
        num1 = Math.floor(Math.random() * 30) + 15
        num2 = Math.floor(Math.random() * num1) + 1
        answer = num1 - num2
        question = `${num1} - ${num2} = ?`
      }
      points = Math.floor(Math.random() * 20) + 10 // 10-30 points
      break

    case 'medium': // Oranges/Grapes - multiplication and larger numbers
      const mediumOps = ['+', '-', '*']
      const mediumOp = mediumOps[Math.floor(Math.random() * mediumOps.length)]
      if (mediumOp === '+') {
        num1 = Math.floor(Math.random() * 75) + 25
        num2 = Math.floor(Math.random() * 75) + 25
        answer = num1 + num2
        question = `${num1} + ${num2} = ?`
      } else if (mediumOp === '-') {
        num1 = Math.floor(Math.random() * 100) + 50
        num2 = Math.floor(Math.random() * 50) + 1
        answer = num1 - num2
        question = `${num1} - ${num2} = ?`
      } else {
        num1 = Math.floor(Math.random() * 15) + 1
        num2 = Math.floor(Math.random() * 15) + 1
        answer = num1 * num2
        question = `${num1} × ${num2} = ?`
      }
      points = Math.floor(Math.random() * 30) + 25 // 25-55 points
      break

    case 'hard': // Bananas - complex multiplication and division
      const hardOps = ['*', '÷', 'square']
      const hardOp = hardOps[Math.floor(Math.random() * hardOps.length)]
      if (hardOp === '*') {
        num1 = Math.floor(Math.random() * 25) + 10
        num2 = Math.floor(Math.random() * 25) + 10
        answer = num1 * num2
        question = `${num1} × ${num2} = ?`
      } else if (hardOp === '÷') {
        answer = Math.floor(Math.random() * 20) + 5
        num2 = Math.floor(Math.random() * 15) + 2
        num1 = answer * num2
        question = `${num1} ÷ ${num2} = ?`
      } else { // square
        num1 = Math.floor(Math.random() * 15) + 1
        answer = num1 * num1
        question = `${num1}² = ?`
      }
      points = Math.floor(Math.random() * 50) + 75 // 75-125 points
      break

    case 'extreme': // Kiwis - very complex problems
      const extremeOps = ['cube', 'factorial', 'prime', 'fibonacci']
      const extremeOp = extremeOps[Math.floor(Math.random() * extremeOps.length)]
      if (extremeOp === 'cube') {
        num1 = Math.floor(Math.random() * 8) + 2 // 2-9
        answer = num1 * num1 * num1
        question = `${num1}³ = ?`
      } else if (extremeOp === 'factorial') {
        num1 = Math.floor(Math.random() * 5) + 3 // 3-7
        answer = 1
        for (let i = 1; i <= num1; i++) answer *= i
        question = `${num1}! = ?`
      } else if (extremeOp === 'prime') {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
        const primeIndex = Math.floor(Math.random() * 10) + 1 // 1st to 10th prime
        answer = primes[primeIndex - 1]
        question = `What is the ${primeIndex}${primeIndex === 1 ? 'st' : primeIndex === 2 ? 'nd' : primeIndex === 3 ? 'rd' : 'th'} prime number?`
      } else { // fibonacci
        const fibIndex = Math.floor(Math.random() * 8) + 3 // 3rd to 10th fibonacci
        const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
        answer = fib[fibIndex - 1]
        question = `What is the ${fibIndex}${fibIndex === 3 ? 'rd' : 'th'} Fibonacci number?`
      }
      points = Math.floor(Math.random() * 40) + 40 // 40-80 points
      break

    default:
      num1 = 5
      num2 = 3
      answer = 8
      question = '5 + 3 = ?'
      points = 15
      difficulty = 'easy'
  }

  return { question, answer, points, difficulty }
}

/**
 * Create a fruit with rarity system
 */
export const createFruit = (): Fruit => {
  const random = Math.random()
  let fruitType: string, color: string, rarity: Fruit['rarity'], difficulty: Fruit['difficulty'], size: number
  
  if (random < 0.5) { // 50% - Apples (most common)
    fruitType = '🍎'
    color = '#ff4444'
    rarity = 'common'
    difficulty = 'easy'
    size = 25
  } else if (random < 0.75) { // 25% - Oranges
    fruitType = '🍊'
    color = '#ff8844'
    rarity = 'uncommon'
    difficulty = 'medium'
    size = 25
  } else if (random < 0.9) { // 15% - Grapes
    fruitType = '🍇'
    color = '#8844ff'
    rarity = 'uncommon'
    difficulty = 'medium'
    size = 25
  } else if (random < 0.98) { // 8% - Bananas (pretty rare, most points)
    fruitType = '🍌'
    color = '#ffff44'
    rarity = 'rare'
    difficulty = 'hard'
    size = 28 // Slightly bigger
  } else { // 2% - Kiwis (rarest, hardest problems)
    fruitType = '🥝'
    color = '#44ff44'
    rarity = 'legendary'
    difficulty = 'extreme'
    size = 30 // Biggest
  }
  
  return {
    x: 800,
    y: Math.random() * 400 + 100,
    size,
    type: fruitType,
    color,
    rarity,
    difficulty
  }
}

/**
 * Check collision between two rectangular objects
 */
export const checkCollision = (
  obj1: { x: number; y: number; size?: number; width?: number; height?: number },
  obj2: { x: number; y: number; size?: number; width?: number; height?: number }
): boolean => {
  const obj1Width = obj1.width || obj1.size || 0
  const obj1Height = obj1.height || obj1.size || 0
  const obj2Width = obj2.width || obj2.size || 0
  const obj2Height = obj2.height || obj2.size || 0

  return (
    obj1.x < obj2.x + obj2Width &&
    obj1.x + obj1Width > obj2.x &&
    obj1.y < obj2.y + obj2Height &&
    obj1.y + obj1Height > obj2.y
  )
}

/**
 * Update chicken physics
 */
export const updateChickenPhysics = (chicken: Chicken, canvasHeight: number, deltaTime: number = 16): Chicken => {
  const updatedChicken = { ...chicken }
  
  // Handle auto-fly period
  if (updatedChicken.isAutoFlying) {
    updatedChicken.autoFlyTime -= deltaTime
    if (updatedChicken.autoFlyTime > 0) {
      if (updatedChicken.velocity > -2) {
        updatedChicken.velocity = -4 // Gentle upward movement
      }
    } else {
      updatedChicken.isAutoFlying = false
    }
  }
  
  // Apply gravity
  updatedChicken.velocity += 0.5
  updatedChicken.y += updatedChicken.velocity
  
  // Keep chicken in bounds
  if (updatedChicken.y < 0) {
    updatedChicken.y = 0
  }
  if (updatedChicken.y > canvasHeight - updatedChicken.size) {
    updatedChicken.y = canvasHeight - updatedChicken.size
  }
  
  return updatedChicken
}

/**
 * Calculate score based on difficulty and base points
 */
export const calculateScore = (difficulty: MathQuestion['difficulty'], basePoints: number): number => {
  const multipliers = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    extreme: 1.8
  }
  
  return Math.floor(basePoints * multipliers[difficulty])
}

/**
 * Validate math answer
 */
export const validateMathAnswer = (userAnswer: string, correctAnswer: number): boolean => {
  const numericAnswer = parseInt(userAnswer, 10)
  return !isNaN(numericAnswer) && numericAnswer === correctAnswer
}

/**
 * Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
 */
export const getOrdinalSuffix = (num: number): string => {
  if (num === 1) return 'st'
  if (num === 2) return 'nd'
  if (num === 3) return 'rd'
  return 'th'
}

/**
 * Calculate factorial
 */
export const factorial = (n: number): number => {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

/**
 * Get nth Fibonacci number
 */
export const fibonacci = (n: number): number => {
  if (n <= 2) return 1
  let a = 1, b = 1
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
}

/**
 * Get nth prime number
 */
export const getNthPrime = (n: number): number => {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
  return primes[n - 1] || 0
}
