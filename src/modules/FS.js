{
  info: {
    name: 'FS',
    type: 'worldcode', // unfortunately, async library is os-scoped, so we can't use it here
    version: '1.0.0',
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/FS.js',
    requirements: []
  },
  callbacks: {
    onLoad(){
      globalThis.FS = {
        disk: -1728, // Uses Disk number 1728 for minimum overhead with other libraries
        fileNameCache: {},
        getFile(f, isFirstTime = true){
          if((typeof f) !== 'number'){
            f = FS.followPath(f)
          }
          let len = FS.getFileHeader(f).length
          let file = ''
          for(i = 1; i <= len; i++){
            for(let j of api.getStandardChestItems([idx, FS.disk, 0])){
              file.push(j.attributes.customDescription)
            }
          }
          return JSON.parse(file)
        },
        getFileHeader(idx){
          return JSON.parse(api.getStandardChestItemSlot([idx, FS.disk, 0], 0))
        },
        setFile(file, contents){
          if((typeof file) !== 'number'){
            file = FS.followPath(file)
          }
          let descs = JSON.stringify(contents.contents).match(/[^]{1,450}/g)
          let chunks = []
          for(let i = 0; i < descs.length; i += 36){
            chunks.push(descs.slice(i, i + 36))
          }
          let len = chunks.length
          api.setStandardChestItemSlot([file, FS.disk, 0], JSON.stringify({
            name: contents.name,
            extension: contents.extension,
            length: len
          }))
          for(let i = 1; i <= len; i++){
            TS.setTimeout(function(){
              let f = chunks[i]
              for(let j = 0; j < f.length; j++){
                api.setStandardChestItemSlot([file, FS.disk, i], j, 'Net', 1, undefined, {
                  customDescription: chunks[i-1][j]
                })
              }
            }, i)
          }
        },
        followPath(file, start = 0){
          if((typeof x) === 'number'){
            return x
          }
          if((typeof x) === 'string'){
            x = x.split('/')
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
          return f
        }
      }
    }
  }
}
