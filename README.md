# child\_process\_with\_argv0

This module provides versions of child\_process' execFile and spawn which take a full arguments array, including the name of the program as the first argument. The functions in child\_process don't give you this option - they just tack the executed filename onto the front of the arguments list.

The following two lines do the same thing:

    child_process.execFile("/bin/ls", ["-a", "-l"], {}, console.log);
    child_process_with_argv0.execFile("/bin/ls", ["/bin/ls", "-a", "-l"], {}, console.log);

That's pointless, but unlike with child_process, you can provide a different value for the first argument. For instance, when you run "ls -a -l" at the command line, what your shell normally does is this:

    child_process_with_argv0.execFile("/bin/ls", ["ls", "-a", "-l"], {}, console.log);


## Warning

This module is a dodgy hack which tweaks some very specific Node.js internals. It should work on all 0.8.x at this time (0.8.11 being the current release).

## License

(The MIT License)

Copyright (c) 2012 Andrew Francis <<andrew@sullust.net>>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
