
var child_process = require('child_process'),
	child_process_with_argv0 = require('../child_process_with_argv0.js'),
	assert = require('assert'),
	util = require('util'),
	path = require('path');


var testsRun = 0;

function testOutput(module, useExecFile, filename, args, expectedOutput) {
	var context = 'testOutput' + util.inspect(testOutput.arguments);

	function compareContent(actualOutput) {
		var data;
		try {
			data = JSON.parse(actualOutput);
		} catch(e) {;}

		if(!Array.isArray(data))
			throw Error("couldn't parse program output as json - " + context);

		assert.deepEqual(data, expectedOutput, "output not as expected - " + context);

		++testsRun;
	}

	if(useExecFile) {
		module.execFile(filename, args, null, function(err,stdout,stderr) {
			if(err)
				throw Error("couldn't run process - " + context);
			if(stderr)
				throw Error("stderr not empty - " + context);
			
			compareContent(stdout);
		});
	} else {
		var p = module.spawn(filename, args);

		var output = '';
		p.stdout.setEncoding('utf8');
		p.stdout.on('data', function(d) {
			output += d;
		});
		p.stdout.on('end', function() {
			compareContent(output);
		});

		p.stderr.on('data', function() {
			throw Error("stderr not empty - " + context);
		});
	}
}


// Make sure we have argv_as_json. Use path.resolve to avoid issues with "./a.out" versus "a.out"
var prog = path.resolve('argv_as_json');

child_process.execFile(prog, [], null, function(err,stdout,stderr) {
	// run all the other tests after this check
	if(err || stderr || !stdout)
		throw Error("Could not run ./argv_as_json successfully. Maybe you need to compile args_as_json.c?");

	// node's child_process (and argv_as_json) should behave!
	testOutput(child_process, true, prog, [], [prog]);
	testOutput(child_process, false, prog, [], [prog]);
	testOutput(child_process, true, prog, ['-a', '-b'], [prog, '-a', '-b']);
	testOutput(child_process, false, prog, ['-a', '-b'], [prog, '-a', '-b']);
	
	// supply argv0 explicity
	testOutput(child_process_with_argv0, true, prog, [prog], [prog]);
	testOutput(child_process_with_argv0, false, prog, [prog], [prog]);
	testOutput(child_process_with_argv0, true, prog, [prog, '-a', '-b'], [prog, '-a', '-b']);
	testOutput(child_process_with_argv0, false, prog, [prog, '-a', '-b'], [prog, '-a', '-b']);
	
	// supply a completely-made-up argv[0], should still work
	testOutput(child_process_with_argv0, true, prog, ['dne'], ['dne']);
	testOutput(child_process_with_argv0, false, prog, ['dne'], ['dne']);
	testOutput(child_process_with_argv0, true, prog, ['dne', '-a', '-b'], ['dne', '-a', '-b']);
	testOutput(child_process_with_argv0, false, prog, ['dne', '-a', '-b'], ['dne', '-a', '-b']);
	
	// don't accept empty argv[0]
assert.throws(function(){
	testOutput(child_process_with_argv0, true, prog, [], [prog]);
});
assert.throws(function(){
	testOutput(child_process_with_argv0, false, prog, [], [prog]);
});

		
// don't accept missing argv[0]
assert.throws(function(){
	testOutput(child_process_with_argv0, true, prog, undefined, [prog]);
});
assert.throws(function(){
	testOutput(child_process_with_argv0, false, prog, undefined, [prog]);
});
});

		
process.on('exit', function() {
	assert.equal(testsRun, 12);
	console.log('tested ok');
});

	
	
