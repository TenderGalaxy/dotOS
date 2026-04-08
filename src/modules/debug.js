export default {
    info: {
        name: 'debug',
        type: 'worldcode',
        version: '1.0.0',
        requirements: []
    },
    onLoad(){
        /**
         * @namespace debug
         */
        globalThis.debug = {
            debug: [],
            /**
             * Log a debug message
             * @memberof debug
             * @param {...any} args - Any arguments
             */
            log(){
                debug.debug.push(arguments)
            },
            /**
             * @memberof debug
             * Show all debug messages
             */
            show(){
                for(let i = 0; i < debug.debug.length; i++){
                    api.log(`D#${i}: ${debug.debug[i]}`)
                }
            }
        }
    },
    callbacks: {}
}