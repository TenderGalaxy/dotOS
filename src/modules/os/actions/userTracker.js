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
			pos: [],
			cam: [1, 0, 0]
		}
		api.setCameraDirection(myId, [1, 0, 0])
		globalThis.dotOS.updateUserPositions = function () {
			globalThis.dotOS.user.pos = api.getPosition(dotOS.user.id)
		}
		globalThis.dotOS.updateUserCam = function () {
			let add = (a, b) => {
				return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
			}
			dotOS.user.cam = add(dotOS.user.cam, api.getPlayerFacingInfo(dotOS.user.id).dir)
		}
		globalThis.dotOS.handleUserInput = function () {
			dotOS.updateUserPositions()
			dotOS.updateUserCam()
			TS.setTimeout(dotOS.handleUserInput, 2)
		}
		dotOS.handleUserInput()
	},
	callbacks: {
	}
}