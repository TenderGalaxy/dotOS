{
  info: {
    name: 'bigArray',
    type: 'os',
    version: '1.0.0',
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/bigArray.js',
    requirements: []
  },
  callbacks: {
    onLoad(){
      // THIS CODE WAS WRITTEN BY GLITCHHUNTER AND REUSED
      globalThis.bigArray = class {
        #pool = (0, eval)("[" + "[],".repeat(5220) + "]")
        #lastIndex;
      
        constructor(length = 0) {
          this.#lastIndex = length - 1;
        }
      
        get length() {
          return this.#lastIndex + 1;
        }
      
        get(index) {
          return this.#pool[index % this.#pool.length][index];
        }
      
        set(index, value) {
          this.#pool[index % this.#pool.length][index] = value;
          if (index > this.#lastIndex) this.#lastIndex = index;
        }
      }
    }
    //
  }
}
