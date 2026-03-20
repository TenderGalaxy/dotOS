obj = {
	info: {
		name: 'data',
		type: 'os',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotos/blob/main/src/modules/mountDrive.js',
		requirements: ['FS-async', 'async']
	},
	callbacks: {
		onLoad() {
			globalThis.mountDrive = { threads: [], toUpload: toUpload, filesLoaded: false }
			toUpload = null
			mountDrive.threads.push(new Thread(function* () {
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

			}))
			mountDrive.threads.push(new Thread(function* () {
				yield* threadLibs.waitUntil(() => (mountDrive.threads[0].idle))
				for (let i of mountDrive.toUpload) {
					yield* FS.forceSetFile('dotOS/data', i.name, i.contents)
				}
				mountDrive.filesLoaded = true
				api.log('Finished loading files!')
			}))
		}
	}
}
obj