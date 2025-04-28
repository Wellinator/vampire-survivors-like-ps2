// {"name": "Athena develop environment", "author": "Wellinator", "version": "04072023", "icon": "render_icon.png", "file": "3dcollision.js"}

import { globalPosPad } from "./fake_camera";
import { g_Pad } from "./pad";
import { font } from "./scripts/init/init-font";
import { SetupRender } from "./scripts/init/init-render";
import { SetupScreen } from "./scripts/init/init-screen";
import { GameplayState } from "./states/state_gameplay";
import { FrameLimits, GameTimer } from "./timer";

// Init screen configuration
SetupScreen();

// Init render configuration
SetupRender();

Screen.setFrameCounter(true);
Screen.setVSync(false);

// Change your root folder to "render" so we can work with file path magic :p
// os.chdir("../assets");

Camera.position(0.0, 0.0, 0.0);
Camera.type(Camera.LOOKAT);

const gray = Color.new(40, 40, 40, 128);

const gameTimer = new GameTimer(FrameLimits.FPS_15, FrameLimits.FPS_30);
const gameState = new GameplayState();

os.setInterval(() => {
  gameTimer.update(
    (deltaTime) => {
      // Update stage
      Camera.update();
      g_Pad.update();

      gameState.update(deltaTime);
    },
    (fixedDeltaTime) => {
      gameState.fixedUpdate(fixedDeltaTime);
    },
    () => {
      Screen.clear(gray);

      // Render Stage
      // Draw grid
      const gridSize = 128.0;
      const gridColor = Color.new(100, 10, 10, 128);

      for (let i = -10; i < 10; i++) {
        const x = i * gridSize;
        for (let j = -10; j < 10; j++) {
          const y = j * gridSize;
          Draw.rect(
            x - globalPosPad.x,
            y - globalPosPad.y,
            gridSize,
            gridSize,
            (i + j) & 0x01 ? gridColor : gray
          );
        }
      }

      gameState.render();

      // Draw debug info
      font.print(5, 5, `FPS: ${gameTimer.FPS}`);
      font.print(5, 25, `render: ${Math.floor(gameTimer.RenderTime)}ms`);
      font.print(5, 45, `update: ${Math.floor(gameTimer.UpdateTime)}ms`);
      font.print(5, 65, `Enemies: ${gameState.enemiesCounter}`);

      Screen.flip();
    }
  );
}, 0);
