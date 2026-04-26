export default {
    info: {
        name: 'utils',
        type: 'os',
        requirements: ['async']
    },
    onLoad() {
        /**
         * Check if we are running within Bloxd.io or Node.js
         * @returns {boolean} - True if we are running within Bloxd.io
         */
        globalThis.isBloxd = function() {
            return !(globalThis.process)
        }
        /**
         * Repeatedly parse a string until it turns into an object.
         * @param {string} v - Input
         * @returns {} - Output
         */
        globalThis.Parse = function(v) {
            while (typeof v == 'string') {
                v = JSON.parse(v)
            }
            return v
        }
        /*if (isBloxd()) {
            function scopify(t, name = 'globalThis') {
                let values = {}
                for (let i of Object.keys(t)) {
                    if (typeof t[i] == 'object' && !['api', 'fti', 'console', 'Date'].includes(i)) {
                        scopify(t[i], `${name}.${i}`)
                    }
                }
                let proto = Object.getPrototypeOf(t)
                let handler = new Proxy(Object.create(proto), {
                    set(target, p, newValue, receiver) {
                        let setValue = newValue.type ? { ...newValue } : {
                            val: newValue,
                            type: new Set([typeof newValue]),
                            toString() { return String(this.val) }
                        }
                        if (typeof setValue.type == 'string') setValue.type = [newValue.type]
                        if (Array.isArray(setValue.type)) setValue.type = new Set(setValue.type)
                        if (!setValue.typeNow) {
                            if (setValue.type.size == 1) {
                                setValue.typeNow = setValue.type.values().next().value
                            } else {
                                setValue.typeNow = typeof setValue.val
                            }
                        }
                        let isSubset = (b, a) => [...a].every(value => b.has(value))
                        if (!(setValue.type.has(setValue.typeNow))) {
                            api.log(`Warning: ${name}.${p} has changed from ${values?.[p]?.typeNow} to ${setValue.typeNow}: Not in standard ${setValue.typeNow}`)
                        }
                        if (values[p] && !isSubset(values[p].type, setValue.type)) {
                            api.log(`Warning: struct of ${name}.${p} has changed from ${[...values[p].type]} to ${[...setValue.type]}`)
                        }
                        let conf = fti.type[setValue.typeNow](setValue.val)
                        if (conf !== true) {
                            api.log(`Warning: ${name}.${p} does not conform to ${setValue.typeNow} standard.`)
                            if (conf !== false) {
                                api.log(conf)
                            }
                        }
                        if (values?.[p]?.type) setValue.type = new Set([...setValue.type, ...values[p].type])
                        values[p] = setValue
                        if (setValue.typeNow == 'object') {
                            scopify(setValue.val, name + '.' + p)
                        }
                        return false
                    },
                    get(targ, p, receiver) {
                        return values[p]?.val || values[p]
                    }
                })
                Object.setPrototypeOf(t, handler)
            }
            globalThis.fti = {
                type: {
                    // core types
                    number(v) {
                        return typeof v == 'number'
                    },
                    string(v) {
                        return typeof v == 'string'
                    },
                    object(v) {
                        return typeof v == 'object'
                    },
                    boolean(v) {
                        return typeof v == 'boolean'
                    },
                    bigint(v) {
                        return typeof v == 'bigint'
                    },
                    symbol(v) {
                        return typeof v == 'symbol'
                    },
                    any() {
                        return true
                    },
                    // js structures
                    array(v) {
                        return Array.isArray(v)
                    }
                },
                defineStruct(name, struct) {
                    fti.type[name] = function (val) {
                        for (let i of Object.keys(struct)) {
                            if (!val[i]) {
                                return `Error: ${name}.${i} does not exist!`
                            }
                            if (!struct[i](val[i])) {
                                return `Error: ${name}.${i} is incorrectly of type ${val[i].type || typeof val[i]}!`
                            }
                        }
                    }
                }
            }
            scopify(globalThis)
        }*/
    },
    callbacks: {}
}

/*
*/