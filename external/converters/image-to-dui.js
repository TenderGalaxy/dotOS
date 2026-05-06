import sharp from 'sharp'
import { writeFile , readdir } from 'node:fs/promises'
import process from 'process';
import { dirname } from 'node:path';
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

process.chdir(__dirname);
const hexes = [
    "#CD5C5C",
    "#F08080",
    "#FA8072",
    "#E9967A",
    "#FFA07A",
    "#DC143C",
    "#FF0000",
    "#8B0000",
    "#FFC0CB",
    "#FFB6C1",
    "#FF69B4",
    "#FF1493",
    "#C71585",
    "#DB7093",
    "#FF7F50",
    "#FF6347",
    "#FF4500",
    "#FF8C00",
    "#FFA500",
    "#FFD700",
    "#FFFF00",
    "#FFFFE0",
    "#FFFACD",
    "#FAFAD2",
    "#FFEFD5",
    "#FFE4B5",
    "#FFDAB9",
    "#EEE8AA",
    "#F0E68C",
    "#BDB76B",
    "#E6E6FA",
    "#D8BFD8",
    "#DDA0DD",
    "#EE82EE",
    "#DA70D6",
    "#FF00FF",
    "#FF00FF",
    "#BA55D3",
    "#9370DB",
    "#663399",
    "#8A2BE2",
    "#9400D3",
    "#9932CC",
    "#8B008B",
    "#800080",
    "#4B0082",
    "#6A5ACD",
    "#483D8B",
    "#7B68EE",
    "#ADFF2F",
    "#7FFF00",
    "#7CFC00",
    "#00FF00",
    "#32CD32",
    "#98FB98",
    "#90EE90",
    "#00FA9A",
    "#00FF7F",
    "#3CB371",
    "#2E8B57",
    "#228B22",
    "#008000",
    "#006400",
    "#9ACD32",
    "#6B8E23",
    "#6B8E23",
    "#556B2F",
    "#66CDAA",
    "#8FBC8B",
    "#20B2AA",
    "#008B8B",
    "#008080",
    "#00FFFF",
    "#00FFFF",
    "#E0FFFF",
    "#AFEEEE",
    "#7FFFD4",
    "#40E0D0",
    "#48D1CC",
    "#00CED1",
    "#5F9EA0",
    "#4682B4",
    "#B0C4DE",
    "#B0E0E6",
    "#ADD8E6",
    "#87CEEB",
    "#87CEFA",
    "#00BFFF",
    "#1E90FF",
    "#6495ED",
    "#4169E1",
    "#0000FF",
    "#0000CD",
    "#00008B",
    "#00008B",
    "#191970",
    "#FFF8DC",
    "#FFEBCD",
    "#FFE4C4",
    "#FFDEAD",
    "#F5DEB3",
    "#DEB887",
    "#D2B48C",
    "#BC8F8F",
    "#F4A460",
    "#DAA520",
    "#B8860B",
    "#CD853F",
    "#D2691E",
    "#8B4513",
    "#A0522D",
    "#A52A2A",
    "#800000",
    "#FFFFFF",
    "#FFFAFA",
    "#F0FFF0",
    "#F5FFFA",
    "#F0FFFF",
    "#F0F8FF",
    "#F8F8FF",
    "#F5F5F5",
    "#FFF5EE",
    "#F5F5DC",
    "#FDF5E6",
    "#FDF5E6",
    "#FFFFF0",
    "#FAEBD7",
    "#FAF0E6",
    "#FFF0F5",
    "#FFE4E1",
    "#DCDCDC",
    "#D3D3D3",
    "#C0C0C0",
    "#A9A9A9",
    "#808080",
    "#778899",
    "#708090",
    "#2F4F4F",
    "#000000"
].map(function (v) {
    let a = v[1] + v[2]
    let b = v[3] + v[4]
    let c = v[5] + v[6]
    return [parseInt(a, 16), parseInt(b, 16), parseInt(c, 16)]
})
function floydSteinberg(arr){
    const width = arr[0].length
    const height = arr.length
    for(let i = 0; i < height - 1; i++){
        for(let j = 1; j < width - 1; j++){
            let t = findClosestCode(arr[i][j])
            arr[i][j] = t[2]
           
            arr[i]  [j+1][0] += t[1][0] * 7/16
            arr[i+1][j+1][0] += t[1][0] * 1/16
            arr[i+1][j]  [0] += t[1][0] * 5/16
            arr[i+1][j-1][0] += t[1][0] * 3/16
            arr[i]  [j+1][1] += t[1][1] * 7/16
            arr[i+1][j+1][1] += t[1][1] * 1/16
            arr[i+1][j]  [1] += t[1][1] * 5/16
            arr[i+1][j-1][1] += t[1][1] * 3/16
            arr[i]  [j+1][2] += t[1][2] * 7/16
            arr[i+1][j+1][2] += t[1][2] * 1/16
            arr[i+1][j]  [2] += t[1][2] * 5/16
            arr[i+1][j-1][2] += t[1][2] * 3/16
        }
        arr[i][0] = findClosestCode(arr[i][0])[2]
        arr[i][width-1] = findClosestCode(arr[i][width-1])[2]
    }
    arr[width - 1] = arr[width - 1].map(i => findClosestCode(i)[2])
    return arr
}
function findClosestCode(hex){
    if(typeof hex == 'string'){
        if(hex.startsWith('#')){
            hex = hex.slice(1)
        }
        hex = [parseInt(hex[0] + hex[1], 16), parseInt(hex[2] + hex[3], 16), parseInt(hex[4] + hex[5], 16)]
    }
    let min = [Number.MAX_VALUE, undefined, undefined]
    for(let i = 0; i < hexes.length; i++){
        let diff = Math.abs(hexes[i][0] - hex[0]) + Math.abs(hexes[i][1] - hex[1]) + Math.abs(hexes[i][2] - hex[2])
        if(diff < min[0]){
            min = [diff, [hex[0] - hexes[i][0], hex[1] - hexes[i][1], hex[2] - hexes[i][2]], i]
        }
    }
    return min
}
const inputFiles = await readdir('./in')
for(let input of inputFiles){
    const width = 100, height = 100
    const image = sharp(`./in/${input}`).resize(width, height)
    const {data} =await image.raw().toBuffer({resolveWithObject: true})
    let grid = Array.from({length: height}, i => Array.from({length: width}, v => [undefined, undefined, undefined]))
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            grid[i][j][0] = data[(i * width + j)*3]
            grid[i][j][1] = data[(i * width + j)*3 + 1]
            grid[i][j][2] = data[(i * width + j)*3 + 2]
        }
    }
    grid = floydSteinberg(grid)

    let gridExport = Uint8Array.from(grid.map(i => i.map(v => hexes[v])).flat(2))
   sharp(gridExport, {
        raw: {
            width: width,
            height: height,
            channels: 3
        }
    }).png().toFile(`out/${input.slice(0, input.lastIndexOf('.'))}preview.png`)
    grid = grid.map(i => i.map(v => String.fromCodePoint(v + 70)).join('')).join('')
    grid = String.fromCodePoint(width + 70) + String.fromCodePoint(height + 70) + grid
    await writeFile(`./out/${input.slice(0, input.lastIndexOf('.'))}.dui`, grid)
}