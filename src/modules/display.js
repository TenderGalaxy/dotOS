export default {
    info: {
        name: 'display',
        type: 'os',
        version: '1.0.0',
        source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/display.js',
        requirements: ['FS-async', 'async', 'data', 'bigArray']
    },
    onLoad() {
        initDisplay = new Thread(function* () {
            /**
             * @namespace Display
             */
            globalThis.Display = class {
                hasChanged = false
                width = 0.05
                height = 0.05
                partition = 8
                row = 128
                /**
                 * @memberof Display
                 * @param {number[]} res - Resolution, defaults to 256x128
                 */
                constructor(res) {
                    this.res = res || [256, 128]
                    this.buffer = new Uint8Array(this.res[0] * this.res[1])
                    this.buffer.fill(137)
                    this.pixels = new Proxy(this.buffer, {
                        set: (t, i, v) => (t[i] = v, this.hasChanged = true)
                    })
                }
                _drawRow(){
                    const pos = [0,3,0]
                    const part = this.res[0]/this.partition
                    for(let j = 0; j < this.partition; j++){
                        const id = `dotOS_display_row${this.row}_rev${j}`
                        const off = this.row * this.res[0]
                        let row = Array(part)
                        for(let x = 0; x < part; x++){
                            row[x] = {
                                str: '█',
                                style: {
                                    color: this.colors.names[this.buffer[off + x + (part * j)]]
                                }
                            }
                        }
                        const npos = [
                            pos[0] + ((j - (this.partition/2)) * part * this.width),
                            pos[1] + ((this.res[1] - this.row) * this.height),
                            pos[2]
                        ]
                        api.setDirectionArrow(
                            dotOS.user.id,
                            id,
                            npos,
                            row,
                            false,
                            {
                                color: 'black',
                                fontSize: '3px'
                            }
                        )
                    }
                    this.row++
                }
                _spamDraw(){
                    if(this.row < this.res[1]){
                        TS.setTimeout(() => this._spamDraw(), 1)
                    }
                    while(this.row < this.res[1]){
                        this._drawRow()
                    }
                }
                drawDisplay() {
                    this.row = 0
                    this._spamDraw()
                }
                clearDisplay() {
					for(let i = 0; i < this.res[1]; i++){
						for(let j = 0; j < this.partition; j++){
							api.clearDirectionArrow(dotOS.user.id, `dotOS_display_row${this.row}_rev${j}`)
						}
					}
				}
                isIdle(){
                    return this.row == this.res[1]
                }
                /*
    _renderRow(y) {
    const rowOffset = y * this.width;
    
    for (let x = 0; x < this.width; x++) {
      this.rowBuilder[x] = this.palette[this.buffer[rowOffset + x]];
    }
    const rowString = this.rowBuilder.join("");
    const visualIndex = (this.height - 1 - y);
    
    const pos = [
      this.screenPos[0],
      this.screenPos[1] + (visualIndex * this.pixelStep),
      this.screenPos[2]
    ];

    api.setDirectionArrow(
      this.playerId,
      `${this.screenId}_${visualIndex}`, 
      pos,
      rowString,
      false, 
      { 
        color: "black",
        fontSize: "4px" 
      }
    );
  }
    */
            }
            globalThis.display = new Display()
            api.log('display: dotOS Display loaded!')

            yield* threadLibs.waitUntil(() => !globalThis.driveMounting)
            display.colors = yield* loadJSONFile('dotOS/data/colors.json')
            api.log('display: Processing hex codes...')
            display.colors.hex = display.colors.hex.map(function (v) {
                let a = v[1] + v[2]
                let b = v[3] + v[4]
                let c = v[4] + v[5]
                return [Number('0x' + a), Number('0x' + b), Number('0x' + c)]
            })
            api.log('display: dotOS HTML Colors loaded!')
        }, 'initDisplay')
    },
    callbacks: {}
}