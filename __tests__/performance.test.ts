import {
  generateMathQuestion,
  createFruit,
  checkCollision,
  updateChickenPhysics,
  validateMathAnswer,
  type Chicken,
  type Fruit
} from '../utils/gameUtils'

describe('Performance Tests', () => {
  describe('Math Question Generation Performance', () => {
    test('should generate 1000 easy questions within reasonable time', () => {
      const startTime = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        generateMathQuestion('easy')
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(100) // Should complete in less than 100ms
    })

    test('should generate complex questions efficiently', () => {
      const startTime = performance.now()
      
      for (let i = 0; i < 100; i++) {
        generateMathQuestion('extreme')
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(50) // Should complete in less than 50ms
    })
  })

  describe('Collision Detection Performance', () => {
    test('should handle many collision checks efficiently', () => {
      const objects = Array.from({ length: 100 }, (_, i) => ({
        x: i * 10,
        y: i * 10,
        size: 20
      }))
      
      const startTime = performance.now()
      
      // Check collisions between all objects
      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          checkCollision(objects[i], objects[j])
        }
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(10) // Should complete in less than 10ms
    })
  })

  describe('Physics Update Performance', () => {
    test('should update chicken physics efficiently in game loop', () => {
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
      
      const startTime = performance.now()
      
      // Simulate 60 FPS for 1 second (60 updates)
      for (let i = 0; i < 60; i++) {
        updateChickenPhysics(chicken, 600, 16.67) // ~60 FPS
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(5) // Should complete in less than 5ms
    })
  })

  describe('Memory Usage', () => {
    test('should not create excessive objects during math generation', () => {
      const initialMemory = process.memoryUsage().heapUsed
      
      // Generate many questions
      for (let i = 0; i < 10000; i++) {
        generateMathQuestion('medium')
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })

    test('should not leak memory during fruit creation', () => {
      const initialMemory = process.memoryUsage().heapUsed
      
      // Create many fruits
      for (let i = 0; i < 10000; i++) {
        createFruit()
      }
      
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024)
    })
  })
})

describe('Integration Tests', () => {
  describe('Complete Game Flow', () => {
    test('should handle complete fruit collection and math solving flow', () => {
      // 1. Create game entities
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
      
      const fruit = createFruit()
      fruit.x = chicken.x // Position for collision
      fruit.y = chicken.y
      
      // 2. Check collision
      const hasCollision = checkCollision(chicken, fruit)
      expect(hasCollision).toBe(true)
      
      // 3. Generate math question based on fruit difficulty
      const question = generateMathQuestion(fruit.difficulty)
      expect(question.difficulty).toBe(fruit.difficulty)
      
      // 4. Validate correct answer
      const isCorrect = validateMathAnswer(question.answer.toString(), question.answer)
      expect(isCorrect).toBe(true)
      
      // 5. Validate wrong answer
      const isWrong = validateMathAnswer((question.answer + 1).toString(), question.answer)
      expect(isWrong).toBe(false)
    })

    test('should handle multiple fruit types and their corresponding difficulties', () => {
      const fruitTypes = ['easy', 'medium', 'hard', 'extreme'] as const
      
      fruitTypes.forEach(difficulty => {
        // Create fruit with specific difficulty (would need to mock random for this)
        const question = generateMathQuestion(difficulty)
        
        expect(question.difficulty).toBe(difficulty)
        expect(question.answer).toBeGreaterThan(0)
        expect(question.points).toBeGreaterThan(0)
        
        // Validate the answer
        const isValid = validateMathAnswer(question.answer.toString(), question.answer)
        expect(isValid).toBe(true)
      })
    })

    test('should handle game physics over time', () => {
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
        autoFlyTime: 2000, // 2 seconds of auto-fly
        isAutoFlying: true,
        lastDamageTime: 0
      }
      
      let currentChicken = chicken
      
      // Simulate 2 seconds of game time at 60 FPS
      for (let frame = 0; frame < 120; frame++) {
        currentChicken = updateChickenPhysics(currentChicken, 600, 16.67)
        
        // Check that chicken stays within bounds
        expect(currentChicken.y).toBeGreaterThanOrEqual(0)
        expect(currentChicken.y).toBeLessThanOrEqual(570) // 600 - 30 (size)
      }
      
      // After 2 seconds, auto-fly should be disabled
      expect(currentChicken.isAutoFlying).toBe(false)
      expect(currentChicken.autoFlyTime).toBeLessThanOrEqual(0)
    })
  })

  describe('Error Recovery', () => {
    test('should recover gracefully from invalid math operations', () => {
      // Test with all difficulty levels to ensure no crashes
      const difficulties = ['easy', 'medium', 'hard', 'extreme'] as const
      
      difficulties.forEach(difficulty => {
        for (let i = 0; i < 10; i++) {
          const question = generateMathQuestion(difficulty)
          
          // Should never produce invalid results
          expect(question.answer).not.toBeNaN()
          expect(question.answer).toBeFinite()
          expect(question.points).toBeGreaterThan(0)
          expect(question.question).toBeTruthy()
        }
      })
    })

    test('should handle edge cases in collision detection', () => {
      const testCases = [
        { obj1: { x: 0, y: 0, size: 0 }, obj2: { x: 0, y: 0, size: 0 } },
        { obj1: { x: -100, y: -100, size: 50 }, obj2: { x: -75, y: -75, size: 50 } },
        { obj1: { x: 1000, y: 1000, size: 20 }, obj2: { x: 1010, y: 1010, size: 20 } },
      ]
      
      testCases.forEach(({ obj1, obj2 }) => {
        const result = checkCollision(obj1, obj2)
        expect(typeof result).toBe('boolean')
      })
    })
  })

  describe('Stress Testing', () => {
    test('should handle rapid state changes', () => {
      let chicken: Chicken = {
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
      
      // Rapidly toggle auto-fly state
      for (let i = 0; i < 100; i++) {
        chicken.isAutoFlying = !chicken.isAutoFlying
        chicken.autoFlyTime = chicken.isAutoFlying ? 1000 : 0
        chicken = updateChickenPhysics(chicken, 600)
        
        expect(chicken.y).toBeGreaterThanOrEqual(0)
        expect(chicken.y).toBeLessThanOrEqual(570)
      }
    })

    test('should handle many simultaneous collisions', () => {
      const chicken = { x: 100, y: 100, size: 30 }
      const fruits: Array<{ x: number; y: number; size: number }> = []
      
      // Create many overlapping fruits
      for (let i = 0; i < 100; i++) {
        fruits.push({
          x: 95 + Math.random() * 10, // Overlapping with chicken
          y: 95 + Math.random() * 10,
          size: 25
        })
      }
      
      let collisionCount = 0
      fruits.forEach(fruit => {
        if (checkCollision(chicken, fruit)) {
          collisionCount++
        }
      })
      
      expect(collisionCount).toBeGreaterThan(0)
      expect(collisionCount).toBeLessThanOrEqual(100)
    })
  })

  describe('Data Consistency', () => {
    test('should maintain consistent math question properties', () => {
      const difficulties = ['easy', 'medium', 'hard', 'extreme'] as const
      
      difficulties.forEach(difficulty => {
        for (let i = 0; i < 50; i++) {
          const question = generateMathQuestion(difficulty)
          
          // Verify question format matches expected pattern
          expect(question.question).toMatch(/.*=.*\?/)
          
          // Verify answer is correct for the question
          if (question.question.includes('+')) {
            const parts = question.question.match(/(\d+) \+ (\d+) = \?/)
            if (parts) {
              const expected = parseInt(parts[1]) + parseInt(parts[2])
              expect(question.answer).toBe(expected)
            }
          }
          
          if (question.question.includes('×')) {
            const parts = question.question.match(/(\d+) × (\d+) = \?/)
            if (parts) {
              const expected = parseInt(parts[1]) * parseInt(parts[2])
              expect(question.answer).toBe(expected)
            }
          }
        }
      })
    })

    test('should maintain fruit rarity distribution over many generations', () => {
      const rarityCount = {
        common: 0,
        uncommon: 0,
        rare: 0,
        legendary: 0
      }
      
      const totalFruits = 10000
      
      for (let i = 0; i < totalFruits; i++) {
        const fruit = createFruit()
        rarityCount[fruit.rarity]++
      }
      
      // Check approximate distribution (with some tolerance for randomness)
      expect(rarityCount.common).toBeGreaterThan(totalFruits * 0.45) // ~50%
      expect(rarityCount.common).toBeLessThan(totalFruits * 0.55)
      
      expect(rarityCount.uncommon).toBeGreaterThan(totalFruits * 0.35) // ~40%
      expect(rarityCount.uncommon).toBeLessThan(totalFruits * 0.45)
      
      expect(rarityCount.rare).toBeGreaterThan(totalFruits * 0.05) // ~8%
      expect(rarityCount.rare).toBeLessThan(totalFruits * 0.12)
      
      expect(rarityCount.legendary).toBeGreaterThan(totalFruits * 0.01) // ~2%
      expect(rarityCount.legendary).toBeLessThan(totalFruits * 0.04)
    })
  })
})
