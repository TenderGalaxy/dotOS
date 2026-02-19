{
  // todo: replace all instances of module with dotModule, as module is a reserved keyword in many environments
  info: {
    name: 'moduleLoader',
    type: 'worldcode',
    version: '1.0.0',
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/moduleLoader.js',
    requirements: []
  },
  callbacks: {
    onLoad(){
      globalThis.dotOS ??= {}
      dotOS.module ??= {}
      dotOS.callbacks ??= {}
      let callbacks = 'tick onClose onPlayerJoin onPlayerLeave onPlayerJump onRespawnRequest playerCommand onPlayerChat onPlayerChangeBlock onPlayerDropItem onPlayerPickedUpItem onPlayerSelectInventorySlot onBlockStand onPlayerAttemptCraft onPlayerCraft onPlayerAttemptOpenChest onPlayerOpenedChest onPlayerMoveItemOutOfInventory onPlayerMoveInvenItem onPlayerMoveItemIntoIdxs onPlayerSwapInvenSlots onPlayerMoveInvenItemWithAmt onPlayerAttemptAltAction onPlayerAltAction onPlayerClick onClientOptionUpdated onMobSettingUpdated onInventoryUpdated onChestUpdated onWorldChangeBlock onCreateBloxdMeshEntity onEntityCollision onPlayerAttemptSpawnMob onWorldAttemptSpawnMob onPlayerSpawnMob onWorldSpawnMob onWorldAttemptDespawnMob onMobDespawned onPlayerAttack onPlayerDamagingOtherPlayer onPlayerDamagingMob onMobDamagingPlayer onMobDamagingOtherMob onAttemptKillPlayer onPlayerKilledOtherPlayer onMobKilledPlayer onPlayerKilledMob onMobKilledOtherMob onPlayerPotionEffect onPlayerDamagingMeshEntity onPlayerBreakMeshEntity onPlayerUsedThrowable onPlayerThrowableHitTerrain onTouchscreenActionButton onTaskClaimed onChunkLoaded onPlayerRequestChunk onItemDropCreated onPlayerStartChargingItem onPlayerFinishChargingItem onPlayerFinishQTE doPeriodicSave'
      callbacks = callbacks.split(' ')
      for(let i of callbacks){
        dotOS.callbacks[i] = []
      }
      globalThis.dotModule = {
        callbacks: ["tick","onClose","onPlayerJoin","onPlayerLeave","onPlayerJump","onRespawnRequest","playerCommand","onPlayerChat","onPlayerChangeBlock","onPlayerDropItem","onPlayerPickedUpItem","onPlayerSelectInventorySlot","onBlockStand","onPlayerAttemptCraft","onPlayerCraft","onPlayerAttemptOpenChest","onPlayerOpenedChest","onPlayerMoveItemOutOfInventory","onPlayerMoveInvenItem","onPlayerMoveItemIntoIdxs","onPlayerSwapInvenSlots","onPlayerMoveInvenItemWithAmt","onPlayerAttemptAltAction","onPlayerAltAction","onPlayerClick","onClientOptionUpdated","onMobSettingUpdated","onInventoryUpdated","onChestUpdated","onWorldChangeBlock","onCreateBloxdMeshEntity","onEntityCollision","onPlayerAttemptSpawnMob","onWorldAttemptSpawnMob","onPlayerSpawnMob","onWorldSpawnMob","onWorldAttemptDespawnMob","onMobDespawned","onPlayerAttack","onPlayerDamagingOtherPlayer","onPlayerDamagingMob","onMobDamagingPlayer","onMobDamagingOtherMob","onAttemptKillPlayer","onPlayerKilledOtherPlayer","onMobKilledPlayer","onPlayerKilledMob","onMobKilledOtherMob","onPlayerPotionEffect","onPlayerDamagingMeshEntity","onPlayerBreakMeshEntity","onPlayerUsedThrowable","onPlayerThrowableHitTerrain","onTouchscreenActionButton","onTaskClaimed","onChunkLoaded","onPlayerRequestChunk","onItemDropCreated","onPlayerStartChargingItem","onPlayerFinishChargingItem","onPlayerFinishQTE","doPeriodicSave"],
        refreshOnLoad: true,
        load(name){
          let t = FS.get(`dotOS/modules/${name}.js`)
          let temp = dotError.try('return ' + t)()
          if(dotError.hasError()){
            dotError.log()
            throw new Error(`moduleLoader: Error loading module ${name}`)
          }
          dotOS.module[temp.info.name] = temp
          temp = null
          if(dotModule.refreshOnLoad){
            dotModule.refreshModules()
          }
        },
        resetAllCallbacks(){
          for(let i of dotModule.callbacks){
            dotOS.callbacks[i] = []
          }
        },
        refreshModules(){
          dotModule.resetAllCallbacks()
          for(let [i, j] of Object.entries(dotOS.module)){
            for(let [k, l] of Object.entries(j.callbacks)){
              if(l.name == 'onLoad'){
                l()
              } else {
                dotOS.callbacks[i].push(() => l())
              }
            }
          }
          dotModule.setCallbacks()
        },
        setCallbacks(){
          for(let name of dotModule.callbacks){
            globalThis[name] = function(){
              t = ''
              for(let i of dotOS.callbacks[name]){
                t = i()
              }
              return t
            }
          }
        }
      }
    }
  }
}
