sim-cyborg
==========

A final year group project for the D-Cyborg Team

To run, execute ./start_server.sh in the root directory. The main project page can then be accessed in a web browser at "localhost:3000"

NB. There may be a bug on some linux installations where forever cannot find nodejs. This can be worked around by running 'nodejs server.js'

###Config

Global variables which are not typically changed from game to game are stored in Sim/data/config_file.json. 

###Requires:
* node.js - Web server

(Development carried out using nodejs v0.10.15)

###Requires node packages:
* express - Web application framework
* forever - Keep a script running continually

###Installing Dependencies
* node.js - http://nodejs.org/
* express - Use npm (https://www.npmjs.org/) npm install express
* forever - npm install forever

###To Run tests:
Open localhost:3000/SpecRunner.html in a browser and the results of all present tests will be displayed on the screen. Source code is found in /src and the specifications for the tests themselves are found in /spec.


###List of Features and their usage:
* Process Simulator: This runs in the background and controls all development and progress on modules, this can be viewed whenever a scenario is selected. Sites and time progress, which drives the other features.
* Default Scenarios: These are presented to the user once the application is loaded, and allow for an easy setup for predefined scenarios that show off the application without any user input immediately required.
* Problem Simulator and Intervention interface: The problem simulator and intervention interface are closely tied together, and as a result fall under the same heading - problems are generated by the simulation and added to a site, which then allows notifications for the intervention interface to be displayed on the frontend. A list of interventions is then displayed to the user, none of which have an immediate impact but will reduce the probability of further problems of the same domain reoccuring.
* Status Display: Each site has a traffic light style status update which changes colour based on progress, and also displays basic information about each site.
* Inquiry Interface: The inquiry interface is a series of options, on a per site basis, which allow the user to explore a site in detail, to effectively decide if a site is accurately reporting their progress. Each option has an associated cost.
* Cultural Influenced Reporting: Not every site will report information accurately, based on cultural influences predefined by the literature in the backlog. This can be seen when an asian site is reporting all green, and the user visits to see that the site may not actually be on track with it's progress.