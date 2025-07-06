# 🍎 Math Fruit Hunter

A retro-style browser game built with Next.js where you play as a bird collecting fruits from trees and solving math problems to earn points!

## 🎮 Game Features

- **Flappy Bird-style gameplay** - Control a pixelated bird with spacebar or arrow keys
- **Fruit collection** - Fly around and collect various fruits (🍎🍊🍌🍇🥝)
- **Math challenges** - Each fruit collected triggers a math question
- **Retro aesthetics** - Pixel-perfect graphics with a nostalgic 8-bit style
- **Chiptune sounds** - Procedurally generated retro sound effects
- **Progressive difficulty** - Game speed increases over time
- **Lives system** - Wrong answers cost lives, adding challenge

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## 🎯 How to Play

1. **Start the game** - Click "START GAME" button
2. **Control your bird** - Use SPACEBAR or UP ARROW key to fly upward
3. **Collect fruits** - Fly into fruits floating in the sky
4. **Solve math problems** - Each fruit triggers a math question
5. **Earn points** - Correct answers give you points (10-60 per question)
6. **Avoid losing lives** - Wrong answers cost you a life
7. **Survive as long as possible** - Game gets faster over time!

## 🎨 Game Mechanics

### Controls
- **SPACEBAR** or **UP ARROW** - Make the bird fly upward
- **Gravity** - Bird naturally falls down
- **Collision** - Touch fruits to collect them

### Scoring System
- Each correct math answer gives 10-60 points
- Points are randomly assigned per question
- Final score displayed on game over

### Math Questions
- **Addition** - Simple addition problems (1-50 + 1-50)
- **Subtraction** - Subtraction with positive results
- **Multiplication** - Basic multiplication tables (1-12 × 1-12)

### Lives System
- Start with 3 lives (❤️❤️❤️)
- Lose a life for wrong math answers
- Lose a life for hitting the ground
- Game over when all lives are lost

## 🎵 Audio Features

The game includes procedurally generated retro sound effects:
- **Jump sound** - 440Hz square wave when flying
- **Collect sound** - 659Hz tone when collecting fruits
- **Success sound** - 523Hz tone for correct answers
- **Error sound** - 196Hz tone for wrong answers or collisions
- **Game over sound** - Low sawtooth wave

## 🛠 Technical Details

### Built With
- **Next.js 14** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **HTML5 Canvas** - 2D graphics rendering
- **Web Audio API** - Procedural sound generation
- **CSS3** - Retro styling with pixel fonts

### Project Structure
```
├── pages/
│   ├── _app.tsx          # App wrapper
│   └── index.tsx         # Main game component
├── styles/
│   └── globals.css       # Global styles and retro theme
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── next.config.js        # Next.js configuration
```

### Key Components
- **Game Loop** - 60fps animation using requestAnimationFrame
- **Physics Engine** - Simple gravity and collision detection
- **State Management** - React hooks for game state
- **Math Generator** - Random math problem creation
- **Audio System** - Web Audio API for retro sounds

## 🎨 Retro Design Elements

- **Pixel Perfect Graphics** - Blocky, 8-bit style sprites
- **Retro Color Palette** - Bright, saturated colors
- **Pixel Font** - "Press Start 2P" Google Font
- **Gradient Backgrounds** - Classic 80s/90s gradients
- **Chiptune Audio** - Square wave and sawtooth oscillators

## 🚀 Deployment

This Next.js app can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the 'out' folder to Netlify
```

### AWS Amplify
- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `.next`

## 🎮 Game Tips

1. **Timing is key** - Don't spam the spacebar, use controlled taps
2. **Practice math** - Brush up on basic arithmetic for higher scores
3. **Stay calm** - Take your time with math questions, there's no timer
4. **Watch the speed** - Game gets faster, so collect fruits early when it's easier
5. **Conserve lives** - Double-check your math answers!

## 🐛 Troubleshooting

### Audio Not Working
- Make sure your browser supports Web Audio API
- Check if audio is muted in browser/system
- Try clicking on the page first (some browsers require user interaction)

### Performance Issues
- Close other browser tabs
- Try a different browser (Chrome/Firefox recommended)
- Check if hardware acceleration is enabled

### Controls Not Responding
- Make sure the game canvas has focus
- Try clicking on the game area first
- Check if other applications are capturing keyboard input

## 📱 Mobile Support

The game includes responsive design for mobile devices:
- Touch controls (tap to fly)
- Responsive canvas sizing
- Mobile-optimized UI elements

## 🤝 Contributing

Feel free to fork this project and add your own features:
- New fruit types
- Different math operations (division, fractions)
- Power-ups and special abilities
- Multiplayer support
- Level progression system

## 📄 License

This project is open source and available under the MIT License.

---

**Have fun playing Math Fruit Hunter! 🍎🧮🎮**
