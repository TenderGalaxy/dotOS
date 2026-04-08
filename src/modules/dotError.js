export default {
	info: {
		name: 'dotError',
		type: 'worldcode',
		version: '1.0.0',
		source: 'github.com/tendergalaxy/dotOS/blob/main/src/modules/dotError.js',
		requirements: []
	},
	onLoad() {
		/**
		 * @namespace dotError
		 */
		class dotErr {
			constructor() { }
			/**
			 * Test a string of code.
			 * @param {string} code 
			 * @param  {...any} args 
			 * @returns {*|undefined} Return value of the code, or undefined if there is an error.
			 */
			try(code, ...args) {
				this.point = ''
				this.src = code.split(/[\n;]+/)
				try {
					return new Function(code)(...args)
				} catch (e) {
					this.e = e
					this.point = +e.stack.split(' ')[6].slice(9).replace(')\n', '') - 3
					return undefined
				}
			}
			/**
			 * Try a function.
			 * @memberof dotError
			 * @param {string} code 
			 * @param  {...any} args 
			 * @returns {*|undefined} Return value of the code, or undefined if there is an error.
			 */
			tryFunction(code, ...args) {
				this.point = ''
				this.src = code.toString().split(/[\n;]+/)
				try {
					return (code)(...args)
				} catch (e) {
					this.e = e
					this.point = +e.stack.split(' ')[6].slice(9).replace(')\n', '') - 1
					return undefined
				}
			}
			/**
			 * Log an error.
			 * @memberof dotError
			 */
			log() {
				if (this.point === '') {
					api.broadcastMessage('No Errors Found!', { color: 'red' })
					return
				}
				let m = this.e.stack.split('\n')
				m = Array.from(m, (x) => x.slice(4)).slice(0, m.length - 4)
				api.broadcastMessage([{ str: `Line ${this.point}: ${this.e.message}\n`, style: { color: 'orange' } },
				{ str: `>| ${this.src[this.point]}\n`, style: { color: 'lightblue' } },
				{ str: m.join('\n'), style: { color: 'orange' } }])
			}
			/**
			 * Check if there was an error.
			 * @memberof dotError
			 * @returns {boolean} - Whether or not an error happened
			 */
			hasError() {
				return this.point !== ''
			}
		}
		globalThis.dotError = new dotErr()
	},
	callbacks: {

	}
}