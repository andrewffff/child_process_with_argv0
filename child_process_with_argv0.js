/**
 * See README.md for the what/why.
 *
 * Dodgy stuff in here to provide versions of execFile and spawn
 * which accept a custom argv[0], instead of always using the executed
 * filename. The underlying functions called by libuv (execv* for Unix-like
 * and CreateProcess for Windows) support this but child_process doesn't
 * expose it.
 *
 * The child_process code does this:
 *   args = args ? args.slice(0) : [];
 *   args.unshift(file);
 *
 * Further down the road, node's C++ code has this test around the loop
 * which extracts args:
 *
 *   if (!argv_v.IsEmpty() && argv_v->IsArray()) {
 *
 * So we call the child_process functions with a dodgy array with some
 * overwritten members which:
 *
 *   - patch themselves into the new "args" resulting from the slice call
 *   - make the .unshift do nothing
 *   - don't involve a new class (inheriting from Array makes
 *       the argv_v->IsArray() check fail)
 */

var child_process = require('child_process');

function makeArrayWithNoopUnshift(a) {
	if(!a || !a.length)
		throw Error('child_process_with_full_argv functions require at least one arguments');

	// take a copy
	a = a.slice(0);

	a.unshift = function() {;};

	a.slice = function(begin,end) {
		var r = Array.prototype.slice.call(this,begin,end);
		r.unshift = this.unshift;
		r.slice = this.slice;
		return r;
	}

	return a;
}

exports.execFile = function(file,args,options,callback) {
	return child_process.execFile(file, makeArrayWithNoopUnshift(args), options, callback);
}

exports.spawn = function(file,args,options) {
	return child_process.spawn(file, makeArrayWithNoopUnshift(args), options);
}


