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
    let modules = await fs.readdir('./src/modules')
    modules = modules.map((v) => './src/modules/' + v)
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
        for (let [i, j] of Object.entries(obj.callbacks)) {
            let m = j.toString()
            globalThis[chosen].callbacks.push({ call: i, val: m.slice(m.indexOf('{') + 1, m.lastIndexOf('}')) })
        }
    }
    world.funcs = orderArray(world.funcs, world.requirements).map(v => world.code[v])
    code.funcs = orderArray(code.funcs, code.requirements).map(v => code.code[v])
    let wbuild = world.callbacks.map(function(a){
        return `dotOS.callbacks.${a.call}.push(function(){${a.val}})`
    }).join('\n')
    let cbuild = code.callbacks.map(function(a){
        return `dotOS.callbacks.${a.call}.push(function(){${a.val}})`
    }).join('\n')

    let worldContents =  'dotOS = {}\n' + world.funcs.join('\n') + '\n' + wbuild
    let codeContents = code.funcs.join('\n') + '\n' + cbuild
    await fs.writeFile('./build/worldcode.cjs', worldContents)
    await fs.writeFile('./build/codeblock.cjs', codeContents)

    let data = await fs.readdir('./src/data/')
    let dataContents = 'toUpload = []\n'
    for(let i of data){
        let contents = await fs.readFile('./src/data/' + i)
        dataContents += `toUpload.push({name: '${i}', contents: JSON.stringify(${contents})})\n`
    }
    await fs.writeFile('./build/files.cjs', dataContents)
    let header = await import('./src/header.js')
    header = header.default.func.toString()
    header = header.slice(header.indexOf('{') + 1, header.lastIndexOf('}'))
    await fs.writeFile('./build/TEST_unified.cjs', header + '\n' + worldContents + '\n' + dataContents + '\n' + codeContents)
}
main()