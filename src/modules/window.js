export default {
    info: {
        name: 'window',
        type: 'os',
        version: '1.0.0',
        source: 'github.com/tendergalaxy/dotos/blob/main/src/modules/window.js',
        requirements: ['display']
    },
    onLoad(){
        globalThis.window = class {
            constructor(dim, pos){
                this.dim = dim
                this.pos = pos
            }
        }
    },
    callbacks: {}
}