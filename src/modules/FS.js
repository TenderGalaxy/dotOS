export default {
	info: {
		name: 'FS',
		type: 'worldcode', // unfortunately, async library is os-scoped, so we can't use it here
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/FS.js',
		requirements: [],
	},
	onLoad() {
		class fnvHash {
			offset = 0x811c9dc5
			prime = 0x01000193
			max = (1 << 18) - 1
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
				let t = 2166136261
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
				name = {hash: this.hash.hashStr(name), name: name}
				if(l.every(v => v.hash != name.hash)){
					l.push(name)
					this._setFile(dir, JSON.stringify(l))
				}
			}
			_removeFileFromDir(dir, name) {
				name = {hash: this.hash.hashStr(name), name: name}
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
				this._addFileToDir(this.hash.hashStr(parent), name)
				let ha = this.hash.hashStr(parent + '/' + name)
				api.setBlock(...ha, 0, 'Chest')
				this._setFile(ha, contents)
			}
			/**
			 * Delete a file
			 * @memberof FS
			 * @param {string} parent - Parent directory
			 * @param {string} name - Individual file name
			 */
			deleteFile(parent, name){
				let fullName = this.hash.hashStr(parent + '/' + name)
				let t = this._getFileHeader(fullName)
				this._removeFileFromDir(this.hash.hashStr(parent),name)
				for(let i = 0; i < t + 1; i++){
					api.setBlockData(...fullName, this.disk, i, {
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
		globalThis.FS = new disk(69831, 'FS')
	},
	callbacks: {

	}
}