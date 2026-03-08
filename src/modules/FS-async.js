{
  info: {
    name: 'FS-async',
    type: 'os',
    version: '1.0.0',
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/FS-async.js',
    requirements: ['async']
  },
  callbacks: {
    onLoad(){
      globalThis.asyncFS = class extends disk {
        *getFileAsync(f){
          let t = this.hash.hashStr(f)
          yield* this._loadFile(t)
          yield this._getFile(t)
        }
        *setFileAsync(f, c){
          let t = this.hash.hashStr(f)
          yield* this._loadFile(t)
          yield this.setFile(f, c)
        }
        *_loadFile(f){
          yield this._isFileLoaded(f)
          yield this._isFileLoaded(f)
        }
        *loadFile(f){
          yield* this._loadFile(this.hash.hashStr(f))
        }
      }
      globalThis.FS = new asyncFS(-1728)
    }
  }
}
