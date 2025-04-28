/**
 * @description Get actual video mode parameters. Returns an object.
 * @returns Available modes: NTSC, DTV_480p, PAL, DTV_576p, DTV_720p, DTV_1080i
 * */

import { Vector2 } from "threejs-math";
import { ScreenSettings } from "../settings/screen";

export let g_Canvas = Screen.getMode();

export let SetupScreen = () => {
  g_Canvas.zbuffering = ScreenSettings.zBuffering;
  g_Canvas.psmz = ScreenSettings.psmz;

  Screen.setMode(g_Canvas);
};

export const SCREEN_VECTOR = new Vector2(g_Canvas.width, g_Canvas.height);
export const HALF_SCREEN_VECTOR = SCREEN_VECTOR.clone().divideScalar(2);
