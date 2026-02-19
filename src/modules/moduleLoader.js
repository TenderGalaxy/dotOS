//callbacks is predefined in wc, is fine to use
{
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
      for(let i of callbacks){
        dotOS.callbacks[i] = []
      }
      globalThis.dotModule = {
        callbacks: callbacks,
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
            globalThis[name] = function(...args){
              t = ''
              for(let i of dotOS.callbacks[name]){
                t = i(...args)
              }
              return t
            }
          }
        }
      }
    }
  }
}
