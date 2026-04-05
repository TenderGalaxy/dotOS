function* t(data){
    let m = yield* FS.getFileAsync(data)
    return JSON.parse(m)
}
return new Thread(t, 'jsonHelperClone', data)