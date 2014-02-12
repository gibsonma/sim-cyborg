sim-cyborg
==========

A final year group project for the D-Cyborg Team

To run, execute ./start_server.sh in the root directory. The main project page can then be accessed in a web browser at port 3000

NB. There may be a bug on some linux installations where forever cannot find nodejs. In the short term this can be fixed by running 'nodejs server.js'

###Requires:
* node.js

###Requires node packages:
* express
* forever

###To Run tests:
Open [server]:3000/tests/SpecRunner.html in a browser and the results of all present tests will be displayed on the screen. Source code is found in /src and the specifications for the tests themselves are found in /spec.

##Week 0
Feature - Displaying global variables
This can be verified by running the test to check that the file is present and is valid json. In addition, its appearence on screen also verifies that this feature work correctly.
