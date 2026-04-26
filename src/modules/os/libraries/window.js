export default {
    info: {
        name: 'window',
        type: 'os',
        version: '1.0.0',
        source: 'github.com/tendergalaxy/dotos/blob/main/src/modules/window.js',
        requirements: ['display']
    },
    onLoad(){
        globalThis.Win = class {
            constructor(dim, pos){
                this.dim = dim
                this.pos = pos
                this.im = new Uint8Array(this.dim[0] * this.dim[1])
                this.im.fill(137)
            }
            ltoi(...v){
                return (this.dim[0] * v[0]) + v[1]
            }
            /**
             * Shade the outlines of a window.
             * @param {Number} color - The color of the outlines
             */
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
                    for(let j = 0; j < this.dim[0]; j++){
                        display.buffer[(this.pos[1] + i) * display.res[0] + this.pos[0] + j] = this.im[this.dim[0] * i + j]
                    }
                }
            }
            drawChar(pos, char, colors){
                if(pos[0] > this.dim[0] - 3 || pos[1] > this.dim[1] - 5 || pos[0] < 0 || pos[1] < 0){
                    return
                }
                for(let i = 0; i < 5; i++){
                    for(let j = 0; j < 3; j++){
                        this.im[this.dim[0] * (pos[1] + i) + j + pos[0]] = colors[dotOS.font[char][3 * i + j] == '#' ? 1 : 0]
                    }
                }
            }
            /**
             * Draw a string
             * @param {Number[]} pos - The Position
             * @param {String} str - String
             * @param {{colors?:Number[],kerning?:true,wraptoleft?:false}} - Style
             * @returns {void}
             */
            drawString(pos, str, { colors = [137, 0], kerning = true, wraptoleft = false } = {}){
                let npos = pos.slice()
                for(let i = 0; i < str.length; i++){
                    npos[0] += 4
                    if(kerning && pos[0] > this.dim[0] - 3){
                        npos[0] = wraptoleft ? this.dim[0] + 2 : pos[0]
                        npos[1] += 6
                    }
                    if(npos[1] > this.dim[1] - 5){
                        return
                    }
                    this.drawChar(npos, str[i], colors)
                }
            }
        }
        api.log('Initialized Windows!')
        globalThis.windowIs = new Thread(function*(){
            yield* thl.require('drive')
            globalThis.dotOS.font = yield* execFile('dotOS/data/display/font.json')
            thl.send('window')
        }(), 'windowIs')
    },
    callbacks: {}
}