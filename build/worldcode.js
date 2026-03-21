
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
					TS.lastUsedTick = Math.max(TS.lastUsedTick, TS.tick + 1) + 1
					TS.work[TS.lastUsedTick] = [TS.makeAction(action, ...args)]
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
				 * @param {*} action - Function
				 * @param {*} delay - Delay in 50-millisecond ticks
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
	dotOS.callbacks.tick.push(function() {
			TS.tick++
			if (!TS.work?.[TS.tick]) return
			if (TS.prioritizeUnfinishedWork) {
				TS.stack = [...TS.stack, ...TS.work[TS.tick]]
			} else {
				TS.stack = [...TS.work[TS.tick], ...TS.stack]
			}
			delete TS.work[TS.tick]
			while (TS.stack.length > 0) {
				eval()
				TS.parseAction(TS.stack.shift())
			}
		})

			globalThis.callbacks = ["tick", "onClose", "onPlayerJoin", "onPlayerLeave", "onPlayerJump", "onRespawnRequest", "playerCommand", "onPlayerChat", "onPlayerChangeBlock", "onPlayerDropItem", "onPlayerPickedUpItem", "onPlayerSelectInventorySlot", "onBlockStand", "onPlayerAttemptCraft", "onPlayerCraft", "onPlayerAttemptOpenChest", "onPlayerOpenedChest", "onPlayerMoveItemOutOfInventory", "onPlayerMoveInvenItem", "onPlayerMoveItemIntoIdxs", "onPlayerSwapInvenSlots", "onPlayerMoveInvenItemWithAmt", "onPlayerAttemptAltAction", "onPlayerAltAction", "onPlayerClick", "onClientOptionUpdated", "onMobSettingUpdated", "onInventoryUpdated", "onChestUpdated", "onWorldChangeBlock", "onCreateBloxdMeshEntity", "onEntityCollision", "onPlayerAttemptSpawnMob", "onWorldAttemptSpawnMob", "onPlayerSpawnMob", "onWorldSpawnMob", "onWorldAttemptDespawnMob", "onMobDespawned", "onPlayerAttack", "onPlayerDamagingOtherPlayer", "onPlayerDamagingMob", "onMobDamagingPlayer", "onMobDamagingOtherMob", "onAttemptKillPlayer", "onPlayerKilledOtherPlayer", "onMobKilledPlayer", "onPlayerKilledMob", "onMobKilledOtherMob", "onPlayerPotionEffect", "onPlayerDamagingMeshEntity", "onPlayerBreakMeshEntity", "onPlayerUsedThrowable", "onPlayerThrowableHitTerrain", "onTouchscreenActionButton", "onTaskClaimed", "onChunkLoaded", "onPlayerRequestChunk", "onItemDropCreated", "onPlayerStartChargingItem", "onPlayerFinishChargingItem", "onPlayerFinishQTE", "doPeriodicSave"]
			dotOS.module ??= {}
			dotOS.callbacks ??= {}
			/**
			 * @namespace dotModule
			 */
			globalThis.dotModule = {
				callbacks: [...callbacks],
				refreshOnLoad: true,
				/**
				 * Load a file as a module.
				 * @memberof dotModule
				 * @param {string} name - File name 
				 */
				*load(name) {
					let t = yield* FS.getFileAsync(name)
					let temp = dotError.try(t)()
					if (dotError.hasError()) {
						dotError.log()
						throw new Error(`moduleLoader: Error loading module ${name}`)
					}
					dotOS.module[temp.info.name] = temp
					temp = null
					if (dotModule.refreshOnLoad) {
						dotModule.refreshModules()
					}
				},
				/**
				 * @memberof dotModule
				 * Delete every callback.
				 */
				resetAllCallbacks() {
					for (let i of dotModule.callbacks) {
						dotOS.callbacks[i] = []
					}
				},
				/**
				 * @memberof dotModule
				 * Refresh all modules and create corresponding callbacks.
				 */
				refreshModules() {
					dotModule.resetAllCallbacks()
					for (let [i, j] of Object.entries(dotOS.module)) {
						for (let [k, l] of Object.entries(j.callbacks)) {
							if (l.name == 'onLoad') {
								l()
							} else {
								dotOS.callbacks[i].push(() => l())
							}
						}
					}
				},
				setCallbacks() {
					for (let name of dotModule.callbacks) {
						globalThis[name] = function (...args) {
							t = undefined
							for (let i of dotOS.callbacks[name]) {
								t = dotError.tryFunction(i, ...args)
								if (dotError.hasError()) {
									dotError.log()
								}
							}
							return t
						}
					}
				}
			}
			dotModule.resetAllCallbacks()
			dotModule.setCallbacks()
			callbacks = null
	
			class dotErr {
				constructor() { }
				try(code, ...args) {
					this.point = ''
					this.src = code.split(/[\n;]+/)
					try {
						return new Function(code)(...args)
					} catch (e) {
						this.e = e
						this.point = +e.stack.split(' ')[6].slice(9).replace(')\n', '') + 1
					}
				}
				tryFunction(code, ...args) {
					this.point = ''
					this.src = code.toString().split(/[\n;]+/)
					try {
						return (code)(...args)
					} catch (e) {
						this.e = e
						this.point = +e.stack.split(' ')[6].slice(9).replace(')\n', '') + 1
					}
				}
				log() {
					if (this.point === '') {
						api.broadcastMessage('No Errors Found!', { color: 'red' })
						return
					}
					let m = this.e.stack.split('\n')
					m = Array.from(m, (x) => x.slice(4)).slice(0, m.length - 4)
					api.broadcastMessage([{ str: `Line ${this.point}: ${this.e.message}\n`, style: { color: 'orange' } },
					{ str: `>| ${this.src[this.point]}\n`, style: { color: 'lightblue' } },
					{ str: m.join('\n'), style: { color: 'orange' } }])
				}
				hasError() {
					return this.point !== ''
				}
			}
			globalThis.dotError = new dotErr()
	
			class fnvHash {
				offset = 0x811c9dc5
				prime = 0x01000193
				max = (1 << 18) - 1
				hash(arr) {
					let v = this.offset >>> 0
					for (let i of arr) {
						v ^= i
						v = Math.imul(v, this.prime)
						v &= this.max
					}
					return v
				}
				strToArr(str) {
					let ans = new Uint8Array(str.length * 2), v
					for (let i = 0; i < str.length; i++) {
						v = str[i].codePointAt()
						ans[2 * i] = v >> 8
						ans[2 * i + 1] = v & 255
					}
					return ans
				}
				hashStr(str) {
					return this.hash(this.strToArr(str))
				}
			}
			/*globalThis.disk = class {
			  constructor(disk){
				this.disk = disk
				this.fileNameCache = {}
			  }
			  getFile(f){
				if((typeof f) !== 'number'){
				  f = this.followPath(f)
				}
				let len = this.getFileHeader(f).length
				let file = ''
				for(i = 1; i <= len; i++){
				  for(let j of api.getStandardChestItems([idx, this.disk, 0])){
					file.push(j.attributes.customDescription)
				  }
				}
				return JSON.parse(file)
			  }
			  getFileHeader(idx){
				return JSON.parse(api.getStandardChestItemSlot([idx, this.disk, 0], 0))
			  }
			  setFile(file, contents){
				if((typeof file) !== 'number'){
				  file = this.followPath(file)
				}
				let descs = JSON.stringify(contents.contents).match(/[^]{1,450}/g)
				let chunks = []
				for(let i = 0; i < descs.length; i += 36){
				  chunks.push(descs.slice(i, i + 36))
				}
				let len = chunks.length
				api.setStandardChestItemSlot([file, this.disk, 0], 0, 'Net', 1, undefined, JSON.stringify({
				  name: contents.name,
				  extension: contents.extension,
				  length: len
				}))
				for(let i = 1; i <= len; i++){
				  TS.setTimeout(function(){
					let f = chunks[i]
					for(let j = 0; j < f.length; j++){
					  api.setStandardChestItemSlot([file, this.disk, i], j, 'Net', 1, undefined, {
						customDescription: chunks[i-1][j]
					  })
					}
				  }, i)
				}
			  }
			  followPath(file, start = 0){
				if((typeof x) === 'number'){
				  return x
				}
				if((typeof x) === 'string'){
				  x = x.split('/')
				}
				if(file in this.fileNameCache){
				  return this.fileNameCache[file]
				}
				let filesInDir;
				for(let name of x){
				   start = FS.getFile(name).contents
				   filesInDir = start.map(m => FS.getFileHeader(m)).map(m => m.name + m.extension)
				   if(!j.includes(name)){
					throw new Error(`InvalidFilePathError: ${name} of ${file} does not exist.`)
				  }
				  start = start[filesInDir.indexOf(name)]
				}
				this.fileNameCache[file] = f
				return f
			  }
			  setFileHeader(file, header){
				if((typeof file) == 'string'){
				  file = FS.followPath(file)
				}
				api.setStandardChestItemSlot([file, FS.disk, 0], 0, 'Net', 1, undefined, {
				  customDescription: JSON.stringify(header)
				})
			  }
			}*/
			/**
			 * @namespace FS
			 */
			globalThis.disk = class {
				/*
				Contents of a directory:
				{
				  location: ['System/modules']
				  children: ['async.js', 'FS.js', ...etc]
				}
				*/
				/*
				Contents of a file:
				Header: {
				  len: 5
				}
				*/
				constructor(disk) {
					this.disk = disk
					this.hash = new fnvHash()
				}
				_getFile(hex) {
					let head = this._getFileHeader(hex)
					let out = ''
					for (let i = 1; i <= head.len; i++) {
						out += this.getFChapter(hex, i).reduce((a, b) => (a + b), '')
					}
					return out
				}
				_getFileHeader(hex) {
					let m = this.getFSlot(hex, 0, 0)
					return m ? JSON.parse(m) : undefined
				}
				getFSlot(f, chapter, idx, disk = this.disk) {
					return api.getStandardChestItemSlot([f - 400000, disk, chapter], idx)?.attributes?.customDescription
				}
				getFChapter(f, chapter, disk = this.disk) {
					return Array.from(api.getStandardChestItems([f - 400000, disk, chapter]), function (a) {
						let v = a?.attributes?.customDescription
						return v ? v : ''
					})
				}
				setFSlot(f, chapter, idx, n, disk = this.disk) {
					api.setStandardChestItemSlot([f - 400000, disk, chapter], idx, 'Net', 1, undefined, { customDescription: n })
				}
				_isPlaceLoaded(f, chapter, disk = this.disk) {
					return (api.getBlockId(f - 400000, disk, chapter) !== 1)
				}
				/**
				 * 
				 * @param {string} f - The file name
				 * @memberof FS
				 * @returns {{len: number}|undefined} File Header
				 */
				getFileHeader(f) {
					return this._getFileHeader(this.hash.hashStr(f))
				}
				/**
				 * Get a file
				 * @param {string} f - The file name 
				 * @memberof FS
				 * @returns {string} File
				 */
				getFile(f) {
					return this._getFile(this.hash.hashStr(f))
				}
				_setFile(file, contents) {
					let descs = contents.match(/[^]{1,450}/g)
					let chunks = []
					for (let i = 0; i < descs.length; i += 36) {
						chunks.push(descs.slice(i, i + 36))
					}
					let len = chunks.length
					this.setFSlot(file, 0, 0, JSON.stringify({
						len: len
					}))
					for (let i = 0; i < len; i++) {
						TS.setTimeout((f, i, file, func, disk) => {
							for (let j = 0; j < f.length; j++) {
								func(file, i + 1, j, f[j], disk)
							}
						}, i + 1, chunks[i], i, file, this.setFSlot, this.disk)
					}
					return len + 1
				}
				/**
				 * Set a file with contents
				 * @memberof FS
				 * @param {string} f - File name
				 * @param {string} contents - Contents of the file
				 */
				setFile(f, contents) {
					this._setFile(this.hash.hashStr(f), contents)
				}
				_addFileToDir(dir, name) {
					let l = JSON.parse(this._getFile(dir))
					l[l.length] = name
					this._setFile(dir, JSON.stringify(l))
				}
				_removeFileFromDir(dir, name) {
					let l = JSON.parse(this._getFile(dir))
					l.splice(l.indexOf(name), 1)
					this._setFile(dir, JSON.stringify(l))
				}
				/**
				 * Create a new file as parent/name
				 * @memberof FS
				 * @param {string} parent - Parent directory of the file
				 * @param {string} name - Individual file name (e.g colors.json)
				 * @param {string} contents - File contents
				 */
				newFile(parent, name, contents) {
					this._addFileToDir(this.hash.hashStr(parent), this.hash.hashStr(name))
					let ha = this.hash.hashStr(parent + '/' + name)
					api.setBlock(ha - 400000, this.disk, 0, 'Chest')
					this._setFile(ha, contents)
				}
				_isFileLoaded(f) {
					if (!this._isPlaceLoaded(f, 0)) {
						return false
					}
					let t = this._getFileHeader(f)
					if (!t) {
						return true
					}
					t = t.len >> 5
					for (let i = 1; i < t + 1; i++) {
						if (!this._isPlaceLoaded(f, i << 5)) {
							return false
						}
					}
					return true
				}
				/**
				 * Check if a file is loaded.
				 * @memberof FS
				 * @param {string} f - Name of the file
				 * @returns {boolean} Whether the file is loaded
				 */
				isFileLoaded(f) {
					return this._isFileLoaded(this.hash.hashStr(f))
				}
				/**
				 * Check if a file exists, given the header is loaded.
				 * @memberof FS
				 * @param {string} f - Name of the file
				 * @returns {boolean} Whether the file exists
				 */
				isFileValid(f) {
					return this.getFileHeader(f) ? true : false
				}
			}
			globalThis.FS = new disk(-1728, 'FS')
	