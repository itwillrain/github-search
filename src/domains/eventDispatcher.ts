export default class EventDispatcher {
  observers: any;

  constructor() {
    this.observers = {};
  }

  /**
   * イベントリスナの追加
   * @param type イベントタイプ
   * @param callback
   */
  addObserver(type: string, callback: Function): void {
    if (!this.observers[type]) {
      this.observers[type] = [];
    }
    console.log("addEventLisener", { type }, { callback });
    this.observers[type].push(callback);
  }

  /**
   * イベントリスナの削除
   * @param type イベントタイプ
   * @param callback
   */
  removeObserver(type: string, callback: Function): void {
    for (let i = 0; i < this.observers[type]; i++) {
      if (this.observers[type][i] === callback) {
        this.observers[type].splice(i, 1);
      }
    }
  }

  /**
   * イベントリスナのクリア
   */
  clearObserver(): void {
    this.observers = {};
  }

  /**
   * ディスパッチイベントの実行
   * @param event 引数{type: イベントタイプ, [args]: 任意}
   */

  dispatchEvent(event: { type: string; [key: string]: number | string }): void {
    // console.log(this.listeners[event.type][0]());

    if (this.observers[event.type]) {
      this.observers[event.type].forEach((observer: Function): void => {
        observer();
      });
    }
  }
}
