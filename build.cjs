/*
A better version of build.py
*/
fs = require('fs').promises
function orderArray(inp, req) {
    let arr = inp.slice()
    let out = []
    do {
        let cl = arr.length
        let nextArr = []
        for (let i = 0; i < arr.length; i++) {
            if (req[arr[i]].every(v => out.includes(v))) {
                out.push(arr[i])
            } else {
                nextArr.push(arr[i])
            }
        }
        if (nextArr.length == cl) {
            throw new Error(`
                Dependency error detected!
                    Requirements: ${req}
                    Current array: ${arr}
                    Current output: ${out}
            `)
        }
        arr = nextArr.slice()
    } while (arr.length > 0)
    return out
}
function str(x){
    return JSON.stringify(JSON.parse(JSON.stringify(x)))
}
async function main() {
    await fs.mkdir('./build', { recursive: true })
    world = {
        funcs: [],
        code: [],
        requirements: [],
        callbacks: []
    }
    code = {
        funcs: [],
        code: [],
        requirements: [],
        callbacks: []
    }
    let modules = await fs.readdir('./src/modules', { recursive: true })
    modules = modules.map((v) => './src/modules/' + v).filter(v => {
        if(v.includes('DNU')){
            return false
        }
        if(v.endsWith('.js')){
            return true
        }
        if(v.endsWith('.mjs')){
            return true
        }
        return false
    })
    for (let i of modules) {
        console.log(`Now loading ${i}!`)
        let obj = await import(i)
        obj = obj.default

        chosen = obj.info.type == 'worldcode' ? 'world' : 'code'
        let name = obj.info.name
        globalThis[chosen].funcs.push(name)
        let m = obj.onLoad.toString()
        globalThis[chosen].code[name] = m.slice(m.indexOf('{') + 1, m.lastIndexOf('}'))
        globalThis[chosen].requirements[name] = obj.info.requirements
        for (let [j, k] of Object.entries(obj.callbacks)) {
            let m = k.toString()
            globalThis[chosen].callbacks.push({ call: j, val: m.slice(m.indexOf('{') + 1, m.lastIndexOf('}')) })
        }
    }
    world.funcs = orderArray(world.funcs, world.requirements).map(v => world.code[v])
    code.funcs = orderArray(code.funcs, code.requirements).map(v => code.code[v])
    let wbuild = world.callbacks.map(function (a) {
        return `dotOS.callbacks.${a.call}.push(function(){${a.val}})`
    }).join('\n')
    let cbuild = code.callbacks.map(function (a) {
        return `dotOS.callbacks.${a.call}.push(function(){${a.val}})`
    }).join('\n')
    const notice = `
/**
    * Notice
    * DotOS - a faux-operating-system for Bloxd
    * by fenll/tendergalaxy (2026)
    * 
    * Licensed under the GNU General Public License V3
    * This means that if you change this project and make your own off of this code,
    * you have to also make your code licensed by GNU GPL V3!
    * 
    * If you use Malus or another code-copier to steal this code and not put it under GPL V3, this will make me, (fenl), very sad!
    * Please do not delete this notice, or it will also make me very sad :(
*/
    `
    let worldContents = notice + 'dotOS = {}\n' + world.funcs.join('\n') + '\n' + wbuild
    let codeContents = notice + code.funcs.join('\n') + '\n' + cbuild
    await fs.writeFile('./build/worldcode.cjs', worldContents)
    await fs.writeFile('./build/codeblock.cjs', codeContents)
    let data = await fs.readdir('./src/data/', { recursive: true })
    let dataContents = 'toUpload = []\n'
    for (let i of data) {
        let contents = await fs.readFile('./src/data/' + i, { encoding: 'utf8' })
        let obj = {
            name: i,
            contents: contents
        }
        dataContents += `toUpload.push(${str(obj)})\n`
    }
    await fs.writeFile('./build/files.cjs', dataContents)
    let header = await import('./src/header.js')
    header = header.default.func.toString()
    header = header.slice(header.indexOf('{') + 1, header.lastIndexOf('}'))
    await fs.writeFile('./build/TEST_unified.cjs', header + '\n' + worldContents + '\n' + dataContents + '\n' + codeContents)
}
main()