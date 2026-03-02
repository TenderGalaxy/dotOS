{
  info: {
    name: 'FS',
    type: 'worldcode', // unfortunately, async library is os-scoped, so we can't use it here
    version: '1.0.0',
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/FS.js',
    requirements: [],
  },
  callbacks: {
    onLoad(){
      class fnvHash {
        offset = 0x811c9dc5
        prime = 0x01000193
        hash(arr){
          let v = this.offset >>> 0
          for(let i of arr){
            v ^= i
            v = Math.imul(v, this.prime)
          }
          return v
        }
        strToArr(str){
          let ans = new Uint8Array(str.length * 2), v
          for(let i = 0; i < str.length; i++){
            v = str[i].codePointAt()
            ans[2*i] = v >> 8
            ans[2*i + 1] = v & 255
          }
          return ans
        }
        hashStr(str){
          return this.hash(this.strToArr(str))
        }
      }
      /*globalThis.disk = class {
        constructor(disk){
          this.disk = disk
          this.fileNameCache = {}
        }
        getFile(f){
          if((typeof f) !== 'number'){
            f = this.followPath(f)
          }
          let len = this.getFileHeader(f).length
          let file = ''
          for(i = 1; i <= len; i++){
            for(let j of api.getStandardChestItems([idx, this.disk, 0])){
              file.push(j.attributes.customDescription)
            }
          }
          return JSON.parse(file)
        }
        getFileHeader(idx){
          return JSON.parse(api.getStandardChestItemSlot([idx, this.disk, 0], 0))
        }
        setFile(file, contents){
          if((typeof file) !== 'number'){
            file = this.followPath(file)
          }
          let descs = JSON.stringify(contents.contents).match(/[^]{1,450}/g)
          let chunks = []
          for(let i = 0; i < descs.length; i += 36){
            chunks.push(descs.slice(i, i + 36))
          }
          let len = chunks.length
          api.setStandardChestItemSlot([file, this.disk, 0], 0, 'Net', 1, undefined, JSON.stringify({
            name: contents.name,
            extension: contents.extension,
            length: len
          }))
          for(let i = 1; i <= len; i++){
            TS.setTimeout(function(){
              let f = chunks[i]
              for(let j = 0; j < f.length; j++){
                api.setStandardChestItemSlot([file, this.disk, i], j, 'Net', 1, undefined, {
                  customDescription: chunks[i-1][j]
                })
              }
            }, i)
          }
        }
        followPath(file, start = 0){
          if((typeof x) === 'number'){
            return x
          }
          if((typeof x) === 'string'){
            x = x.split('/')
          }
          if(file in this.fileNameCache){
            return this.fileNameCache[file]
          }
          let filesInDir;
          for(let name of x){
             start = FS.getFile(name).contents
             filesInDir = start.map(m => FS.getFileHeader(m)).map(m => m.name + m.extension)
             if(!j.includes(name)){
              throw new Error(`InvalidFilePathError: ${name} of ${file} does not exist.`)
            }
            start = start[filesInDir.indexOf(name)]
          }
          this.fileNameCache[file] = f
          return f
        }
        setFileHeader(file, header){
          if((typeof file) == 'string'){
            file = FS.followPath(file)
          }
          api.setStandardChestItemSlot([file, FS.disk, 0], 0, 'Net', 1, undefined, {
            customDescription: JSON.stringify(header)
          })
        }
      }*/
      globalThis.disk = class {
        /*
        Contents of a directory:
        {
          location: ['System/modules']
          children: ['async.js', 'FS.js', ...etc]
        }
        */
        constructor(disk){
          this.disk = disk
          this.hash = new fnvHash()
        }
        getFile_internal(hex){
          let head = this.getFileHeader_internal(hex)
          let out = ''
          for(let i = 1; i <= head.length; i++){
            out += getFChapter(hex, i).reduce((a, b) => (a + b), '')
          }
          return out
        }
        getFileHeader_internal(hex){
          return JSON.parse(this.getFSlot(hex, 0, 0))
        }
        getFSlot(f, chapter, idx){
          return api.getStandardChestItemSlot([f, this.disk, chapter], idx).attributes.customDescription
        }
        getFChapter(f, chapter){
          return Array.from(api.getStandardChestItems([f, this.disk, chapter]), function (a){
            return a.attributes.customDescription
          })
        }
        getFileHeader(f){
          return this.getFileHeader_internal(this.hash.hashStr(f))
        }
        getFile(f){
          return this.getFile_internal(this.hash.hashStr(f))
        }
      }
      globalThis.FS = new disk(-1728)
    }
  }
}
