import { Singleton } from "../abstract/singleton";

export class AudioController extends Singleton {
  // TODO: refactor to audio lib
  // private audioLib = {};

  constructor() {
    super();
    Sound.setVolume(80);
  }

  public loadMusic(path: string): Audio {
    return Sound.load(path);
  }

  public playMusic(music: Audio): void {
    Sound.play(music);
  }

  public stopMusic(music: Audio): void {
    Sound.pause(music);
  }

  public repeat(onOff: boolean): void {
    Sound.repeat(onOff);
  }
}
