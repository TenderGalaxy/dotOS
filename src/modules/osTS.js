
{
  /* osTS */
/* The DotOS Task Scheduler */
  info: {
    name: 'TS',
    type: 'worldcode',
    version: '1.0.0',
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/osTS.js',
    requirements: []
  },
  callbacks: {
    onLoad(){
      globalThis.TS = {
        work: {},
        stack: [],
        prioritizeUnfinishedWork: true,
        cyclesPerTick: 1,
        lastUsedTick: 0,
        tick: 0,
        makeAction(action, ...args){
          return {f: action, a: args}
        },
        parseAction(action){
          dotError.tryFunction(action.f, ...action.a)
          if(dotError.hasError()){
            dotError.log()
          }
        },
        scheduleFirstUnused(action, ...args){
          TS.lastUsedTick = Math.max(TS.lastUsedTick, TS.tick+1)
          TS.work[TS.lastUsedTick] = [TS.makeAction(action, ...args)]
          TS.lastUsedTick++
        },
        scheduleNextTick(action, ...args){
          if(TS.work?.[TS.tick + 1]){
            TS.work[TS.tick + 1].push(TS.makeAction(action, ...args))
          } else {
            TS.work[TS.tick + 1] = [TS.makeAction(action, ...args)]
          }
        },
        setTimeout(action, delay, ...args){
          if(delay < 1){
            throw new ValueError('TS.setTimeout recieved a negative delay value.')
          }
          TS.lastUsedTick = Math.max(TS.lastUsedTick, TS.tick + delay)
          if(TS.work?.[TS.tick + delay]){
            TS.work[TS.tick + delay].push(TS.makeAction(action, ...args))
          } else {
            TS.work[TS.tick + delay] = [TS.makeAction(action, ...args)]
          }
        },
        cancelSpecific(delay, fname){
          let t = []
          for(let i of TS.work[TS.tick + delay]){
            if(i.f.name !== fname){
              t.push(i)
            }
          }
          TS.work[TS.tick + delay] = t
        }
      }
    },
    tick(){
      TS.tick++
      if(!TS.work?.[TS.tick]) return
      if(TS.prioritizeUnfinishedWork){
        TS.stack = [...TS.stack, ...TS.work[TS.tick]]
      } else {
        TS.stack = [...TS.work[TS.tick], ...TS.stack]
      }
      TS.work[TS.tick] = null
      while(TS.stack.length > 0){
        eval()
        TS.parseAction(TS.stack.shift())
      }
    }
  }
}
