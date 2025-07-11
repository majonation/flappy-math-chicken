import {
  generateMathQuestion,
  createFruit,
  checkCollision,
  updateChickenPhysics,
  calculateScore,
  validateMathAnswer,
  getOrdinalSuffix,
  factorial,
  fibonacci,
  getNthPrime,
  type MathQuestion,
  type Chicken,
  type Fruit
} from '../utils/gameUtils'

describe('Math Question Generation', () => {
  describe('generateMathQuestion', () => {
    test('should generate easy questions with correct difficulty', () => {
      const question = generateMathQuestion('easy')
      
      expect(question.difficulty).toBe('easy')
      expect(question.points).toBeGreaterThanOrEqual(10)
      expect(question.points).toBeLessThanOrEqual(30)
      expect(question.question).toMatch(/\d+ [+\-] \d+ = \?/)
      expect(typeof question.answer).toBe('number')
    })

    test('should generate medium questions with multiplication', () => {
      // Run multiple times to test different operations
      const questions = Array.from({ length: 10 }, () => generateMathQuestion('medium'))
      
      questions.forEach(question => {
        expect(question.difficulty).toBe('medium')
        expect(question.points).toBeGreaterThanOrEqual(25)
        expect(question.points).toBeLessThanOrEqual(55)
        expect(question.question).toMatch(/\d+ [+\-×] \d+ = \?/)
      })
    })

    test('should generate hard questions with complex operations', () => {
      const questions = Array.from({ length: 10 }, () => generateMathQuestion('hard'))
      
      questions.forEach(question => {
        expect(question.difficulty).toBe('hard')
        expect(question.points).toBeGreaterThanOrEqual(75)
        expect(question.points).toBeLessThanOrEqual(125)
        expect(question.question).toMatch(/(\d+ [×÷] \d+|\d+²) = \?/)
      })
    })

    test('should generate extreme questions with advanced operations', () => {
      const questions = Array.from({ length: 20 }, () => generateMathQuestion('extreme'))
      
      questions.forEach(question => {
        expect(question.difficulty).toBe('extreme')
        expect(question.points).toBeGreaterThanOrEqual(40)
        expect(question.points).toBeLessThanOrEqual(80)
        expect(question.question).toMatch(/(³|!|prime|Fibonacci)/)
      })
    })

    test('should handle invalid difficulty gracefully', () => {
      const question = generateMathQuestion('invalid' as any)
      
      expect(question.difficulty).toBe('easy')
      expect(question.question).toBe('5 + 3 = ?')
      expect(question.answer).toBe(8)
      expect(question.points).toBe(15)
    })
  })

  describe('Math operations validation', () => {
    test('should generate correct addition problems', () => {
      // Mock Math.random to control the operation selection
      const originalRandom = Math.random
      Math.random = jest.fn().mockReturnValue(0.3) // Force addition
      
      const question = generateMathQuestion('easy')
      const parts = question.question.match(/(\d+) \+ (\d+) = \?/)
      
      if (parts) {
        const num1 = parseInt(parts[1])
        const num2 = parseInt(parts[2])
        expect(question.answer).toBe(num1 + num2)
      }
      
      Math.random = originalRandom
    })

    test('should generate correct subtraction problems', () => {
      const originalRandom = Math.random
      Math.random = jest.fn().mockReturnValue(0.8) // Force subtraction
      
      const question = generateMathQuestion('easy')
      const parts = question.question.match(/(\d+) - (\d+) = \?/)
      
      if (parts) {
        const num1 = parseInt(parts[1])
        const num2 = parseInt(parts[2])
        expect(question.answer).toBe(num1 - num2)
        expect(question.answer).toBeGreaterThan(0) // Ensure positive result
      }
      
      Math.random = originalRandom
    })
  })
})

describe('Fruit Creation', () => {
  describe('createFruit', () => {
    test('should create fruit with valid properties', () => {
      const fruit = createFruit()
      
      expect(fruit.x).toBe(800)
      expect(fruit.y).toBeGreaterThanOrEqual(100)
      expect(fruit.y).toBeLessThanOrEqual(500)
      expect(['🍎', '🍊', '🍇', '🍌', '🥝']).toContain(fruit.type)
      expect(['common', 'uncommon', 'rare', 'legendary']).toContain(fruit.rarity)
      expect(['easy', 'medium', 'hard', 'extreme']).toContain(fruit.difficulty)
      expect(fruit.size).toBeGreaterThanOrEqual(25)
      expect(fruit.size).toBeLessThanOrEqual(30)
    })

    test('should create apples most frequently', () => {
      const originalRandom = Math.random
      Math.random = jest.fn().mockReturnValue(0.3) // Force apple creation
      
      const fruit = createFruit()
      
      expect(fruit.type).toBe('🍎')
      expect(fruit.rarity).toBe('common')
      expect(fruit.difficulty).toBe('easy')
      expect(fruit.size).toBe(25)
      
      Math.random = originalRandom
    })

    test('should create legendary kiwis rarely', () => {
      const originalRandom = Math.random
      Math.random = jest.fn().mockReturnValue(0.99) // Force kiwi creation
      
      const fruit = createFruit()
      
      expect(fruit.type).toBe('🥝')
      expect(fruit.rarity).toBe('legendary')
      expect(fruit.difficulty).toBe('extreme')
      expect(fruit.size).toBe(30)
      
      Math.random = originalRandom
    })
  })
})

describe('Collision Detection', () => {
  describe('checkCollision', () => {
    test('should detect collision between overlapping objects', () => {
      const obj1 = { x: 10, y: 10, size: 20 }
      const obj2 = { x: 15, y: 15, size: 20 }
      
      expect(checkCollision(obj1, obj2)).toBe(true)
    })

    test('should not detect collision between separate objects', () => {
      const obj1 = { x: 10, y: 10, size: 20 }
      const obj2 = { x: 50, y: 50, size: 20 }
      
      expect(checkCollision(obj1, obj2)).toBe(false)
    })

    test('should handle objects with width/height properties', () => {
      const obj1 = { x: 10, y: 10, width: 20, height: 20 }
      const obj2 = { x: 15, y: 15, width: 20, height: 20 }
      
      expect(checkCollision(obj1, obj2)).toBe(true)
    })

    test('should detect edge collision', () => {
      const obj1 = { x: 10, y: 10, size: 20 }
      const obj2 = { x: 30, y: 10, size: 20 }
      
      expect(checkCollision(obj1, obj2)).toBe(false) // Just touching, not overlapping
    })

    test('should handle mixed size and width/height properties', () => {
      const obj1 = { x: 10, y: 10, size: 20 }
      const obj2 = { x: 15, y: 15, width: 20, height: 20 }
      
      expect(checkCollision(obj1, obj2)).toBe(true)
    })
  })
})

describe('Chicken Physics', () => {
  describe('updateChickenPhysics', () => {
    const createTestChicken = (): Chicken => ({
      x: 100,
      y: 300,
      velocity: 0,
      size: 30,
      wingFlap: 0,
      lookDirection: 0,
      lastLookChange: Date.now(),
      isFlapping: false,
      flapDuration: 0,
      autoFlyTime: 0,
      isAutoFlying: false,
      lastDamageTime: 0
    })

    test('should apply gravity to chicken', () => {
      const chicken = createTestChicken()
      const updated = updateChickenPhysics(chicken, 600)
      
      expect(updated.velocity).toBe(0.5) // Gravity applied
      expect(updated.y).toBe(300.5) // Position updated
    })

    test('should handle auto-flying chicken', () => {
      const chicken = createTestChicken()
      chicken.isAutoFlying = true
      chicken.autoFlyTime = 1000
      chicken.velocity = 2
      
      const updated = updateChickenPhysics(chicken, 600)
      
      expect(updated.velocity).toBe(-4) // Auto-fly velocity
      expect(updated.autoFlyTime).toBe(984) // Time decreased
      expect(updated.isAutoFlying).toBe(true)
    })

    test('should stop auto-flying when time expires', () => {
      const chicken = createTestChicken()
      chicken.isAutoFlying = true
      chicken.autoFlyTime = 10
      
      const updated = updateChickenPhysics(chicken, 600)
      
      expect(updated.isAutoFlying).toBe(false)
      expect(updated.autoFlyTime).toBeLessThanOrEqual(0)
    })

    test('should keep chicken within canvas bounds', () => {
      const chicken = createTestChicken()
      chicken.y = -10 // Above canvas
      
      const updated = updateChickenPhysics(chicken, 600)
      
      expect(updated.y).toBe(0)
    })

    test('should keep chicken above ground', () => {
      const chicken = createTestChicken()
      chicken.y = 600 // Below canvas
      
      const updated = updateChickenPhysics(chicken, 600)
      
      expect(updated.y).toBe(570) // 600 - 30 (size)
    })
  })
})

describe('Score Calculation', () => {
  describe('calculateScore', () => {
    test('should apply correct multipliers for each difficulty', () => {
      expect(calculateScore('easy', 100)).toBe(100)
      expect(calculateScore('medium', 100)).toBe(150)
      expect(calculateScore('hard', 100)).toBe(200)
      expect(calculateScore('extreme', 100)).toBe(180)
    })

    test('should handle decimal results by flooring', () => {
      expect(calculateScore('medium', 33)).toBe(49) // 33 * 1.5 = 49.5, floored to 49
    })
  })
})

describe('Answer Validation', () => {
  describe('validateMathAnswer', () => {
    test('should validate correct numeric answers', () => {
      expect(validateMathAnswer('42', 42)).toBe(true)
      expect(validateMathAnswer('0', 0)).toBe(true)
      expect(validateMathAnswer('-5', -5)).toBe(true)
    })

    test('should reject incorrect answers', () => {
      expect(validateMathAnswer('41', 42)).toBe(false)
      expect(validateMathAnswer('43', 42)).toBe(false)
    })

    test('should handle invalid input', () => {
      expect(validateMathAnswer('abc', 42)).toBe(false)
      expect(validateMathAnswer('', 42)).toBe(false)
      expect(validateMathAnswer('12.5', 12)).toBe(false) // parseInt truncates
    })

    test('should handle string numbers with whitespace', () => {
      expect(validateMathAnswer(' 42 ', 42)).toBe(true)
    })
  })
})

describe('Utility Functions', () => {
  describe('getOrdinalSuffix', () => {
    test('should return correct ordinal suffixes', () => {
      expect(getOrdinalSuffix(1)).toBe('st')
      expect(getOrdinalSuffix(2)).toBe('nd')
      expect(getOrdinalSuffix(3)).toBe('rd')
      expect(getOrdinalSuffix(4)).toBe('th')
      expect(getOrdinalSuffix(11)).toBe('th')
      expect(getOrdinalSuffix(21)).toBe('st')
      expect(getOrdinalSuffix(22)).toBe('nd')
      expect(getOrdinalSuffix(23)).toBe('rd')
    })
  })

  describe('factorial', () => {
    test('should calculate factorials correctly', () => {
      expect(factorial(0)).toBe(1)
      expect(factorial(1)).toBe(1)
      expect(factorial(3)).toBe(6)
      expect(factorial(4)).toBe(24)
      expect(factorial(5)).toBe(120)
    })
  })

  describe('fibonacci', () => {
    test('should calculate Fibonacci numbers correctly', () => {
      expect(fibonacci(1)).toBe(1)
      expect(fibonacci(2)).toBe(1)
      expect(fibonacci(3)).toBe(2)
      expect(fibonacci(4)).toBe(3)
      expect(fibonacci(5)).toBe(5)
      expect(fibonacci(6)).toBe(8)
      expect(fibonacci(7)).toBe(13)
    })
  })

  describe('getNthPrime', () => {
    test('should return correct prime numbers', () => {
      expect(getNthPrime(1)).toBe(2)
      expect(getNthPrime(2)).toBe(3)
      expect(getNthPrime(3)).toBe(5)
      expect(getNthPrime(4)).toBe(7)
      expect(getNthPrime(5)).toBe(11)
      expect(getNthPrime(10)).toBe(29)
    })

    test('should handle out of range indices', () => {
      expect(getNthPrime(100)).toBe(0)
    })
  })
})

describe('Integration Tests', () => {
  test('should create fruit and generate matching difficulty question', () => {
    const originalRandom = Math.random
    Math.random = jest.fn().mockReturnValue(0.3) // Force apple creation
    
    const fruit = createFruit()
    const question = generateMathQuestion(fruit.difficulty)
    
    expect(fruit.difficulty).toBe('easy')
    expect(question.difficulty).toBe('easy')
    expect(question.points).toBeGreaterThanOrEqual(10)
    expect(question.points).toBeLessThanOrEqual(30)
    
    Math.random = originalRandom
  })

  test('should handle complete game flow scenario', () => {
    // Create a chicken
    const chicken: Chicken = {
      x: 100,
      y: 300,
      velocity: 0,
      size: 30,
      wingFlap: 0,
      lookDirection: 0,
      lastLookChange: Date.now(),
      isFlapping: false,
      flapDuration: 0,
      autoFlyTime: 0,
      isAutoFlying: false,
      lastDamageTime: 0
    }

    // Create a fruit
    const fruit = createFruit()
    
    // Move fruit to collision position
    fruit.x = chicken.x
    fruit.y = chicken.y
    
    // Check collision
    const collision = checkCollision(chicken, fruit)
    expect(collision).toBe(true)
    
    // Generate question based on fruit difficulty
    const question = generateMathQuestion(fruit.difficulty)
    
    // Validate a correct answer
    const isCorrect = validateMathAnswer(question.answer.toString(), question.answer)
    expect(isCorrect).toBe(true)
    
    // Calculate score
    const score = calculateScore(question.difficulty, question.points)
    expect(score).toBeGreaterThan(0)
  })
})
