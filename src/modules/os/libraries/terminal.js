export default {
    info: {
        name: 'terminal',
        type: 'os',
        requirements: []
    },
    onLoad(){
        new Thread(function*(){
            let Terminal = class {
                constructor(){
                    this.cwd = 'dotOS'
                }
                *runc(cmd){
                    cmd = cmd.split(' ')
                    yield* this[cmd[0]](cmd.slice(1))
                }
                *ls(){
                    let f = yield* FS.getFileAsync(this.cwd)
                    api.log(JSON.parse(f).map(i => i.name).join(', '))
                }
                *cd(pl){
                    this.cwd += '/' + pl
                }
            }
            yield* thl.require('drive')
            globalThis.terminal = new Terminal()
            thl.send('terminal')
        }())
    },
    callbacks: {}
}