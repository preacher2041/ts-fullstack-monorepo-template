/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')

// Monkey-patch fs.rmdirSync for Node 25 compatibility
const originalRmdirSync = fs.rmdirSync
fs.rmdirSync = function (p, options) {
	if (options && options.recursive) {
		return fs.rmSync(p, { recursive: true, force: true })
	}
	return originalRmdirSync.apply(this, arguments)
}

// Monkey-patch fs.promises.rmdir as well
if (fs.promises && fs.promises.rmdir) {
	const originalRmdirPromise = fs.promises.rmdir
	fs.promises.rmdir = function (p, options) {
		if (options && options.recursive) {
			return fs.promises.rm(p, { recursive: true, force: true })
		}
		return originalRmdirPromise.apply(this, arguments)
	}
}
