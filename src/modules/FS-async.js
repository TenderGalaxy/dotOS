obj = {
	info: {
		name: 'FS-async',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/FS-async.js',
		requirements: ['async']
	},
	callbacks: {
		onLoad() {
			globalThis.asyncFS = class extends disk {
				/**
				 * Load a file, and then get the contents
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
				 * @param {string} f - File
				 */
				*loadFile(f) {
					yield* this._loadFile(this.hash.hashStr(f))
				}
				/**
				 * Set a file whether or not it exists.
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
		}
	}
}
obj