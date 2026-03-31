export default {
	/*
  Sample code:
  
  a = new Thread(function(){
	api.log('Hi!')
	yield* threadLibs.sleep(20)
	api.log('Bye')
  })
  */
	info: {
		name: 'async',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/async.js',
		requirements: []
	},
	onLoad() {
		/**
		 * @class
		 */
		globalThis.Thread = class {
			constructor(func, name) {
				this.task = func()
				this.idle = false
				this.name = name || 'thread'
				TS.scheduleFirstUnused(() => (this.tick()))
			}
			tick() {
				if (!this.idle) {
					TS.scheduleFirstUnused(() => (this.tick()))
				}
				let value = dotError.tryFunction(() => this.task.next()) || {done: false}
				if(dotError.hasError()){
					api.log(`${this.name}: Error!`)
					dotError.log()
				}
				if (value.done) this.idle = true
			}
			/**
			 * Check if a thread is idle
			 * @returns {boolean} - Whether the thread is idle
			 */
			isIdle() {
				return this.idle || false
			}
			/**
			 * Pause/unpause a thread
			 * @param {boolean} v = True to pause the thread, False to cancel
			 */
			setWork(v) {
				this.idle = v
				if (!this.idle) {
					TS.scheduleFirstUnused(() => (this.tick()))
				}
			}
			/**
			 * Set a task to the thread
			 * @param {function} f - Task Function
			 */
			setTask(f) {
				this.task = f()
				this.idle = false
				TS.scheduleFirstUnused(() => (this.tick()))
			}
		}
		globalThis.threadLibs = {
			/**
			 * Sleep for a given number of 50-millisecond ticks.
			 * @param {number} ms - Ticks
			 */
			*sleep(ms) {
				yield* threadLibs.sleep_internal(TS.tick + ms)
			},
			*sleep_internal(del) {
				while (TS.tick < del) {
					yield
				}
			},
			/**
			 * Wait until a condition is met.
			 * @param {function} condition - Checker (e.g () => thread2.isIdle())
			 */
			*waitUntil(condition) {
				while (!(condition())) {
					yield
				}
			}
		}
	},
	callbacks: {
	}
}