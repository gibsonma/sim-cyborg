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
Open [server]:3000/SpecRunner.html in a browser and the results of all present tests will be displayed on the screen. Source code is found in /src and the specifications for the tests themselves are found in /spec.
[server] here refers to where you have deployed the project. Generally a url like http://localhost:3000 will suffice to load up the index page.

##Week 0
Feature - Displaying global variables
This can be verified by running the test to check that the file is present and is valid json. In addition, its appearence on screen also verifies that this feature work correctly.

##Week 1
Feature - Process Simulator
This can be verified by running the associated tests and examining the console output when the game state changes

Currently the console outputs json representing the game state, which looks something like below:

*Initial State:
{"sites":[{"name":"Site 1","coordinates":0,"culture":{},"num_staff":5,"effort":2,"working_on":[{"name":"write backend","tasks":[{"name":"write model","assigned":2,"completed":0,"total":30},{"name":"write view","assigned":2,"completed":0,"total":25},{"name":"write controller","assigned":1,"completed":0,"total":35}]}],"development_type":"Agile"}],"current_time":0,"problems":[],"finance":0,"modules":[{"name":"write backend","tasks":[{"name":"write model","assigned":2,"completed":0,"total":30},{"name":"write view","assigned":2,"completed":0,"total":25},{"name":"write controller","assigned":1,"completed":0,"total":35}]}]}

*Updated State
{"sites":[{"name":"Site 1","coordinates":0,"culture":{},"num_staff":5,"effort":2,"working_on":[{"name":"write backend","tasks":[{"name":"write model","assigned":2,"completed":6,"total":30},{"name":"write view","assigned":2,"completed":6,"total":25},{"name":"write controller","assigned":1,"completed":3,"total":35}]}],"development_type":"Agile"}],"current_time":0,"problems":[],"finance":0,"modules":[{"name":"write backend","tasks":[{"name":"write model","assigned":2,"completed":6,"total":30},{"name":"write view","assigned":2,"completed":6,"total":25},{"name":"write controller","assigned":1,"completed":3,"total":35}]}]} 

As seen below, for each site there is a number of tasks, in the "tasks" field of the json object. To show that progress has happened, we simply look at the "completed" field for each task and see that it has advanced.

##Week 2
Feature - Default game scenarios
This can be verified by viewing the main page of the simulation (index.html or navigating to localhost:3000), and clicking one of the scenario buttons on the top of the screen. Currently the game will initialise to scenario 1 on game load, but a user can restart the simulation by clicking any of the three scenario buttons.

Feature - Display of game state and module progress
Clicking the button to the left of the scenario buttons on the main simulation page will toggle between preset constants and the increasing progress of the game state.

Feature - Problem Simulator
Currently this system only assigns problems to tasks, but these problems do not negatively impact progress. Regardless, navigating to specrunner.html as described above will show tests pertaining to the assignment of problems to tasks.

Feature - Final Score
Final Score is displayed at the end of the game.
