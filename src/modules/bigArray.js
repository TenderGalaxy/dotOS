obj = {
	info: {
		name: 'bigArray',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/bigArray.js',
		requirements: []
	},
	callbacks: {
		onLoad() {
			// THIS CODE WAS WRITTEN BY NICKNAME AND REUSED
			globalThis.BigArray = class {
				#pool = (0, eval)("[" + "[],".repeat(5220) + "]")
				#lastIndex;

				constructor(arr) {
					this.#lastIndex = arr.length - 1;
					for(let i = 0; i < Math.min(5220, arr.length); i++){
						let c = 0
						for(let j = i; j < length; j += 5220){
							this.#pool[i][c] = arr[j]
							c++
						}
					}
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
obj