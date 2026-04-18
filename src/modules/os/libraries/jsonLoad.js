export default {
	info: {
		name: 'jsonLoad',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/jsonLoad.js',
		requirements: ['FS-async', 'utils']
	},
	onLoad() {
		/**
		 * Load a JSON file
		 * @returns {Object|Array} - The parsed JSON file
		 */
		globalThis.loadJSONFile = function* (f) {
			let v = yield* FS.getFileAsync(f)
			return Parse(v)
		}
	},
	callbacks: {
	}
}