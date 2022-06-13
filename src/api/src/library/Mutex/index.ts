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

  // naive spin lock style try lock with timeout
  // not efficient, do not use if protected area is heavily accessed
  async tryLockWithTimeout(timeout: number) {
    const curDateMs = new Date().getTime();
    while (new Date().getTime() - curDateMs < timeout) {
      if (this.isLocked()) {
        // eslint-disable-next-line no-await-in-loop,no-promise-executor-return
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
      }
      if (!this.isLocked()) {
        this.tryLock();
        return;
      }
    }
    throw new Error('Mutex timed out waiting for lock');
  }

  isLocked(): boolean {
    return this.locked;
  }

  unlock() {
    this.locked = false;
  }
}
