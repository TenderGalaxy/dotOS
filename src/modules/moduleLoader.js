//callbacks is predefined in wc, is fine to use
obj = {
	info: {
		name: 'moduleLoader',
		type: 'worldcode',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/moduleLoader.js',
		requirements: []
	},
	callbacks: {
		onLoad() {
			globalThis.callbacks = ["tick", "onClose", "onPlayerJoin", "onPlayerLeave", "onPlayerJump", "onRespawnRequest", "playerCommand", "onPlayerChat", "onPlayerChangeBlock", "onPlayerDropItem", "onPlayerPickedUpItem", "onPlayerSelectInventorySlot", "onBlockStand", "onPlayerAttemptCraft", "onPlayerCraft", "onPlayerAttemptOpenChest", "onPlayerOpenedChest", "onPlayerMoveItemOutOfInventory", "onPlayerMoveInvenItem", "onPlayerMoveItemIntoIdxs", "onPlayerSwapInvenSlots", "onPlayerMoveInvenItemWithAmt", "onPlayerAttemptAltAction", "onPlayerAltAction", "onPlayerClick", "onClientOptionUpdated", "onMobSettingUpdated", "onInventoryUpdated", "onChestUpdated", "onWorldChangeBlock", "onCreateBloxdMeshEntity", "onEntityCollision", "onPlayerAttemptSpawnMob", "onWorldAttemptSpawnMob", "onPlayerSpawnMob", "onWorldSpawnMob", "onWorldAttemptDespawnMob", "onMobDespawned", "onPlayerAttack", "onPlayerDamagingOtherPlayer", "onPlayerDamagingMob", "onMobDamagingPlayer", "onMobDamagingOtherMob", "onAttemptKillPlayer", "onPlayerKilledOtherPlayer", "onMobKilledPlayer", "onPlayerKilledMob", "onMobKilledOtherMob", "onPlayerPotionEffect", "onPlayerDamagingMeshEntity", "onPlayerBreakMeshEntity", "onPlayerUsedThrowable", "onPlayerThrowableHitTerrain", "onTouchscreenActionButton", "onTaskClaimed", "onChunkLoaded", "onPlayerRequestChunk", "onItemDropCreated", "onPlayerStartChargingItem", "onPlayerFinishChargingItem", "onPlayerFinishQTE", "doPeriodicSave"]
			dotOS.module ??= {}
			dotOS.callbacks ??= {}
			/**
			 * @namespace dotModule
			 */
			globalThis.dotModule = {
				callbacks: [...callbacks],
				refreshOnLoad: true,
				/**
				 * Load a file as a module.
				 * @memberof dotModule
				 * @param {string} name - File name 
				 */
				*load(name) {
					let t = yield* FS.getFileAsync(name)
					let temp = dotError.try(t)()
					if (dotError.hasError()) {
						dotError.log()
						throw new Error(`moduleLoader: Error loading module ${name}`)
					}
					dotOS.module[temp.info.name] = temp
					temp = null
					if (dotModule.refreshOnLoad) {
						dotModule.refreshModules()
					}
				},
				/**
				 * @memberof dotModule
				 * Delete every callback.
				 */
				resetAllCallbacks() {
					for (let i of dotModule.callbacks) {
						dotOS.callbacks[i] = []
					}
				},
				/**
				 * @memberof dotModule
				 * Refresh all modules and create corresponding callbacks.
				 */
				refreshModules() {
					dotModule.resetAllCallbacks()
					for (let [i, j] of Object.entries(dotOS.module)) {
						for (let [k, l] of Object.entries(j.callbacks)) {
							if (l.name == 'onLoad') {
								l()
							} else {
								dotOS.callbacks[i].push(() => l())
							}
						}
					}
				},
				setCallbacks() {
					for (let name of dotModule.callbacks) {
						globalThis[name] = function (...args) {
							t = undefined
							for (let i of dotOS.callbacks[name]) {
								t = dotError.tryFunction(i, ...args)
								if (dotError.hasError()) {
									dotError.log()
								}
							}
							return t
						}
					}
				}
			}
			dotModule.setCallbacks()
			callbacks = null
		}
	}
}
