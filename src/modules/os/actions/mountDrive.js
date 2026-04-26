export default {
	info: {
		name: 'data',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotos/blob/main/src/modules/mountDrive.js',
		requirements: ['FS-async', 'async']
	},
	onLoad() {
		globalThis.driveMounting = { toUpload: toUpload }
		globalThis.toUpload = null
		globalThis.driveMounting.thread = new Thread(function* () {
			let f = FS.hash.hashStr('dotOS')
			for (let i = 0; i < 3; i++) {
				api.getBlockId(...f, 0)
				yield
			}
			try {
				FS._getFile(f)
			} catch {
				api.log('Drive not found, making new drive.')
				FS._setFile(f, '[]')
			}
			yield* FS.newFileAsync('dotOS', 'data', '[]')
			api.log('Drive mounted!')
			for(let i of driveMounting.toUpload){
				console.log(`Setting ${i.dir}/${i.name}`)
				yield* FS.newFileAsync(i.dir, i.name, i.contents)
			}
			api.log('Finished loading files!')
			thl.send('drive')
			delete globalThis.driveMounting
		}(), 'driveMounting.thread')
	},
	callbacks: {
	}
}