// {"name": "Athena develop environment", "author": "Wellinator", "version": "04072023", "icon": "render_icon.png", "file": "3dcollision.js"}

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

const grassColor = Color.new(196, 224, 83, 128);

const gameTimer = new GameTimer(FrameLimits.FPS_30, FrameLimits.FPS_60);
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
      Screen.clear(grassColor);

      gameState.render();

      // Draw debug info
      font.print(5, 5, `FPS: ${gameTimer.FPS}`);
      font.print(5, 25, `render: ${gameTimer.RenderTime.toFixed(2)}ms`);
      font.print(5, 45, `update: ${gameTimer.UpdateTime.toFixed(2)}ms`);
      font.print(5, 65, `Objects: ${gameState.objectsCount}`);
      font.print(5, 85, `Collisions: ${gameState.collisionsCounter}`);

      Screen.flip();
    }
  );
}, 0);
