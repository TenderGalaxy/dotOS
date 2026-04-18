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
			constructor(func, name, ...args) {
				this.task = func(...args)
				this.idle = false
				this.name = name || 'thread'
				this.endValue = 0
				TS.scheduleFirstUnused(th => {th.tick()}, this)
			}
			tick() {
				let value = dotError.tryFunction(() => this.task.next()) || {done: false}
				if(dotError.hasError()){
					api.log(`${this.name}: Error!`)
					dotError.log()
				}
				if(value.done){
					this.idle = true
					this.endValue = value.value
				} else {
					TS.scheduleFirstUnused(th => {th.tick()}, this)
				}
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
		/**
		 * @namespace ThreadLibs
		 */
		globalThis.thl = {
			loaded: [], // Loaded Libraries
			speak: {}, // Speaking channels
			maxSpeakRecall: 10, // Maximum recall for speaking channels

			// Sleep API
			/**
			 * Sleep for a given number of 50-millisecond ticks.
			 * @memberof ThreadLibs
			 * @param {number} ms - Ticks
			 */
			*sleep(ms) {
				let targ = TS.tick + ms
				while(TS.tick < targ){
					yield
				}
			},
			/**
			 * Sleep for a given number of milliseconds (With Date.now())
			 * More accurate for timekeeping than thl.sleep
			 * @memberof ThreadLibs
			 * @param {number} ms - Milliseconds
			 */
			*sleepDate(ms) {
				let targ = Date.now() + ms
				while (Date.now() < targ) {
					yield
				}
			},
			/**
			 * Wait until a condition is met.
			 * @memberof ThreadLibs
			 * @param {function} condition - Checker (e.g () => thread2.isIdle())
			 */
			*waitUntil(condition) {
				while (!(condition())) {
					yield
				}
			},

			// Module API
			/**
			 * Wait until a module is loaded
			 * @memberof ThreadLibs
			 * @param {string} module - Module Name
			 */
			*require(module){
				while(!thl.loaded.includes(module)){
					yield
				}
			},
			/**
			 * Mark your module as loaded
			 * @memberof ThreadLibs
			 * @param {string} module - Module Name
			 */
			send(module){
				thl.loaded.push(module)
			},

			// Channel API
	
			/**
			 * Create a channel for communications
			 * @param {number} msp Maximum Speak Recall (Lower saves on memory) (Defaults to thl.maxSpeakRecall)
			 * @returns {number} Channel number
			 * @memberof ThreadLibs
			 */
			makeChannel(msp=thl.maxSpeakRecall){
				let v = Math.floor(Math.random() * (1 << 48))
				thl.speak[v] = {msp: msp, conn: []}
				return v
			},
			/**
			 * Post a message onto a channel.
			 * @param {number} chan Channel to communicate on
			 * @param {any} msg Message to post
			 * @param {string} author Defaults to 'thread'
			 * @memberof ThreadLibs
			 */
			post(chan, msg, author='Thread'){
				thl.speak[chan].con.push({author: author, msg: msg})
				if(thl.speak[chan].length > msp){
					thl.speak[chan].shift()
				}
			},
			/**
			 * Get a message from a channel.
			 * @param {number} chan 
			 * @returns {array} All current messages
			 * @memberof ThreadLibs
			 */
			getPosts(chan){
				return thl.speak[chan].con
			},
			/**
			 * Pop a message from a channel.
			 * @param {number} chan 
			 * @returns {any} Result
			 * @memberof ThreadLibs
			 */
			popPost(chan){
				return thl.speak[chan].con.pop()
			},
			/**
			 * Delete a channel
			 * @param {number} channel 
			 * @memberof ThreadLibs
			 */
			deleteChannel(channel){
				delete thl.speak[channel]
			}
		}
	},
	callbacks: {
	}
}