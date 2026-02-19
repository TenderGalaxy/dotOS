
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
        scheduleFirstUnused(action){
          TS.lastUsedTick = Math.max(TS.lastUsedTick, TS.tick+1)
          TS.stack[TS.lastUsedTick] = [action]
          TS.lastUsedTick++
        },
        scheduleNextTick(action){
          if(TS.stack?.[TS.tick + 1]){
            TS.stack[TS.tick + 1].push(action)
          } else {
            TS.stack[TS.tick + 1] = [action]
          }
        },
        setTimeout(action, delay){
          if(delay < 1){
            throw new ValueError('TS.setTimeout recieved a negative delay value.')
          }
          TS.lastUsedTick = Math.max(TS.lastUsedTick, TS.tick + delay)
          if(TS.stack?.[TS.tick + delay]){
            TS.stack[TS.tick + delay].push(action)
          } else {
            TS.stack[TS.tick + delay] = [action]
          }
        },
        cancelSpecific(delay, fname){
          let t = []
          for(let i of TS.stack[TS.tick + delay){
            if(i.name !== fname){
              t.push(i)
            }
          }
          TS.stack[TS.tick + delay] = t
        }
      }
    },
    tick(){
      TS.tick++
      if(!TS.work?.[TS.tick]) return
      if(TS.prioritizeUnfinishedWork){
        TS.stack.extend(TS.work[TS.tick])
      } else {
        TS.stack = [...TS.work[TS.tick], ...TS.stack]
      }
      while(stack.length > 0){
        eval()
        dotError.tryFunction(stack.shift())
        if(dotError.hasError()){
          dotError.log()
        }
      }
    }
  }
}
