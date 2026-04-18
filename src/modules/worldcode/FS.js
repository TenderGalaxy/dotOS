export default {
	info: {
		name: 'FS',
		type: 'worldcode', // unfortunately, async library is os-scoped, so we can't use it here
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/FS.js',
		requirements: [],
	},
	onLoad() {
		class Hash {
			constructor(seed){
				this.seed = seed
			}
			hash(arr) {
				/*
				let v = this.offset >>> 0
				for (let i of arr) {
					v ^= i
					v = Math.imul(v, this.prime)
					v &= this.max
				}
				return v
				*/
				let t = this.seed
				for(let i of arr){
					t = (t + i) >>> 0
					t = (t << 4) ^ (t << 2) ^ (t << 1) ^ t
				}
				return [t & 65535, t >>> 16];
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
		/**
		 * @namespace FS
		 */
		globalThis.disk = class {
			constructor(seed) {
				this.hash = new Hash(seed)
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
			getFSlot(f, chapter, idx) {
				return api.getStandardChestItemSlot([...f, chapter], idx)?.attributes?.customDescription
			}
			getFChapter(f, chapter) {
				return Array.from(api.getStandardChestItems([...f, chapter]), function (a) {
					let v = a?.attributes?.customDescription
					return v || ''
				})
			}
			setFSlot(f, chapter, idx, n) {
				api.setStandardChestItemSlot([...f, chapter], idx, 'Net', 1, undefined, { customDescription: n })
			}
			_isPlaceLoaded(f, chapter) {
				return (api.getBlockId(...f, chapter) !== 1)
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
				if(typeof contents != 'string'){
					throw new TypeError(`${file} is being set to ${contents?.type || typeof contents}!`)
				}
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
					}, (i >> 4) + 1, chunks[i], i, file, this.setFSlot, this.disk)
				}
				return (len >> 4) + 1
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
			addFileToDir(dir, name) {
				let fullName = dir + '/' + name
				let l = JSON.parse(this.getFile(dir))
				name = {hash: this.hash.hashStr(fullName), name: name, fullName: fullName}
				/*if(l.every(v => v.hash != name.hash)){
					l.push(name)
					this._setFile(dir, JSON.stringify(l))
				}*/
				l.push(name)
				this.setFile(dir, JSON.stringify(l))
			}
			removeFileFromDir(dir, name) {
				let fullName = dir + '/' + name
				name = {hash: this.hash.hashStr(fullName), name: name, fullName: fullName}
				let l = JSON.parse(this.getFile(dir))
				l.splice(l.indexOf(name), 1)
				this.setFile(dir, JSON.stringify(l))
			}
			/**
			 * Create a new file as parent/name
			 * @memberof FS
			 * @param {string} parent - Parent directory of the file
			 * @param {string} name - Individual file name (e.g colors.json)
			 * @param {string} contents - File contents
			 */
			newFile(parent, name, contents) {
				this.addFileToDir(parent, name)
				return this.setFile(parent + '/' + name, contents)
			}
			/**
			 * Delete a file
			 * @memberof FS
			 * @param {string} parent - Parent directory
			 * @param {string} name - Individual file name
			 */
			deleteFile(parent, name){
				let fullName = parent + '/' + name
				let t = this.getFileHeader(fullName).len
				this.removeFileFromDir(parent,name)
				fullName = this.hash.hashStr(fullName)
				for(let i = 0; i < t + 1; i++){
					api.setBlockData([...fullName, i], {
						persisted: {
							chestStr: '[]'
						}
					})
				}
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
		globalThis.FS = new disk(2, 'FS')
	},
	callbacks: {

	}
}