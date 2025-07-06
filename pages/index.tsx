import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

interface Chicken {
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

interface Fruit {
  x: number
  y: number
  size: number
  type: string
  color: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
}

interface Tree {
  x: number
  y: number
  width: number
  height: number
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'rock' | 'lightning'
}

interface MathQuestion {
  question: string
  answer: number
  points: number
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [showMathQuestion, setShowMathQuestion] = useState(false)
  const [mathQuestion, setMathQuestion] = useState<MathQuestion | null>(null)
  const [mathAnswer, setMathAnswer] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isCountingDown, setIsCountingDown] = useState(false)

  // Game state
  const gameState = useRef({
    chicken: { 
      x: 100, 
      y: 300, 
      velocity: 0, 
      size: 30,
      wingFlap: 0,
      lookDirection: 0, // -1 left, 0 center, 1 right
      lastLookChange: Date.now(),
      isFlapping: false,
      flapDuration: 0,
      autoFlyTime: 0,
      isAutoFlying: false,
      lastDamageTime: 0
    } as Chicken,
    fruits: [] as Fruit[],
    trees: [] as Tree[],
    obstacles: [] as Obstacle[],
    gameSpeed: 2,
    lastFruitSpawn: 0,
    lastObstacleSpawn: 0,
    wrongAnswerPenalty: 0, // Increases obstacle spawn rate when > 0
    keys: {} as { [key: string]: boolean }
  })

  // Audio context for retro sounds
  const audioContext = useRef<AudioContext | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  // Draw comical chicken with smooth curves
  const drawChicken = (ctx: CanvasRenderingContext2D, chicken: Chicken) => {
    const now = Date.now()
    
    // Update wing flap animation
    if (chicken.isFlapping || chicken.isAutoFlying) {
      chicken.wingFlap = Math.sin(now * 0.03) * 0.8 + 0.2 // More dramatic flapping
      if (chicken.isFlapping) {
        chicken.flapDuration -= 16
        if (chicken.flapDuration <= 0) {
          chicken.isFlapping = false
        }
      }
    } else {
      chicken.wingFlap = Math.max(0, chicken.wingFlap - 0.05) // Gradual wing settle
    }
    
    // Update looking around behavior (more frequent and exaggerated)
    if (now - chicken.lastLookChange > 1500 + Math.random() * 2000) {
      const directions = [-1, -0.5, 0, 0.5, 1] // More look positions
      chicken.lookDirection = directions[Math.floor(Math.random() * directions.length)]
      chicken.lastLookChange = now
    }
    
    const x = chicken.x
    const y = chicken.y
    const size = chicken.size
    const bobbing = Math.sin(now * 0.008) * 2 // Gentle bobbing motion
    
    ctx.save()
    
    // Chicken body (large oval, cream colored)
    ctx.fillStyle = '#fff8dc'
    ctx.beginPath()
    ctx.ellipse(x + size/2, y + size/2 + bobbing, size * 0.4, size * 0.6, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Body outline
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Chicken head (smaller oval, positioned higher)
    ctx.fillStyle = '#fffacd'
    ctx.beginPath()
    const headX = x + size/2 + chicken.lookDirection * 3
    const headY = y + size * 0.25 + bobbing
    ctx.ellipse(headX, headY, size * 0.25, size * 0.3, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Chicken beak (triangular, orange)
    ctx.fillStyle = '#ff8c00'
    ctx.beginPath()
    const beakX = headX + size * 0.2 + chicken.lookDirection * 2
    const beakY = headY
    ctx.moveTo(beakX, beakY - 3)
    ctx.lineTo(beakX + 8, beakY)
    ctx.lineTo(beakX, beakY + 3)
    ctx.closePath()
    ctx.fill()
    
    // Chicken eyes (large and googly for comedy)
    const eyeSize = 4
    const eyeOffset = chicken.lookDirection * 2
    
    // Eye whites
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(headX - 6 + eyeOffset, headY - 4, eyeSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(headX + 2 + eyeOffset, headY - 4, eyeSize, 0, Math.PI * 2)
    ctx.fill()
    
    // Eye pupils (follow look direction)
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(headX - 6 + eyeOffset + chicken.lookDirection, headY - 4, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(headX + 2 + eyeOffset + chicken.lookDirection, headY - 4, 2, 0, Math.PI * 2)
    ctx.fill()
    
    // Eye highlights for extra comedy
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(headX - 6 + eyeOffset + chicken.lookDirection + 1, headY - 5, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(headX + 2 + eyeOffset + chicken.lookDirection + 1, headY - 5, 1, 0, Math.PI * 2)
    ctx.fill()
    
    // Chicken comb (wavy red crest)
    ctx.fillStyle = '#dc143c'
    ctx.beginPath()
    ctx.moveTo(headX - 8, headY - size * 0.3)
    ctx.quadraticCurveTo(headX - 4, headY - size * 0.4, headX, headY - size * 0.35)
    ctx.quadraticCurveTo(headX + 4, headY - size * 0.45, headX + 8, headY - size * 0.3)
    ctx.quadraticCurveTo(headX + 4, headY - size * 0.25, headX, headY - size * 0.3)
    ctx.quadraticCurveTo(headX - 4, headY - size * 0.25, headX - 8, headY - size * 0.3)
    ctx.fill()
    
    // Chicken wattles (dangly red bits, animated)
    const wattleSwing = Math.sin(now * 0.01) * 2
    ctx.fillStyle = '#dc143c'
    ctx.beginPath()
    ctx.ellipse(beakX - 2, beakY + 6 + wattleSwing, 3, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(beakX + 2, beakY + 8 + wattleSwing, 2, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Wings (animated, more dramatic)
    const wingFlap = chicken.wingFlap
    ctx.fillStyle = '#f5deb3'
    
    // Left wing
    ctx.beginPath()
    const leftWingX = x + size * 0.15
    const leftWingY = y + size * 0.4 + bobbing - wingFlap * 8
    ctx.ellipse(leftWingX, leftWingY, size * 0.2, size * 0.25, -0.3 - wingFlap * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#deb887'
    ctx.stroke()
    
    // Right wing
    ctx.beginPath()
    const rightWingX = x + size * 0.85
    const rightWingY = y + size * 0.4 + bobbing - wingFlap * 8
    ctx.ellipse(rightWingX, rightWingY, size * 0.2, size * 0.25, 0.3 + wingFlap * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Wing feather details
    ctx.fillStyle = '#deb887'
    ctx.beginPath()
    ctx.ellipse(leftWingX, leftWingY, size * 0.1, size * 0.15, -0.3 - wingFlap * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(rightWingX, rightWingY, size * 0.1, size * 0.15, 0.3 + wingFlap * 0.5, 0, Math.PI * 2)
    ctx.fill()
    
    // Chicken feet (orange, with toes)
    ctx.fillStyle = '#ff8c00'
    const footY = y + size * 0.9 + bobbing
    
    // Left foot
    ctx.beginPath()
    ctx.ellipse(x + size * 0.3, footY, 4, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    // Toes
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.ellipse(x + size * 0.3 - 3 + i * 3, footY + 4, 1, 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Right foot
    ctx.beginPath()
    ctx.ellipse(x + size * 0.7, footY, 4, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    // Toes
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.ellipse(x + size * 0.7 - 3 + i * 3, footY + 4, 1, 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Tail feathers (fluffy and animated)
    const tailWag = Math.sin(now * 0.005) * 3
    ctx.fillStyle = '#f0e68c'
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      const tailX = x - size * 0.1 + tailWag
      const tailY = y + size * 0.3 + i * 4 + bobbing
      ctx.ellipse(tailX, tailY, size * 0.15, size * 0.08, -0.5 + i * 0.2, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Add some personality - occasional blink
    if (Math.random() < 0.005) { // Very rare blink
      ctx.fillStyle = '#fffacd'
      ctx.fillRect(headX - 10 + eyeOffset, headY - 8, 16, 4)
    }
    
    ctx.restore()
  }

  // Play retro sound
  const playSound = (frequency: number, duration: number, type: OscillatorType = 'square') => {
    if (!audioContext.current) return
    
    const oscillator = audioContext.current.createOscillator()
    const gainNode = audioContext.current.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.current.destination)
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration)
    
    oscillator.start(audioContext.current.currentTime)
    oscillator.stop(audioContext.current.currentTime + duration)
  }

  // Generate math question based on difficulty
  const generateMathQuestion = (difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): MathQuestion => {
    let num1, num2, answer, question, points

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
        points = Math.floor(Math.random() * 50) + 75 // 75-125 points (MOST POINTS!)
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

  // Handle math answer submission
  const handleMathAnswer = () => {
    if (!mathQuestion) return

    const userAnswer = parseInt(mathAnswer)
    if (userAnswer === mathQuestion.answer) {
      setScore(prev => prev + mathQuestion.points)
      playSound(523, 0.2) // Success sound
      setShowMathQuestion(false)
      setMathQuestion(null)
      setMathAnswer('')
      startCountdown()
    } else {
      // Wrong answer - play bad sound and show confirmation
      playSound(196, 0.8, 'sawtooth') // Bad sound
      setShowConfirmation(true)
    }
  }

  // Handle wrong answer confirmation
  const handleWrongAnswerConfirmation = (reallyWrong: boolean) => {
    if (reallyWrong) {
      setLives(prev => prev - 1)
      // Increase obstacle spawn rate as punishment
      gameState.current.wrongAnswerPenalty += 3 // Significant penalty
      setShowMathQuestion(false)
      setShowConfirmation(false)
      setMathQuestion(null)
      setMathAnswer('')
      startCountdown()
    } else {
      setShowConfirmation(false)
      // Keep the math question open for another attempt
    }
  }

  // Start countdown before resuming game
  const startCountdown = () => {
    setIsCountingDown(true)
    setCountdown(3)
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setIsCountingDown(false)
          setGameStarted(true)
          
          // Start auto-fly period so player can see where chicken is
          const chicken = gameState.current.chicken
          chicken.isAutoFlying = true
          chicken.autoFlyTime = 2000 // Auto-fly for 2 seconds
          
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Spawn fruit with rarity system
  const spawnFruit = () => {
    const random = Math.random()
    let fruitType, color, rarity, difficulty, size
    
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
    
    const fruit: Fruit = {
      x: 800,
      y: Math.random() * 400 + 100,
      size,
      type: fruitType,
      color,
      rarity,
      difficulty
    }
    
    gameState.current.fruits.push(fruit)
  }

  // Spawn obstacle (more rocks, no spikes)
  const spawnObstacle = () => {
    const obstacleTypes: ('rock' | 'lightning')[] = ['rock', 'rock', 'rock', 'lightning'] // 75% rocks, 25% lightning
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]
    
    const obstacle: Obstacle = {
      x: 800,
      y: Math.random() * 400 + 100,
      width: type === 'rock' ? 40 : 30,
      height: type === 'rock' ? 40 : 50,
      type
    }
    
    gameState.current.obstacles.push(obstacle)
  }

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || showMathQuestion || isCountingDown) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw background (sky gradient)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#87CEEB')
      gradient.addColorStop(1, '#98FB98')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      for (let i = 0; i < 5; i++) {
        const x = (i * 200 + Date.now() * 0.02) % (canvas.width + 100)
        const y = 50 + i * 30
        ctx.beginPath()
        ctx.arc(x, y, 30, 0, Math.PI * 2)
        ctx.arc(x + 25, y, 35, 0, Math.PI * 2)
        ctx.arc(x + 50, y, 30, 0, Math.PI * 2)
        ctx.fill()
      }

      // Update chicken physics
      const chicken = gameState.current.chicken
      
      // Handle auto-fly period when game resumes
      if (chicken.isAutoFlying) {
        chicken.autoFlyTime -= 16 // Decrease by ~16ms per frame (60fps)
        if (chicken.autoFlyTime > 0) {
          // Auto-fly with gentle flapping
          if (chicken.velocity > -2) {
            chicken.velocity = -4 // Gentle upward movement
          }
        } else {
          chicken.isAutoFlying = false
        }
      }
      
      // Normal player controls (only work when not auto-flying)
      if (!chicken.isAutoFlying && (gameState.current.keys[' '] || gameState.current.keys['ArrowUp'])) {
        chicken.velocity = -8
        chicken.isFlapping = true
        chicken.flapDuration = 300 // Flap for 300ms
        playSound(440, 0.1)
      }
      
      chicken.velocity += 0.5 // gravity
      chicken.y += chicken.velocity
      
      // Keep chicken in bounds
      if (chicken.y < 0) chicken.y = 0
      if (chicken.y > canvas.height - chicken.size) {
        chicken.y = canvas.height - chicken.size
        // Only lose life if chicken was actually falling and enough time has passed since last damage
        const now = Date.now()
        if (chicken.velocity > 0 && lives > 0 && now - chicken.lastDamageTime > 1000) {
          setLives(prev => Math.max(0, prev - 1))
          chicken.lastDamageTime = now
          playSound(196, 0.3)
        }
      }

      // Draw chicken
      drawChicken(ctx, chicken)

      // Draw auto-fly indicator
      if (chicken.isAutoFlying) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)'
        ctx.font = '16px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('🐔 AUTO-FLYING... GET READY! 🐔', canvas.width / 2, 50)
        
        // Draw progress bar
        const progress = 1 - (chicken.autoFlyTime / 2000)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.fillRect(canvas.width / 2 - 100, 60, 200, 10)
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)'
        ctx.fillRect(canvas.width / 2 - 100, 60, 200 * progress, 10)
      }

      // Spawn fruits
      if (Date.now() - gameState.current.lastFruitSpawn > 2000) {
        spawnFruit()
        gameState.current.lastFruitSpawn = Date.now()
      }

      // Spawn obstacles (more frequent from the beginning, more rocks)
      const baseObstacleDelay = 2000 // Reduced from 3000 to 2000 for more obstacles
      const penaltyMultiplier = Math.max(0.2, 1 - (gameState.current.wrongAnswerPenalty * 0.1))
      const obstacleDelay = baseObstacleDelay * penaltyMultiplier
      
      if (Date.now() - gameState.current.lastObstacleSpawn > obstacleDelay) {
        spawnObstacle()
        gameState.current.lastObstacleSpawn = Date.now()
      }
      
      // Decrease wrong answer penalty over time
      if (gameState.current.wrongAnswerPenalty > 0) {
        gameState.current.wrongAnswerPenalty -= 0.01
      }

      // Update and draw fruits
      gameState.current.fruits = gameState.current.fruits.filter(fruit => {
        fruit.x -= gameState.current.gameSpeed

        // Draw fruit with rarity glow effect
        ctx.save()
        
        // Add glow effect based on rarity
        if (fruit.rarity === 'rare') {
          ctx.shadowColor = '#ffff44'
          ctx.shadowBlur = 10
        } else if (fruit.rarity === 'legendary') {
          ctx.shadowColor = '#44ff44'
          ctx.shadowBlur = 15
          // Pulsing effect for legendary
          const pulse = Math.sin(Date.now() * 0.01) * 0.1 + 1
          ctx.scale(pulse, pulse)
        }
        
        ctx.font = `${fruit.size}px Arial`
        ctx.fillText(fruit.type, fruit.x, fruit.y + fruit.size)
        ctx.restore()

        // Collision detection
        if (
          chicken.x < fruit.x + fruit.size &&
          chicken.x + chicken.size > fruit.x &&
          chicken.y < fruit.y + fruit.size &&
          chicken.y + chicken.size > fruit.y
        ) {
          // Fruit collected!
          playSound(659, 0.2)
          const question = generateMathQuestion(fruit.difficulty)
          setMathQuestion(question)
          setShowMathQuestion(true)
          setGameStarted(false)
          return false // Remove fruit
        }

        return fruit.x > -fruit.size
      })

      // Update and draw obstacles
      gameState.current.obstacles = gameState.current.obstacles.filter(obstacle => {
        obstacle.x -= gameState.current.gameSpeed

        // Draw obstacle based on type (no more spikes)
        if (obstacle.type === 'rock') {
          // Draw rock (gray with darker outline)
          ctx.fillStyle = '#666666'
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
          ctx.fillStyle = '#444444'
          ctx.fillRect(obstacle.x + 3, obstacle.y + 3, obstacle.width - 6, obstacle.height - 6)
          // Add some texture
          ctx.fillStyle = '#888888'
          ctx.fillRect(obstacle.x + 5, obstacle.y + 5, 8, 8)
          ctx.fillRect(obstacle.x + 15, obstacle.y + 10, 6, 6)
          ctx.fillRect(obstacle.x + 8, obstacle.y + 20, 10, 8)
        } else if (obstacle.type === 'lightning') {
          // Draw lightning bolt (yellow)
          ctx.fillStyle = '#ffff00'
          ctx.beginPath()
          ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y)
          ctx.lineTo(obstacle.x + obstacle.width / 4, obstacle.y + obstacle.height / 2)
          ctx.lineTo(obstacle.x + obstacle.width * 3/4, obstacle.y + obstacle.height / 2)
          ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height)
          ctx.lineTo(obstacle.x + obstacle.width * 3/4, obstacle.y + obstacle.height / 2)
          ctx.lineTo(obstacle.x + obstacle.width / 4, obstacle.y + obstacle.height / 2)
          ctx.closePath()
          ctx.fill()
          
          // Add electric glow effect
          ctx.shadowColor = '#ffff00'
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }

        // Collision detection with obstacles - prevent multiple triggers
        if (
          chicken.x < obstacle.x + obstacle.width &&
          chicken.x + chicken.size > obstacle.x &&
          chicken.y < obstacle.y + obstacle.height &&
          chicken.y + chicken.size > obstacle.y
        ) {
          // Only trigger if chicken is not already dead/dying and enough time has passed
          const now = Date.now()
          if (lives > 0 && now - chicken.lastDamageTime > 500) {
            setLives(0) // Instant death for obstacles
            chicken.lastDamageTime = now
            playSound(196, 1, 'sawtooth') // Death sound
          }
          return false // Remove obstacle
        }

        return obstacle.x > -obstacle.width
      })

      // Increase game speed gradually
      gameState.current.gameSpeed += 0.001

      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [gameStarted, gameOver, showMathQuestion, isCountingDown])

  // Keyboard and mouse controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.current.keys[e.key] = true
      if (e.key === ' ') {
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.current.keys[e.key] = false
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (gameStarted && !gameOver && !showMathQuestion && !isCountingDown) {
        const chicken = gameState.current.chicken
        if (!chicken.isAutoFlying) { // Only allow manual control when not auto-flying
          chicken.velocity = -8
          chicken.isFlapping = true
          chicken.flapDuration = 300 // Flap for 300ms
          playSound(440, 0.1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [gameStarted, gameOver, showMathQuestion, isCountingDown])

  // Check game over
  useEffect(() => {
    if (lives <= 0) {
      console.log('Game Over triggered - Lives:', lives)
      setGameOver(true)
      setGameStarted(false)
      playSound(196, 1, 'sawtooth')
    }
  }, [lives])

  // Restart game
  const restartGame = () => {
    setScore(0)
    setLives(3)
    setGameOver(false)
    setShowMathQuestion(false)
    setMathQuestion(null)
    setMathAnswer('')
    setShowConfirmation(false)
    setCountdown(0)
    setIsCountingDown(false)
    setGameStarted(true)
    
    // Reset game state
    gameState.current = {
      chicken: { 
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
      },
      fruits: [],
      trees: [],
      obstacles: [],
      gameSpeed: 2,
      lastFruitSpawn: 0,
      lastObstacleSpawn: 0,
      wrongAnswerPenalty: 0,
      keys: {}
    }
  }

  // Start game
  const startGame = () => {
    setGameStarted(true)
    playSound(523, 0.3)
  }

  return (
    <>
      <Head>
        <title>Math Fruit Hunter - Chicken Edition</title>
        <meta name="description" content="A retro-style fruit hunting game with an animated chicken and math challenges" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="game-container">
        <h1 className="game-title">🐔 MATH FRUIT HUNTER 🐔</h1>
        
        <div className="game-info">
          <div className="score">SCORE: {score}</div>
          <div className="lives">LIVES: {'❤️'.repeat(lives)}</div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ display: gameStarted || gameOver ? 'block' : 'none' }}
        />

        {isCountingDown && (
          <div className="countdown-modal">
            <div className="countdown-content">
              <h2>🚀 GET READY! 🚀</h2>
              <div className="countdown-number">{countdown}</div>
              <p>Game resuming...</p>
            </div>
          </div>
        )}

        {!gameStarted && !gameOver && (
          <div style={{ textAlign: 'center' }}>
            <button className="restart-button" onClick={startGame}>
              START GAME
            </button>
            <div className="instructions">
              <p>🐔 Control your comical chicken with SPACEBAR, UP ARROW, or CLICK</p>
              <p>🍎 Apples (50%) - Easy math, 10-30 points</p>
              <p>🍊🍇 Oranges/Grapes (40%) - Medium math, 25-55 points</p>
              <p>🍌 Bananas (8%) - Hard math, 75-125 points (MOST POINTS!)</p>
              <p>🥝 Kiwis (2%) - Extreme math, 40-80 points (RAREST!)</p>
              <p>❤️ Wrong answers cost lives AND spawn more obstacles!</p>
              <p>⚠️ Avoid obstacles - they cause instant death!</p>
              <p>👀 Watch your chicken look around, flap wings, and bob around!</p>
              <p>✈️ After math questions, chicken auto-flies briefly so you can see where it is!</p>
            </div>
          </div>
        )}

        {showMathQuestion && mathQuestion && (
          <div className="math-modal">
            <div className="math-question">
              <h2>🧮 MATH CHALLENGE! 🧮</h2>
              <div className="difficulty-indicator">
                <span className={`difficulty ${mathQuestion.difficulty}`}>
                  {mathQuestion.difficulty.toUpperCase()} 
                  {mathQuestion.difficulty === 'easy' && ' 🍎'}
                  {mathQuestion.difficulty === 'medium' && ' 🍊🍇'}
                  {mathQuestion.difficulty === 'hard' && ' 🍌'}
                  {mathQuestion.difficulty === 'extreme' && ' 🥝'}
                </span>
              </div>
              <p>{mathQuestion.question}</p>
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                className="math-input"
                placeholder="?"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleMathAnswer()}
              />
              <br />
              <button className="math-button" onClick={handleMathAnswer}>
                SUBMIT ({mathQuestion.points} pts)
              </button>
            </div>
          </div>
        )}

        {showConfirmation && mathQuestion && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h2>❌ WRONG ANSWER! ❌</h2>
              <p>Your answer: {mathAnswer}</p>
              <p>The question was: {mathQuestion.question}</p>
              <p>Do you really think that is the result?</p>
              <div className="confirmation-buttons">
                <button 
                  className="confirmation-button wrong" 
                  onClick={() => handleWrongAnswerConfirmation(true)}
                >
                  YES, I'M WRONG (-1 LIFE)
                </button>
                <button 
                  className="confirmation-button retry" 
                  onClick={() => handleWrongAnswerConfirmation(false)}
                >
                  NO, LET ME TRY AGAIN
                </button>
              </div>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-over">
            <div className="game-over-content">
              <h2>💀 GAME OVER! 💀</h2>
              <p>Final Score: {score}</p>
              <p>You collected fruits and solved math problems!</p>
              <button className="restart-button" onClick={restartGame}>
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
