{
  info: {
    name: 'dotError',
    type: 'worldcode',
    version: '1.0.0',
    source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/dotError.js',
    requirements: []
  },
  callbacks: {
    onLoad(){
      class dotErr {
        constructor(){}
        try(code, ...args){
          this.point = ''
          this.src = code.split(/[\n;]+/)
          try{
          	return new Function(code)(...args)
          } catch(e){
          	this.e = e
          	this.point = +e.stack.split(' ')[6].slice(9).replace(')\n', '') - 3
          }
        }
        tryFunction(code, ...args){
          this.point = ''
          this.src = code.toString().split(/[\n;]+/)
          try{
          	return (code)(...args)
          } catch(e){
          	this.e = e
          	this.point = +e.stack.split(' ')[6].slice(9).replace(')\n', '') + 1
          }
        }
        log(){
        	if(this.point === ''){
        		api.broadcastMessage('No Errors Found!', {color: 'red'})
        		return
        	}
        	let m = this.e.stack.split('\n')
        	m = Array.from(m, (x) => x.slice(4)).slice(0, m.length - 4)
        	api.broadcastMessage([{str: `Line ${this.point}: ${this.e.message}\n`, style: {color: 'orange'}},
        	{str: `>| ${this.src[this.point]}\n`, style: {color: 'lightblue'}},
        	{str: m.join('\n'), style: {color: 'orange'}}])
        },
        hasError(){
        	return this.point !== ''
        }
      }
      globalThis.dotError = new dotErr()
    }
  }
}
