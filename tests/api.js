let facingInfo = { dir: [0, 1, 0] }
let position = [0, 0, 0]
let chestInfo = {}
let loaded = {}
export default {
	// api.setStandardChestItemSlot([...f, chapter], idx, 'Net', 1, undefined, { customDescription: n })
	setStandardChestItemSlot(pos, idx, A, B, C, val) {
		chestInfo[pos[0]] ??= {}
		chestInfo[pos[0]][pos[1]] ??= {}
		chestInfo[pos[0]][pos[1]][pos[2]] ??= []
		chestInfo[pos[0]][pos[1]][pos[2]][idx] = { attributes: val }
	},
	getStandardChestItemSlot(pos, idx) {
		return chestInfo[pos[0]]?.[pos[1]]?.[pos[2]]?.[idx] || ''
	},
	getStandardChestItems(pos) {
		return chestInfo[pos[0]][pos[1]][pos[2]]
	},
	log(v) {
		console.log(`LOG: ${v}`)
	},
	setBlock() {
	},
	getEntityName(id) {
		return 'dotOS'
	},
	getPlayerFacingInfo(id) {
		return facingInfo
	},
	setCameraDirection(id, pos) {
		facingInfo.dir = pos
	},
	getPosition(id) {
		return position
	},
	setPosition(id, pos) {
		position = pos.slice()
	},
	broadcastMessage(val) {
		if (typeof val === 'string') {
			console.log(val)
			return
		}
		console.log('BROADCAST: ' + Array.from(val, a => a.str).join(''))
	},
	getBlockId(val) {
		loaded[val.toString()] ??= 0
		loaded[val.toString()]++
		return loaded[val.toString()] < 3 ? 1 : 2
	}
}