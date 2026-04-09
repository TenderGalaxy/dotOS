export default {
	/* osTS */
	/* The DotOS Task Scheduler */
	info: {
		name: 'TS',
		type: 'worldcode',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/osTS.js',
		requirements: []
	},
	onLoad() {
		/**
		 * @namespace TS
		 */
		globalThis.TS = {
			work: {},
			stack: [],
			prioritizeUnfinishedWork: true,
			cyclesPerTick: 1,
			lastUsedTick: 0,
			tick: 0,
			makeAction(action, ...args) {
				return { f: action, a: args }
			},
			parseAction(action) {
				dotError.tryFunction(action.f, ...action.a)
				if (dotError.hasError()) {
					dotError.log()
				}
			},
			/**
			 * Schedule a function to execute at the first unused tick
			 * @memberof TS
			 * @param {function} action - Function
			 * @param  {...any} args - Arguments
			 */
			scheduleFirstUnused(action, ...args) {
				TS.lastUsedTick = Math.max(TS.lastUsedTick, TS.tick) + 1
				TS.work[TS.lastUsedTick] = [TS.makeAction(action, ...args)]
				return TS.lastUsedTick
			},
			/**
			 * Schedule a function to happen next tick
			 * @memberof TS
			 * @param {function} action - Function
			 * @param  {...any} args - Arguments
			 */
			scheduleNextTick(action, ...args) {
				if (TS.work?.[TS.tick + 1]) {
					TS.work[TS.tick + 1].push(TS.makeAction(action, ...args))
				} else {
					TS.work[TS.tick + 1] = [TS.makeAction(action, ...args)]
				}
			},
			/**
			 * Set a function to happen n ticks later.
			 * @memberof TS
			 * @param {function} action - Function
			 * @param {number} delay - Delay in 50-millisecond ticks
			 * @param  {...any} args - Arguments
			 */
			setTimeout(action, delay, ...args) {
				if (delay < 1) {
					throw new ValueError('TS.setTimeout recieved a negative delay value.')
				}
				TS.lastUsedTick = Math.max(TS.lastUsedTick, TS.tick + delay)
				if (TS.work?.[TS.tick + delay]) {
					TS.work[TS.tick + delay].push(TS.makeAction(action, ...args))
				} else {
					TS.work[TS.tick + delay] = [TS.makeAction(action, ...args)]
				}
			},
			cancelSpecific(delay, fname) {
				let t = []
				for (let i of TS.work[TS.tick + delay]) {
					if (i.f.name !== fname) {
						t.push(i)
					}
				}
				TS.work[TS.tick + delay] = t
			}
		}
	},
	callbacks: {
		tick() {
			TS.tick++
			if (!TS.work?.[TS.tick]) return
			if (TS.prioritizeUnfinishedWork) {
				TS.stack = [...TS.stack, ...TS.work[TS.tick]]
			} else {
				TS.stack = [...TS.work[TS.tick], ...TS.stack]
			}
			delete TS.work[TS.tick]
			for(let i = 0; i < Math.min(TS.stack.length, TS.cyclesPerTick); i++) {
				eval()
				TS.parseAction(TS.stack.shift())
			}
		}
	}
}