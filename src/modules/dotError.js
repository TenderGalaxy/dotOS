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
      globalThis.dotError = {
      	try(code, ...args){
      		dotError.point = ''
      		dotError.src = code.split(/[\n;]+/)
      		try{
      			return Function(code)(args)
      		} catch(e){
      			dotError.e = e
      			dotError.point = +e.stack.split(' ')[6].slice(9).replace(')\n', '') - 3
      		}
      	},
        tryFunction(code, ...args){
          dotError.point = ''
      		dotError.src = code.split(/[\n;]+/)
      		try{
      			return code(args)
      		} catch(e){
      			dotError.e = e
      			dotError.point = +e.stack.split(' ')[6].slice(9).replace(')\n', '') - 3
      		}
        },
      	log(){
      		if(dotError.point === ''){
      			api.broadcastMessage('No Errors Found!', {color: 'red'})
      			return
      		}
      		let m = dotError.e.stack.split('\n')
      		m = Array.from(m, (x) => x.slice(4)).slice(0, m.length - 4)
      		api.broadcastMessage([{str: `Line ${dotError.point}: ${dotError.e.message}\n`, style: {color: 'orange'}},
      		{str: `>| ${dotError.src[dotError.point]}\n`, style: {color: 'lightblue'}},
      		{str: m.join('\n'), style: {color: 'orange'}}
      ])
      	},
      	hasError(){
      		return dotError.point !== ''
      	}
      }
    }
  }
}
