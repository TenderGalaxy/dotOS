let otp = {
  /*
Sample code:

a = new Thread(function(){
  api.log('Hi!')
  yield* this.await(awaitUserInput())
  api.log('Bye')
})
*/
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
      this.task = func()
      this.idle = false
      this.tick()
    }
    tick(){
      let value = this.task.next()
      if(value.done) this.idle = true
      if(!this.idle){
        return TS.scheduleFirstUnused(() => (this.tick()))
      }
    }
    isIdle(){
      return this.idle
    }
    setWork(v){
      this.idle = v
      if(!this.idle){
        TS.scheduleFirstUnused(() => (this.tick()))
      }
    }
    setTask(f){
      this.task = f
      this.idle = false
      TS.scheduleFirstUnused(() => (this.tick()))
    }
  }
  globalThis.threadLibs = {
    *sleep(ms){
      yield* threadLibs.sleep_internal(TS.tick + ms)
    },
    *sleep_internal(del){
      if(TS.tick < del){
        yield
      }
    },
    *waitUntil(condition){
      if(!condition){
        yield
      }
    }
  }; otp
}

}
}
