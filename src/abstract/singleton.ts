type Constructor<T = {}> = new (...args: any[]) => T;

export abstract class Singleton {
  private static _instances: Map<Function, any> = new Map();

  protected constructor() {
    const constructor = this.constructor;
    if (Singleton._instances.has(constructor)) {
      throw new Error(`Cannot instantiate ${constructor.name} directly - use getInstance()`);
    }
  }

  public static getInstance<T extends Singleton>(this: Constructor<T>): T {
    if (!Singleton._instances.has(this)) {
      Singleton._instances.set(this, new this());
    }
    return Singleton._instances.get(this);
  }

  public static clearInstance<T extends Singleton>(this: Constructor<T>): void {
    Singleton._instances.delete(this);
  }
}