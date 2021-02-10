export default class Mutex {
  private locked: boolean;

  constructor() {
    this.locked = false;
  }

  tryLock() {
    if (this.locked) {
      throw new Error('mutex already locked');
    }
    this.locked = true;
  }

  isLocked(): boolean {
    return this.locked;
  }

  unlock() {
    this.locked = false;
  }
}
