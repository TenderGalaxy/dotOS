const fs = require('fs').promises
const path = require('node:path')
async function main() {
	api = await import('./api.js')
	api = api.default
	require('../build/worldcode.cjs')
	callbacks = await fs.readFile(path.join(__dirname, 'callbacks.json'), { encoding: 'utf8' })
	console.log('DotOS Env: WC Loaded')
	myId = '-1'
	require('../build/files.cjs')
	require('../build/codeblock.cjs')
	const interval = setInterval(() => { tick() }, 10)
	require('./testscript.cjs')
	/*setInterval(function(){
		api.log(Object.keys(TS.work))
	}, 50)*/
}
main()
// ctrl + c	