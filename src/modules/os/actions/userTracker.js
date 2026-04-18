export default {
	info: {
		name: 'user',
		type: 'os',
		version: '1.0.0',
		requirements: [],
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/getUserId.js'
	},
	onLoad(){
		dotOS.user = {
			id: myId,
			pos: [0,0,0],
			cam: [1, 0, 0],
			input: {},
			config: {
				keyHoldRate: 5
			}
		}
		api.setClientOptions(dotOS.user.id, {
			walkingSpeed: 0.001,
			runningSpeed: 0.001,
			jumpAmount: 0.001
		})
		globalThis.dotOS.updateUserPositions = function () {
			globalThis.dotOS.user.pos = api.getPosition(dotOS.user.id) * 1000 * 60
			if(dotOS.user.pos[1] > 0){
				dotOS.user.input.spacebar = dotOS.user.config.keyHoldRate
			}
			api.setPosition(dotOS.user.id, [0,0,0])
		}
		globalThis.dotOS.getPressedKeys = function(){
			return dotOS.user.input
		}
		globalThis.dotOS.updateUserCam = function () {
			let add = (a, b) => {
				return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
			}
			dotOS.user.cam = add(dotOS.user.cam, api.getPlayerFacingInfo(dotOS.user.id).dir)
			api.setCameraDirection(myId, [1, 0, 0])
		}
		globalThis.dotOS.handleUserInput = function () {
			dotOS.updateUserPositions()
			dotOS.updateUserCam()
			TS.setTimeout(dotOS.handleUserInput, 2)
		}
		dotOS.handleUserInput()
	},
	callbacks: {
		onPlayerClick(id){
			if(id != dotOS.user.id) return
			dotOS.user.input.click = dotOS.user.config.keyHoldRate
		},
		onPlayerSelectInventorySlot(id, idx){
			if(id != dotOS.user.id) return
			dotOS.user.input[`key${idx}`] = dotOS.user.config.keyHoldRate
		},
		tick(){
			for(let i of Object.keys(dotOS.user.input)){
				dotOS.user.input[i] = Math.max(dotOS.user.input[i] - 1, 0)
			}
		}
	}
}