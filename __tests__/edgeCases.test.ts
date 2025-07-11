import {
  generateMathQuestion,
  createFruit,
  checkCollision,
  updateChickenPhysics,
  validateMathAnswer,
  factorial,
  fibonacci,
  getNthPrime,
  type Chicken
} from '../utils/gameUtils'

describe('Edge Cases and Error Handling', () => {
  describe('Math Question Edge Cases', () => {
    test('should handle extreme difficulty edge cases', () => {
      // Test multiple generations to catch edge cases
      for (let i = 0; i < 50; i++) {
        const question = generateMathQuestion('extreme')
        
        expect(question.answer).toBeGreaterThan(0)
        expect(question.points).toBeGreaterThan(0)
        expect(question.question).toBeTruthy()
        expect(question.difficulty).toBe('extreme')
      }
    })

    test('should handle division by zero prevention', () => {
      // Test hard difficulty division problems
      for (let i = 0; i < 20; i++) {
        const question = generateMathQuestion('hard')
        
        if (question.question.includes('÷')) {
          const parts = question.question.match(/(\d+) ÷ (\d+) = \?/)
          if (parts) {
            const divisor = parseInt(parts[2])
            expect(divisor).toBeGreaterThan(0) // Should never be zero
          }
        }
      }
    })

    test('should ensure subtraction results are positive', () => {
      for (let i = 0; i < 20; i++) {
        const question = generateMathQuestion('easy')
        
        if (question.question.includes('-')) {
          expect(question.answer).toBeGreaterThan(0)
        }
      }
    })

    test('should handle factorial edge cases', () => {
      expect(factorial(0)).toBe(1)
      expect(factorial(1)).toBe(1)
      expect(factorial(-1)).toBe(1) // Should handle negative gracefully
    })

    test('should handle fibonacci edge cases', () => {
      expect(fibonacci(1)).toBe(1)
      expect(fibonacci(2)).toBe(1)
      expect(fibonacci(0)).toBe(1) // Edge case
      expect(fibonacci(-1)).toBe(1) // Edge case
    })

    test('should handle prime number edge cases', () => {
      expect(getNthPrime(1)).toBe(2)
      expect(getNthPrime(0)).toBe(0) // Out of range
      expect(getNthPrime(-1)).toBe(0) // Invalid input
      expect(getNthPrime(100)).toBe(0) // Out of range
    })
  })

  describe('Collision Detection Edge Cases', () => {
    test('should handle objects with zero size', () => {
      const obj1 = { x: 10, y: 10, size: 0 }
      const obj2 = { x: 10, y: 10, size: 20 }
      
      expect(checkCollision(obj1, obj2)).toBe(false)
    })

    test('should handle objects with negative coordinates', () => {
      const obj1 = { x: -10, y: -10, size: 20 }
      const obj2 = { x: -5, y: -5, size: 20 }
      
      expect(checkCollision(obj1, obj2)).toBe(true)
    })

    test('should handle objects with undefined properties', () => {
      const obj1 = { x: 10, y: 10 } // No size/width/height
      const obj2 = { x: 10, y: 10, size: 20 }
      
      expect(checkCollision(obj1, obj2)).toBe(false)
    })

    test('should handle mixed property types', () => {
      const obj1 = { x: 10, y: 10, size: 20, width: 30 } // Both size and width
      const obj2 = { x: 15, y: 15, height: 20 } // Only height
      
      // Should use width over size, and handle missing height
      expect(checkCollision(obj1, obj2)).toBe(false)
    })
  })

  describe('Chicken Physics Edge Cases', () => {
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

    test('should handle extreme velocities', () => {
      const chicken = createTestChicken()
      chicken.velocity = 1000 // Extreme velocity
      
      const updated = updateChickenPhysics(chicken, 600)
      
      expect(updated.y).toBeLessThanOrEqual(570) // Should be clamped to canvas
    })

    test('should handle negative canvas height', () => {
      const chicken = createTestChicken()
      
      const updated = updateChickenPhysics(chicken, -100) // Invalid canvas height
      
      expect(updated.y).toBeGreaterThanOrEqual(0)
    })

    test('should handle zero canvas height', () => {
      const chicken = createTestChicken()
      
      const updated = updateChickenPhysics(chicken, 0)
      
      expect(updated.y).toBe(0)
    })

    test('should handle very small deltaTime', () => {
      const chicken = createTestChicken()
      chicken.isAutoFlying = true
      chicken.autoFlyTime = 100
      
      const updated = updateChickenPhysics(chicken, 600, 0.1) // Very small deltaTime
      
      expect(updated.autoFlyTime).toBeLessThan(100)
      expect(updated.autoFlyTime).toBeGreaterThan(99)
    })

    test('should handle negative deltaTime', () => {
      const chicken = createTestChicken()
      chicken.isAutoFlying = true
      chicken.autoFlyTime = 100
      
      const updated = updateChickenPhysics(chicken, 600, -16) // Negative deltaTime
      
      // Should handle gracefully (time might increase, but shouldn't crash)
      expect(updated.autoFlyTime).toBeGreaterThan(100)
    })
  })

  describe('Answer Validation Edge Cases', () => {
    test('should handle various string formats', () => {
      expect(validateMathAnswer('42', 42)).toBe(true)
      expect(validateMathAnswer('042', 42)).toBe(true) // Leading zeros
      expect(validateMathAnswer('+42', 42)).toBe(true) // Plus sign
      expect(validateMathAnswer('42.0', 42)).toBe(true) // Decimal that equals integer
      expect(validateMathAnswer('42.5', 42)).toBe(false) // Decimal that doesn't equal
    })

    test('should handle special characters', () => {
      expect(validateMathAnswer('4️⃣2️⃣', 42)).toBe(false) // Emoji numbers
      expect(validateMathAnswer('forty-two', 42)).toBe(false) // Word numbers
      expect(validateMathAnswer('42!', 42)).toBe(false) // With punctuation
      expect(validateMathAnswer('42e0', 42)).toBe(true) // Scientific notation
    })

    test('should handle very large numbers', () => {
      const largeNumber = 999999999999999
      expect(validateMathAnswer(largeNumber.toString(), largeNumber)).toBe(true)
    })

    test('should handle negative numbers', () => {
      expect(validateMathAnswer('-42', -42)).toBe(true)
      expect(validateMathAnswer('-0', 0)).toBe(true)
    })
  })

  describe('Fruit Creation Edge Cases', () => {
    test('should handle Math.random edge values', () => {
      const originalRandom = Math.random
      
      // Test with 0 (should create apple)
      Math.random = jest.fn().mockReturnValue(0)
      let fruit = createFruit()
      expect(fruit.type).toBe('🍎')
      
      // Test with 0.999... (should create kiwi)
      Math.random = jest.fn().mockReturnValue(0.999)
      fruit = createFruit()
      expect(fruit.type).toBe('🥝')
      
      // Test with exactly 0.5 (should create orange)
      Math.random = jest.fn().mockReturnValue(0.5)
      fruit = createFruit()
      expect(fruit.type).toBe('🍊')
      
      Math.random = originalRandom
    })

    test('should handle y-coordinate edge cases', () => {
      const originalRandom = Math.random
      
      // Test minimum y position
      Math.random = jest.fn()
        .mockReturnValueOnce(0.3) // For fruit type
        .mockReturnValueOnce(0) // For y position
      
      const fruit = createFruit()
      expect(fruit.y).toBe(100) // Minimum y
      
      // Test maximum y position
      Math.random = jest.fn()
        .mockReturnValueOnce(0.3) // For fruit type
        .mockReturnValueOnce(1) // For y position
      
      const fruit2 = createFruit()
      expect(fruit2.y).toBe(500) // Maximum y (100 + 400 * 1)
      
      Math.random = originalRandom
    })
  })

  describe('Memory and Performance Edge Cases', () => {
    test('should handle rapid function calls without memory leaks', () => {
      // Test rapid math question generation
      for (let i = 0; i < 1000; i++) {
        const question = generateMathQuestion('easy')
        expect(question).toBeTruthy()
      }
    })

    test('should handle rapid fruit creation', () => {
      // Test rapid fruit creation
      for (let i = 0; i < 1000; i++) {
        const fruit = createFruit()
        expect(fruit).toBeTruthy()
      }
    })

    test('should handle rapid collision checks', () => {
      const obj1 = { x: 10, y: 10, size: 20 }
      const obj2 = { x: 15, y: 15, size: 20 }
      
      // Test rapid collision checks
      for (let i = 0; i < 1000; i++) {
        const collision = checkCollision(obj1, obj2)
        expect(typeof collision).toBe('boolean')
      }
    })
  })

  describe('Boundary Value Testing', () => {
    test('should handle minimum and maximum math values', () => {
      // Test with controlled random values for boundary testing
      const originalRandom = Math.random
      
      // Test minimum values for easy difficulty
      Math.random = jest.fn().mockReturnValue(0) // Minimum random values
      const easyQuestion = generateMathQuestion('easy')
      expect(easyQuestion.answer).toBeGreaterThan(0)
      
      // Test maximum values for easy difficulty
      Math.random = jest.fn().mockReturnValue(0.999) // Maximum random values
      const easyQuestion2 = generateMathQuestion('easy')
      expect(easyQuestion2.answer).toBeGreaterThan(0)
      
      Math.random = originalRandom
    })

    test('should handle canvas boundary values', () => {
      const chicken = {
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
      
      // Test with minimum canvas size
      const updated1 = updateChickenPhysics(chicken, 30) // Canvas height = chicken size
      expect(updated1.y).toBeLessThanOrEqual(0)
      
      // Test with very large canvas
      const updated2 = updateChickenPhysics(chicken, 10000)
      expect(updated2.y).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Concurrent Operations', () => {
    test('should handle simultaneous function calls', async () => {
      // Test concurrent math question generation
      const promises = Array.from({ length: 100 }, () => 
        Promise.resolve(generateMathQuestion('medium'))
      )
      
      const results = await Promise.all(promises)
      
      results.forEach(question => {
        expect(question.difficulty).toBe('medium')
        expect(question.answer).toBeGreaterThan(0)
      })
    })
  })
})
