# dotOS
A multithreaded modularized Operating System for Bloxd.io that simplifies codeloading, FS, and data uploading and downloading.


## Building the OS
1. Clone this repository:
```bash
git clone https://github.com/TenderGalaxy/dotOS
```
2. Build the repository into bloxd code:
```bash
./dotOS/pull.sh -u
```
**Command-line options**
- -u : Hard-reset the folder to the main branch.
- -e : Start up a virtual dotOS environment.
- -h : Open the documentation
  
Due to my bad coding skill, only one option can be selected at a time. Sorry!

## Info
The code is JSDoc-ifiable.

## Structure

src : Source code

    data : Data that DotOS uses

        filetypes/impl : Implementations of filetypes

    modules : DotOS Modules

        worldcode : Worldcode

        os : Codeblock

            actions : Daemons

            libraries : Libraries

        info.txt : Information

external: External scripts

    converters : Converters from standard formats to DotOS-friendly formats

        test : Test files

        in : Input to converters

        out : Output from converters

        *.js : Converters

    api.js : API Implementation

    callbacks.json : Callbacks

    main.cjs : Main launcher

    testscript.cjs : Test script
