/*
Sample code:

TS.schedule(new Thread(function(){
  api.log('Hi!')
  this.sleep(1000)
  api.log('It's been one second!')
  this.waitUntil(tick > 1000)
  api.log('And now it's been 50!')
}))
*/
class Thread {
  constructor(func){
    this.task = func
  },
  sleep(ms){
    yield {action: 'sleep', ms: ms}
  }
}
