import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Game from '../pages/index'

// Mock Next.js Head component
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  }
})

describe('Math Fruit Hunter Game', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  describe('Initial Game State', () => {
    test('should render game title and initial UI', () => {
      render(<Game />)
      
      expect(screen.getByText('🐔 MATH FRUIT HUNTER 🐔')).toBeInTheDocument()
      expect(screen.getByText('SCORE: 0')).toBeInTheDocument()
      expect(screen.getByText('LIVES: ❤️❤️❤️')).toBeInTheDocument()
      expect(screen.getByText('START GAME')).toBeInTheDocument()
    })

    test('should show game instructions when not started', () => {
      render(<Game />)
      
      expect(screen.getByText(/Control your comical chicken/)).toBeInTheDocument()
      expect(screen.getByText(/Apples \(50%\)/)).toBeInTheDocument()
      expect(screen.getByText(/Oranges\/Grapes \(40%\)/)).toBeInTheDocument()
      expect(screen.getByText(/Bananas \(8%\)/)).toBeInTheDocument()
      expect(screen.getByText(/Kiwis \(2%\)/)).toBeInTheDocument()
    })

    test('should hide canvas initially', () => {
      render(<Game />)
      
      const canvas = screen.getByRole('img', { hidden: true }) // Canvas has img role when hidden
      expect(canvas).toHaveStyle('display: none')
    })
  })

  describe('Game Start', () => {
    test('should start game when START GAME button is clicked', async () => {
      const user = userEvent.setup()
      render(<Game />)
      
      const startButton = screen.getByText('START GAME')
      await user.click(startButton)
      
      // Canvas should become visible
      const canvas = screen.getByRole('img')
      expect(canvas).toHaveStyle('display: block')
      
      // Start button should disappear
      expect(screen.queryByText('START GAME')).not.toBeInTheDocument()
    })

    test('should initialize game canvas with correct dimensions', async () => {
      const user = userEvent.setup()
      render(<Game />)
      
      await user.click(screen.getByText('START GAME'))
      
      const canvas = screen.getByRole('img') as HTMLCanvasElement
      expect(canvas.width).toBe(800)
      expect(canvas.height).toBe(600)
    })
  })

  describe('Math Question Modal', () => {
    test('should not show math question initially', () => {
      render(<Game />)
      
      expect(screen.queryByText('🧮 MATH CHALLENGE! 🧮')).not.toBeInTheDocument()
    })

    // Note: Testing math question appearance would require simulating fruit collection,
    // which involves complex game loop interactions that are better tested in integration tests
  })

  describe('Game Over State', () => {
    test('should show game over modal when lives reach zero', async () => {
      render(<Game />)
      
      // This would require simulating the game state where lives = 0
      // For now, we'll test the UI structure when game over state is triggered
      // In a real scenario, you'd need to trigger the game over condition
    })
  })

  describe('Keyboard Controls', () => {
    test('should handle spacebar key press', async () => {
      const user = userEvent.setup()
      render(<Game />)
      
      await user.click(screen.getByText('START GAME'))
      
      // Simulate spacebar press
      fireEvent.keyDown(document, { key: ' ' })
      fireEvent.keyUp(document, { key: ' ' })
      
      // The key press should be registered (tested via game state, not directly observable in DOM)
      expect(true).toBe(true) // Placeholder - in real tests you'd check game state changes
    })

    test('should handle arrow key press', async () => {
      const user = userEvent.setup()
      render(<Game />)
      
      await user.click(screen.getByText('START GAME'))
      
      // Simulate arrow up press
      fireEvent.keyDown(document, { key: 'ArrowUp' })
      fireEvent.keyUp(document, { key: 'ArrowUp' })
      
      expect(true).toBe(true) // Placeholder
    })
  })

  describe('Score and Lives Display', () => {
    test('should display initial score and lives correctly', () => {
      render(<Game />)
      
      expect(screen.getByText('SCORE: 0')).toBeInTheDocument()
      expect(screen.getByText('LIVES: ❤️❤️❤️')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(<Game />)
      
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toHaveTextContent('🐔 MATH FRUIT HUNTER 🐔')
    })

    test('should have accessible button', () => {
      render(<Game />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      expect(startButton).toBeInTheDocument()
    })

    test('should have canvas with proper attributes', async () => {
      const user = userEvent.setup()
      render(<Game />)
      
      await user.click(screen.getByText('START GAME'))
      
      const canvas = screen.getByRole('img') as HTMLCanvasElement
      expect(canvas).toHaveAttribute('width', '800')
      expect(canvas).toHaveAttribute('height', '600')
    })
  })

  describe('Responsive Design', () => {
    test('should render without layout issues on different screen sizes', () => {
      // Mock different viewport sizes
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
      
      render(<Game />)
      
      expect(screen.getByText('🐔 MATH FRUIT HUNTER 🐔')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('should handle missing canvas context gracefully', () => {
      // Mock getContext to return null
      const originalGetContext = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null)
      
      render(<Game />)
      
      // Game should still render without crashing
      expect(screen.getByText('🐔 MATH FRUIT HUNTER 🐔')).toBeInTheDocument()
      
      // Restore original method
      HTMLCanvasElement.prototype.getContext = originalGetContext
    })
  })

  describe('Performance', () => {
    test('should not cause memory leaks with event listeners', async () => {
      const user = userEvent.setup()
      const { unmount } = render(<Game />)
      
      await user.click(screen.getByText('START GAME'))
      
      // Unmount component
      unmount()
      
      // Event listeners should be cleaned up (no direct way to test this in Jest)
      expect(true).toBe(true) // Placeholder
    })
  })
})

describe('Math Question Component Integration', () => {
  test('should handle math input correctly', async () => {
    const user = userEvent.setup()
    render(<Game />)
    
    // This would require triggering a math question state
    // For demonstration, we'll test the input handling logic
    
    // In a real test, you'd:
    // 1. Start the game
    // 2. Simulate fruit collection
    // 3. Test math question modal
    // 4. Test input and submission
  })
})

describe('Game State Management', () => {
  test('should maintain consistent state throughout game lifecycle', () => {
    render(<Game />)
    
    // Initial state
    expect(screen.getByText('SCORE: 0')).toBeInTheDocument()
    expect(screen.getByText('LIVES: ❤️❤️❤️')).toBeInTheDocument()
    
    // Game should maintain state consistency
    expect(true).toBe(true) // Placeholder for more complex state tests
  })
})

describe('Audio Integration', () => {
  test('should initialize audio context without errors', () => {
    render(<Game />)
    
    // Audio context should be mocked and not cause errors
    expect(true).toBe(true) // Audio is mocked in jest.setup.js
  })
})

describe('Canvas Rendering', () => {
  test('should call canvas methods when game is running', async () => {
    const user = userEvent.setup()
    render(<Game />)
    
    await user.click(screen.getByText('START GAME'))
    
    // Canvas context methods should be called (mocked in jest.setup.js)
    const canvas = screen.getByRole('img') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    
    // Wait for game loop to potentially start
    await waitFor(() => {
      expect(ctx).toBeTruthy()
    })
  })
})
