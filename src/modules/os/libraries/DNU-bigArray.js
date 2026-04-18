export default {
	info: {
		name: 'bigArray',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/bigArray.js',
		requirements: []
	},
	onLoad() {
		// THIS CODE WAS WRITTEN BY NICKNAME AND REUSED
		globalThis.BigArray = class {
			poolSize = 100
			pool = (0, eval)("[" + "[],".repeat(this.poolSize) + "]")
			lastIndex;

			constructor(arr) {
				this.lastIndex = arr.length - 1;
				for(let i = 0; i < this.poolSize; i++){
					for(let j = i; j < arr.length; j += this.poolSize){
						this.pool[i][j] = arr[j]
					}
				}
			}

			get length() {
				return this.lastIndex + 1;
			}

			get(index) {
				return this.pool[index % this.poolSize][index];
			}

			set(index, value) {
				this.pool[index % this.poolSize][index] = value;
				if (index > this.lastIndex) this.lastIndex = index;
			}
		}
	},
	callbacks: {
	}
}