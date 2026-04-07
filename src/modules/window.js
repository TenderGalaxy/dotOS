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
                this.im = new Uint8Array(this.dim[0] * this.dim[1])
                this.im.fill(137)
            }
            ltoi(...v){
                return (this.pos[0] * v[0]) + v[1]
            }
            shadeOutlines(color){
                for(let i = 0; i < this.dim[0]; i++){
                    this.im[this.ltoi(0, i)] = color
                    this.im[this.ltoi(this.dim[1] - 1, i)] = color
                }
                for(let i = 0; i < this.dim[1]; i++){
                    this.im[this.ltoi(i, 0)] = color
                    this.im[this.ltoi(i, this.dim[0] - 1)] = color
                }
            }
            render(){
                for(let i = 0; i < this.dim[1]; i++){
                    let v = this.im.slice(this.dim[0] * i, this.dim[0] * i + this.dim[0])
                    display.buffer.set(this.pos[0] * display.res[0] + display.res[1], v)
                }
            }
        }
        api.log('Initialized Windows!')
        globalThis.windowIs = new Thread(function*(){
            yield* loadJSONFile('dotOS/data/font.json')
            yield
        })
    },
    callbacks: {}
}