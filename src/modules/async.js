/*
Sample code:

a = new Thread(function(){
  api.log('Hi!')
  yield* this.await(awaitUserInput())
  api.log('Bye')
})
*/
{
info: {
  name: 'async',
  type: 'os',
  version: '1.0.0',
  source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/async.js',
  requirements: []
},
callbacks: {

onLoad(){
  globalThis.Thread = new class{
    constructor(func){
      this.task = func
      this.task()
    }
    tick(){
      let value = this.task.next()
      return TS.scheduleFirstUnused(() => (this.tick()))
    }
  }
  globalThis.threadLibs = {
    sleep(ms){
      yield* threadLibs.sleep_internal(TS.tick + ms)
    },
    sleep_internal(del){
      if(TS.tick < del){
        yield
      }
    },
    waitUntil(condition){
      if(!condition){
        yield
      }
    }
  }
}

}
}
