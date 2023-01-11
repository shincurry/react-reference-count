import { EventEmitter } from "events";

export class ReferenceCount {
  private CountChangeEventType = "ReferenceChange";

  private countMap: Map<string, number> = new Map();
  private events: EventEmitter = new EventEmitter();


  public getCountMap() {
    return new Map(this.countMap)
  }
  public getCount(key: string) {
    return this.countMap.get(key)
  }

  public retain(key: string, delta: number = 1) {
    const oldCount = this.countMap.get(key);
    if (!oldCount) {
      this.countMap.set(key, delta);
      this.events.emit(this.CountChangeEventType, key, delta);
    } else {
      this.countMap.set(key, oldCount + delta);
      this.events.emit(this.CountChangeEventType, key, oldCount + delta);
    }
  }
  public release(key: string, delta: number = 1) {
    const oldCount = this.countMap.get(key);
    if (!oldCount) return;
    if (oldCount <= delta) {
      this.countMap.delete(key);
      this.events.emit(this.CountChangeEventType, key, 0);
    } else {
      this.countMap.set(key, oldCount - delta);
      this.events.emit(this.CountChangeEventType, key, oldCount - delta);
    }
  }

  public subscribeCountChange(listener: (key: string, count: number) => void) {
    this.events.on(this.CountChangeEventType, listener)
  }
  public unsubscribeCountChange(listener: (key: string, count: number) => void) {
    this.events.off(this.CountChangeEventType, listener)
  }
}
