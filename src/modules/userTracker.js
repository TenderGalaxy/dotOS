{
  info: {
    name: 'user',
    type: 'os',
    version: '1.0.0',
    requirements: [],
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/getUserId.js'
  },
  callbacks: {
    onLoad(){
      dotOS.user = {id: myId, pos: []}
      globalThis.dotOS.updateUserPositions = function(){
        globalThis.dotOS.user.pos = api.getPosition(dotOS.user.id)
        TS.setTimeout(dotOS.updateUserPositions, 2)
      }
      dotOS.updateUserPositions()
    }
  }
}
