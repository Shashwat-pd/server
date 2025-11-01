export class AsyncQueue<T> implements AsyncIterable<T> {

  private items: T[] = [];
  private resolvers: Array<(v: IteratorResult<T>) => void> = [];

  private done = false;

  close() {
    this.done = true;
    while (this.resolvers.length) {
      const resolver = this.resolvers.shift();
      resolver!({ value: undefined, done: true });
    }
    return;
  }

  push(v: T) {
    if (this.resolvers.length) {
      const resolver = this.resolvers.shift();
      resolver!({ value: v, done: false });
    } else {
      this.items.push(v);
    }
  }
  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: () => {
        if (this.items.length) {
          const value = this.items.shift()!;
          return Promise.resolve({ value, done: false });
        }
        if (this.done) {
          return Promise.resolve({ value: undefined, done: true });
        }
        return new Promise<IteratorResult<T>>((resolve) =>
          this.resolvers.push(resolve),
        );
      },
    };
  }
}
