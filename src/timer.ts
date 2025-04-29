export const FrameLimits = {
  FPS_5: 1000 / 5, // ~200ms
  FPS_10: 1000 / 10, // ~100ms
  FPS_15: 1000 / 15, // ~66.67ms
  FPS_20: 1000 / 20, // ~50ms
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
  private maxStepsPerFrame: number = 3;

  private readonly maxAccumulatedTime = FrameLimits.FPS_20;

  private updateTracker = {
    accumulator: 0,
    frameLimit: 0,
    fixedDeltaTime: 0,
    steps: 0,
  };

  private renderTracker = {
    accumulator: 0,
    frameLimit: 0,
    steps: 0,
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
    this.lastTime = Timer.getTime(this.timer) / 1000; // Convert from microseconds to milliseconds

    this.updateTracker.frameLimit = updateFrameLimit;
    this.updateTracker.accumulator = 0;

    this.renderTracker.frameLimit = renderFrameLimit;
    this.renderTracker.accumulator =
      -renderFrameLimit / (renderFrameLimit / updateFrameLimit);

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

    // Reset the step counters
    this.updateTracker.steps = 0;
    this.renderTracker.steps = 0;

    onUpdate(this.deltaTime);
    // console.log(`u: (${this.deltaTime})`);

    this.updateTracker.accumulator = Math.min(
      this.updateTracker.accumulator + this.deltaTime,
      this.updateTracker.frameLimit
    );

    while (
      this.updateTracker.accumulator >= this.updateTracker.frameLimit &&
      this.updateTracker.steps < this.maxStepsPerFrame
    ) {
      onFixedUpdate(this.updateTracker.frameLimit);
      this.updateTracker.accumulator -= this.updateTracker.frameLimit;
      this.updateTime = currentTime - this.lastUpdateTime;
      this.lastUpdateTime = currentTime;
      this.updateTracker.steps++;

      // console.log(`f(${this.UpdateTime})`);
    }

    this.renderTracker.accumulator = Math.min(
      this.renderTracker.accumulator + this.deltaTime,
      this.renderTracker.frameLimit
    );

    while (
      this.renderTracker.accumulator >= this.renderTracker.frameLimit &&
      this.renderTracker.steps < this.maxStepsPerFrame
    ) {
      onRender();
      this.renderTracker.accumulator -= this.renderTracker.frameLimit;
      this.renderTime = currentTime - this.lastRenderTime;
      this.lastRenderTime = currentTime;
      this.renderTracker.steps++;

      // console.log(`r(${this.RenderTime})`);
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
