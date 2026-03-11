{
  info: {
    name: 'jsonLoad',
    type: 'os',
    version: '1.0.0',
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/jsonLoad.js',
    requirements: []
  },
  callbacks: {
    onLoad(){
      globalThis.JSON.loadFile = function*(f){
        let v = yield* FS.getFile(f)
        return eval('let obj = ' + FS.getFile(f) + '; obj')
      }
    }
  }
}
