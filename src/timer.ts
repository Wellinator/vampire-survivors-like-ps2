export const FrameLimits = {
  FPS_15: 1000 / 15, // ~66.67ms
  FPS_30: 1000 / 30, // ~33.33ms
  FPS_60: 1000 / 60, // ~16.67ms
  FPS_120: 1000 / 120, // ~8.33ms
};

export class GameTimer {
  private timer = Timer.new();
  private deltaTime: number = 0;
  private lastTime: number = 0;

  private lastRenderTime: number = 0;
  private lastUpdateTime: number = 0;
  private renderTime: number = 0;
  private updateTime: number = 0;

  private updateTracker = {
    accumulator: 0,
    frameLimit: 0,
    fixedDeltaTime: 0,
  };

  private renderTracker = {
    accumulator: 0,
    frameLimit: 0,
  };

  get DeltaTime(): number {
    return this.deltaTime;
  }

  get FPS(): number {
    return Math.floor(1000 / this.deltaTime);
  }

  get RenderTime(): number {
    return this.renderTime / 1000; // Convert from microseconds to milliseconds
  }

  get UpdateTime(): number {
    return this.updateTime / 1000; // Convert from microseconds to milliseconds
  }

  constructor(
    updateFrameLimit: number = FrameLimits.FPS_30,
    renderFrameLimit: number = FrameLimits.FPS_60
  ) {
    this.lastTime = Timer.getTime(this.timer);

    this.updateTracker.frameLimit = updateFrameLimit;
    this.updateTracker.accumulator = 0;
    this.updateTracker.fixedDeltaTime = updateFrameLimit;

    this.renderTracker.frameLimit = renderFrameLimit;
    this.renderTracker.accumulator = 0;

    this.lastUpdateTime = this.lastTime;
    this.lastRenderTime = this.lastTime;

    console.log(`updateFrameLimit: ${this.updateTracker.frameLimit}`);
    console.log(`renderFrameLimit: ${this.renderTracker.frameLimit}`);
  }

  public update(
    onUpdate: (deltaTime: number) => void,
    onFixedUpdate: (fixedDeltaTime: number) => void,
    onRender: () => void
  ): void {
    const currentTime = Timer.getTime(this.timer);
    this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert from microseconds to milliseconds
    this.lastTime = currentTime;

    onUpdate(this.deltaTime);
    // console.log(`u: (${this.deltaTime})`);

    this.updateTracker.accumulator += this.deltaTime;

    while (this.updateTracker.accumulator >= this.updateTracker.frameLimit) {
      onFixedUpdate(this.updateTracker.frameLimit);
      this.updateTracker.accumulator -= this.updateTracker.frameLimit;
      this.updateTime = currentTime - this.lastUpdateTime;
      this.lastUpdateTime = currentTime;
      // console.log(
      //   `f(${this.UpdateTime})`
      // );
    }

    this.renderTracker.accumulator += this.deltaTime;
    while (this.renderTracker.accumulator >= this.renderTracker.frameLimit) {
      onRender();
      this.renderTracker.accumulator -= this.renderTracker.frameLimit;
      this.renderTime = currentTime - this.lastRenderTime;
      this.lastRenderTime = currentTime;
      // console.log(
      //   `r(${this.RenderTime})`
      // );
    }
  }

  setUpdateFrameLimit(frameLimit: number) {
    this.updateTracker.frameLimit = frameLimit;
    this.updateTracker.fixedDeltaTime = 1000 / frameLimit;
  }

  setRenderFrameLimit(frameLimit: number) {
    this.renderTracker.frameLimit = frameLimit;
  }
}
