new Thread(function*(){
    /*yield* thl.require('screen')
    yield* thl.require('window')
    let win = new Win([100,100], [0,0])
    win.shadeOutlines(0)
    win.drawString([2,2], 'Hello World!'.repeat(8))
    yield* win.render()
    display.drawDisplay()
    yield* thl.waitUntil(() => display.isIdle())
    api.terminalDrawScreen()*/
    yield* thl.require('terminal')
    yield* terminal.cd('data/display')
    yield* terminal.runc('ls')
}())