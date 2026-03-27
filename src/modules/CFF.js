export default {
	info: {
		name: 'CFF',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/fenlAtSchool/dotOS/blob/main/src/modules/CFF.js',
		requirements: ['jsonLoad', 'FS-async', 'async']
	},
	onLoad() {
		globalThis.CFF = class {
			constructor() { }
			setModule() { }
		}
	},
	callbacks: {
	}
}