export default {
	info: {
		name: 'CFF',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/fenlAtSchool/dotOS/blob/main/src/modules/CFF.js',
		requirements: ['jsonLoad', 'FS-async', 'async']
	},
	onLoad() {
		globalThis.execFile = function*(f){
			const file = yield* FS.getFileAsync(f)
			const extension = f.split('.').at(-1)
			const data = {fName: f, fContents: file}
			const form = FS.getFileAsync(`src/data/dotOS-ext-${extension}.js`)
			return (yield* (new Function*('data', form))(data))
		}
	},
	callbacks: {
	}
}