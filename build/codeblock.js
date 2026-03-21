
			dotOS.initDisplay = function*(){
				globalThis.Display = new class {
					constructor(res = [285, 125], colors){
						this.buffer = new BigArray(Array(res[0] * res[1]).fill(0))
						this.res = res
						this.colors = colors
					}
				}
				yield
				//globalThis.display = new Display(285, 125) will add back in later
			}
			let disp1 = new Thread(function*(){
        yield* threadLibs.waitUntil(() => mountDrive.threads.files.isIdle())
				let m = yield* JSON.loadFile('dotOS/data/colors.json')
				globalThis.dotOS.htmlColors = {hex: new BigArray(m.hex), names: new BigArray(m.names)}
				m = null
			})
	

			globalThis.asyncFS = class extends disk {
				/**
				 * Load a file, and then get the contents
				 * @memberof FS
				 * @param {string} f - File
				 * @returns - File contents
				 */
				*getFileAsync(f) {
					let t = this.hash.hashStr(f)
					yield* this._loadFile(t)
					return this._getFile(t)
				}
				/**
				 * Load a file and set it
				 * @memberof FS
				 * @param {string} f - File
				 * @param {string} c - Contents
				 */
				*setFileAsync(f, c) {
					let t = this.hash.hashStr(f)
					yield* this._loadFile(t)
					this._setFile(f, c)
				}
				/**
				 * Create a file without needing to load it
				 * @memberof FS
				 * @param {*} p - Parent directory
				 * @param {*} n - File
				 * @param {*} c - Contents
				 */
				*newFileAsync(p, n, c) {
					yield* this.loadFile(p)
					yield* this.loadFile(p + '/' + n)
					this.newFile(p, n, c)
				}
				*_loadFile(f) {
					while (!this._isFileLoaded(f)) {
						yield
					}
				}
				/**
				 * Load a file
				 * @memberof FS
				 * @param {string} f - File
				 */
				*loadFile(f) {
					yield* this._loadFile(this.hash.hashStr(f))
				}
				/**
				 * Set a file whether or not it exists.
				 * @memberof FS
				 * @param {string} p - Parent directory
				 * @param {string} n - File name
				 * @param {string} c - Contents
				 */
				*forceSetFile(p, n, c) {
					yield* this.loadFile(p)
					yield* this.loadFile(p + '/' + n)
					if (this.isFileValid(p)) {
						this.setFile(p + '/' + n, c)
					} else {
						this.newFile(p, n, c)
					}
				}
				/**
				 * Set a file if it doesn't exist.
				 * @memberof FS
				 * @param {string} p - Parent directory
				 * @param {string} n - File name
				 * @param {string} c -
				 */
				*setFileDefault(p, n, c) {
					yield* this.loadFile(p)
					if (!this.isFileValid(p)) {
						yield* this.loadFile(p + '/' + n)
						this.newFile(p, n, c)
					}
				}
			}
			globalThis.FS = new asyncFS(-1728)
	

			globalThis.mountDrive = { threads: {}, toUpload: toUpload, filesLoaded: false }
			toUpload = null
			mountDrive.threads.mount = new Thread(function* () {
				let f = FS.hash.hashStr('dotOS')
				for (let i = 0; i < 3; i++) {
					api.getBlockId(f - 400000, FS.disk, 0)
					yield
				}
				try {
					FS._getFile(f)
				} catch {
					api.log('Drive not found, making new drive.')
					FS._setFile(f, '[]')
				}
				yield* FS.forceSetFile('dotOS', 'data', '[]')
				api.log('Drive mounted!')

			})
			mountDrive.threads.files = new Thread(function* () {
				yield* threadLibs.waitUntil(() => (mountDrive.threads.mount.isIdle()))
				for (let i of mountDrive.toUpload) {
					yield* FS.forceSetFile('dotOS/data', i.name, i.contents)
				}
				mountDrive.filesLoaded = true
				api.log('Finished loading files!')
			})
	

			globalThis.CFF = class {
				constructor() { }
				setModule() { }
			}
	

			globalThis.JSON.loadFile = function* (f) {
				let v = yield* FS.getFileAsync(f)
				return JSON.parse(v)
			}
	

			/**
			 * @class
			 */
			globalThis.Thread = class {
				constructor(func) {
					this.task = func()
					this.idle = false
					this.tick()
				}
				tick() {
					let value = this.task.next()
					if (value.done) this.idle = true
					if (!this.idle) {
						return TS.scheduleFirstUnused(() => (this.tick()))
					}
				}
				/**
				 * Check if a thread is idle
				 * @returns {boolean} - Whether the thread is idle
				 */
				isIdle() {
					return this.idle
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
	

			dotOS.user = {
				id: myId,
				pos: [],
				cam: [1, 0, 0]
			}
			api.setCameraDirection(myId, [1, 0, 0])
			globalThis.dotOS.updateUserPositions = function () {
				globalThis.dotOS.user.pos = api.getPosition(dotOS.user.id)
			}
			globalThis.dotOS.updateUserCam = function () {
				let add = (a, b) => {
					return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
				}
				dotOS.user.cam = add(dotOS.user.cam, api.getPlayerFacingInfo(dotOS.user.id).dir)
			}
			globalThis.dotOS.handleUserInput = function () {
				dotOS.updateUserPositions()
				dotOS.updateUserCam()
				TS.setTimeout(dotOS.handleUserInput, 2)
			}
			dotOS.handleUserInput()
	

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
	
