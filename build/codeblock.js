/*
DotOS
  - written by fenl_, 2026
(GPL V3 License)
I did not write this code myself, I wrote a script in python
to compile modules into separate code blocks and world code.

*/

toUpload = []
toUpload.push({
        name: 'colors.json',
        contents: JSON.stringify({
  "hex": [
    "#000000",
    "#000080",
    "#00008B",
    "#0000CD",
    "#0000FF",
    "#006400",
    "#008000",
    "#008080",
    "#008B8B",
    "#00BFFF",
    "#00CED1",
    "#00FA9A",
    "#00FF00",
    "#00FF7F",
    "#00FFFF",
    "#191970",
    "#1E90FF",
    "#20B2AA",
    "#228B22",
    "#2E8B57",
    "#2F4F4F",
    "#32CD32",
    "#3CB371",
    "#40E0D0",
    "#4169E1",
    "#4682B4",
    "#483D8B",
    "#48D1CC",
    "#4B0082",
    "#556B2F",
    "#5F9EA0",
    "#6495ED",
    "#663399",
    "#66CDAA",
    "#6A5ACD",
    "#6B8E23",
    "#708090",
    "#778899",
    "#7B68EE",
    "#7CFC00",
    "#7FFF00",
    "#7FFFD4",
    "#800000",
    "#800080",
    "#808000",
    "#808080",
    "#87CEEB",
    "#87CEFA",
    "#8A2BE2",
    "#8B0000",
    "#8B008B",
    "#8B4513",
    "#8FBC8F",
    "#90EE90",
    "#9370DB",
    "#9400D3",
    "#98FB98",
    "#9932CC",
    "#9ACD32",
    "#A0522D",
    "#A52A2A",
    "#A9A9A9",
    "#ADD8E6",
    "#ADFF2F",
    "#AFEEEE",
    "#B0C4DE",
    "#B0E0E6",
    "#B22222",
    "#B8860B",
    "#BA55D3",
    "#BC8F8F",
    "#BDB76B",
    "#C0C0C0",
    "#C71585",
    "#CD5C5C",
    "#CD853F",
    "#D2691E",
    "#D2B48C",
    "#D3D3D3",
    "#D8BFD8",
    "#DA70D6",
    "#DAA520",
    "#DB7093",
    "#DC143C",
    "#DCDCDC",
    "#DDA0DD",
    "#DEB887",
    "#E0FFFF",
    "#E6E6FA",
    "#E9967A",
    "#EE82EE",
    "#EEE8AA",
    "#F08080",
    "#F0E68C",
    "#F0F8FF",
    "#F0FFF0",
    "#F0FFFF",
    "#F4A460",
    "#F5DEB3",
    "#F5F5DC",
    "#F5F5F5",
    "#F5FFFA",
    "#F8F8FF",
    "#FA8072",
    "#FAEBD7",
    "#FAF0E6",
    "#FAFAD2",
    "#FDF5E6",
    "#FF0000",
    "#FF00FF",
    "#FF1493",
    "#FF4500",
    "#FF6347",
    "#FF69B4",
    "#FF7F50",
    "#FF8C00",
    "#FFA07A",
    "#FFA500",
    "#FFB6C1",
    "#FFC0CB",
    "#FFD700",
    "#FFDAB9",
    "#FFDEAD",
    "#FFE4B5",
    "#FFE4C4",
    "#FFE4E1",
    "#FFEBCD",
    "#FFEFD5",
    "#FFF0F5",
    "#FFF5EE",
    "#FFF8DC",
    "#FFFACD",
    "#FFFAF0",
    "#FFFAFA",
    "#FFFF00",
    "#FFFFE0",
    "#FFFFF0",
    "#FFFFFF"
  ],
  "names": [
    "Black",
    "Navy",
    "DarkBlue",
    "MediumBlue",
    "Blue",
    "DarkGreen",
    "Green",
    "Teal",
    "DarkCyan",
    "DeepSkyBlue",
    "DarkTurquoise",
    "MediumSpringGreen",
    "Lime",
    "SpringGreen",
    "Aqua",
    "MidnightBlue",
    "DodgerBlue",
    "LightSeaGreen",
    "ForestGreen",
    "SeaGreen",
    "DarkSlateGray",
    "LimeGreen",
    "MediumSeaGreen",
    "Turquoise",
    "RoyalBlue",
    "SteelBlue",
    "DarkSlateBlue",
    "MediumTurquoise",
    "Indigo",
    "DarkOliveGreen",
    "CadetBlue",
    "CornflowerBlue",
    "RebeccaPurple",
    "MediumAquaMarine",
    "SlateBlue",
    "OliveDrab",
    "SlateGray",
    "LightSlateGray",
    "MediumSlateBlue",
    "LawnGreen",
    "Chartreuse",
    "Aquamarine",
    "Maroon",
    "Purple",
    "Olive",
    "Gray",
    "SkyBlue",
    "LightSkyBlue",
    "BlueViolet",
    "DarkRed",
    "DarkMagenta",
    "SaddleBrown",
    "DarkSeaGreen",
    "LightGreen",
    "MediumPurple",
    "DarkViolet",
    "PaleGreen",
    "DarkOrchid",
    "YellowGreen",
    "Sienna",
    "Brown",
    "DarkGray",
    "LightBlue",
    "GreenYellow",
    "PaleTurquoise",
    "LightSteelBlue",
    "PowderBlue",
    "FireBrick",
    "DarkGoldenRod",
    "MediumOrchid",
    "RosyBrown",
    "DarkKhaki",
    "Silver",
    "MediumVioletRed",
    "IndianRed",
    "Peru",
    "Chocolate",
    "Tan",
    "LightGray",
    "Thistle",
    "Orchid",
    "GoldenRod",
    "PaleVioletRed",
    "Crimson",
    "Gainsboro",
    "Plum",
    "BurlyWood",
    "LightCyan",
    "Lavender",
    "DarkSalmon",
    "Violet",
    "PaleGoldenRod",
    "LightCoral",
    "Khaki",
    "AliceBlue",
    "HoneyDew",
    "Azure",
    "SandyBrown",
    "Wheat",
    "Beige",
    "WhiteSmoke",
    "MintCream",
    "GhostWhite",
    "Salmon",
    "AntiqueWhite",
    "Linen",
    "LightGoldenRodYellow",
    "OldLace",
    "Red",
    "Fuchsia",
    "DeepPink",
    "OrangeRed",
    "Tomato",
    "HotPink",
    "Coral",
    "DarkOrange",
    "LightSalmon",
    "Orange",
    "LightPink",
    "Pink",
    "Gold",
    "PeachPuff",
    "NavajoWhite",
    "Moccasin",
    "Bisque",
    "MistyRose",
    "BlanchedAlmond",
    "PapayaWhip",
    "LavenderBlush",
    "SeaShell",
    "Cornsilk",
    "LemonChiffon",
    "FloralWhite",
    "Snow",
    "Yellow",
    "LightYellow",
    "Ivory",
    "White"
  ]
}
)
      })
			globalThis.Thread = class {
				constructor(func) {
					this.task = func()
					this.idle = false
					this.tick()
				}
				tick() {
					let value = this.task.next()
					if (value.done) this.idle = true
					if (!this.idle) {
						return TS.scheduleFirstUnused(() => (this.tick()))
					}
				}
				isIdle() {
					return this.idle
				}
				setWork(v) {
					this.idle = v
					if (!this.idle) {
						TS.scheduleFirstUnused(() => (this.tick()))
					}
				}
				setTask(f) {
					this.task = f()
					this.idle = false
					TS.scheduleFirstUnused(() => (this.tick()))
				}
			}
			globalThis.threadLibs = {
				*sleep(ms) {
					yield* threadLibs.sleep_internal(TS.tick + ms)
				},
				*sleep_internal(del) {
					while (TS.tick < del) {
						yield
					}
				},
				*waitUntil(condition) {
					while (!(condition())) {
						yield
					}
				}
			}
	

			// THIS CODE WAS WRITTEN BY NICKNAME AND REUSED
			globalThis.BigArray = class {
				#pool = (0, eval)("[" + "[],".repeat(5220) + "]")
				#lastIndex;

				constructor(arr) {
					this.#lastIndex = arr.length - 1;
					for(let i = 0; i < Math.min(5220, arr.length); i++){
						let c = 0
						for(let j = i; j < length; j += 5220){
							this.#pool[i][c] = arr[j]
							c++
						}
					}
				}

				get length() {
					return this.#lastIndex + 1;
				}

				get(index) {
					return this.#pool[index % this.#pool.length][index];
				}

				set(index, value) {
					this.#pool[index % this.#pool.length][index] = value;
					if (index > this.#lastIndex) this.#lastIndex = index;
				}
			}
	

			globalThis.asyncFS = class extends disk {
				*getFileAsync(f) {
					let t = this.hash.hashStr(f)
					yield* this._loadFile(t)
					return this._getFile(t)
				}
				*setFileAsync(f, c) {
					let t = this.hash.hashStr(f)
					yield* this._loadFile(t)
					this._setFile(f, c)
				}
				*newFileAsync(p, n, c) {
					yield* this.loadFile(p)
					yield* this.loadFile(p + '/' + n)
					this.newFile(p, n, c)
				}
				*_loadFile(f) {
					while (!this._isFileLoaded(f)) {
						yield
					}
				}
				*loadFile(f) {
					yield* this._loadFile(this.hash.hashStr(f))
				}
				*forceSetFile(p, n, c) {
					yield* this.loadFile(p)
					yield* this.loadFile(p + '/' + n)
					if (this.isFileValid(p)) {
						this.setFile(p + '/' + n, c)
					} else {
						this.newFile(p, n, c)
					}
				}
				*setFileDefault(p, n, c) {
					yield* this.loadFile(p)
					if (!this.isFileValid(p)) {
						yield* this.loadFile(p + '/' + n)
						this.newFile(p, n, c)
					}
				}
			}
			globalThis.FS = new asyncFS(-1728)
	

			globalThis.JSON.loadFile = function* (f) {
				let v = yield* FS.getFileAsync(f)
				return JSON.parse(v)
			}
	

			globalThis.mountDrive = { threads: [], toUpload: toUpload, filesLoaded: false }
			toUpload = null
			mountDrive.threads.push(new Thread(function* () {
				let f = FS.hash.hashStr('dotOS')
				for (let i = 0; i < 3; i++) {
					api.getBlockId(f - 400000, FS.disk, 0)
					yield
				}
				try {
					FS._getFile(f)
				} catch {
					api.log('Drive not found, making new drive.')
					FS._setFile(f, '[]')
				}
				yield* FS.forceSetFile('dotOS', 'data', '[]')
				api.log('Drive mounted!')

			}))
			mountDrive.threads.push(new Thread(function* () {
				yield* threadLibs.waitUntil(() => (mountDrive.threads[0].idle))
				for (let i of mountDrive.toUpload) {
					yield* FS.forceSetFile('dotOS/data', i.name, i.contents)
				}
				mountDrive.filesLoaded = true
				api.log('Finished loading files!')
			}))
	

			dotOS.user = {
				id: myId,
				pos: [],
				cam: [1, 0, 0]
			}
			api.setCameraDirection(myId, [1, 0, 0])
			globalThis.dotOS.updateUserPositions = function () {
				globalThis.dotOS.user.pos = api.getPosition(dotOS.user.id)
			}
			globalThis.dotOS.updateUserCam = function () {
				let add = (a, b) => {
					return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
				}
				dotOS.user.cam = add(dotOS.user.cam, api.getPlayerFacingInfo(dotOS.user.id).dir)
			}
			globalThis.dotOS.handleUserInput = function () {
				dotOS.updateUserPositions()
				dotOS.updateUserCam()
				TS.setTimeout(dotOS.handleUserInput, 2)
			}
			dotOS.handleUserInput()
	

			dotOS.initDisplay = function*(){
				globalThis.Display = new class {
					constructor(res = [285, 125], colors){
						this.buffer = new BigArray(Array(res[0] * res[1]).fill(0))
						this.res = res
						this.colors = colors
					}
				}
				yield
				globalThis.display = new Display(285, 125)
			}
			let disp1 = new Thread(function*(){
				let m = yield* JSON.loadFile('dotOS/data/colors.json')
				globalThis.dotOS.htmlColors = {hex: new BigArray(m.hex), names: new BigArray(m.names)}
				m = null
			})
	

			globalThis.CFF = class {
				constructor() { }
				setModule() { }
			}
	
