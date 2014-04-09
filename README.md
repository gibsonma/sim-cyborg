 sim-cyborg
==========

A final year group project for the D-Cyborg Team

To run, execute ./start_server.sh in the root directory. The main project page can then be accessed in a web browser at "localhost:3000"

NB. There may be a bug on some linux installations where forever cannot find nodejs. This can be worked around by running 'nodejs server.js'

###Config

Global variables which are not typically changed from game to game are stored in Sim/data/config_file.json. 
Details of the config file are given at the end of this README.

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

###Release 1

####Master Config - Feature 17
#####Description
See bottom of README
#####How to Evaluate
See bottom of README
####Process Simulator - Feature 9
#####Description
This runs in the background and controls all development and progress on modules, this can be viewed whenever a scenario is selected. Sites and time progress, which drives the other features. Sites also only work for 8 hours a day (this can be changed in the master config), within their own appropriate time zone.
#####How to Evaluate
After selecting a management style and picking a scenario to use you will see your sites appear and start working on their assigned tasks. You will also see the time progress at the bottom of the screen.
####Status Display - Feature 6
#####Description
After selecting a management style and picking a scenario the simulation will start. Each site will have an associated tile which will be coloured green at the start of the simulation. As the game progresses these tiles may change to yellow or red depending on the current state of the site. 
#####How to Evaluate
If a problem is ignored then there is a chance that a site's tile will turn red, indicating that the site has experienced a critical problem. In addition, the degree to which the site is on schedule is displayed on each site tile, ranging from a site begin on, behind or ahead of schedule. As a site falls behind schedule its site tile will change from green to yellow to reflect this.
####Default Scenarios - Feature 20
#####Description
The default scenarios allow the player to quickly select one of three predefined simulation modes without having to define which sites they have, what modules to work on etc. Upon selecting a scenario the details of said scenario will be presented to the user, detailing which sites are present in the scenario, the development method used, how many workers are at each site and what modules are being worked on.
#####How to Evaluate
Clicking different scenarios changes how the simulation plays. Choosing the global scenario gives the player 3 sites, New York, Shanghai and Dublin while picking the Waterfall scenario gives Poland and Dublin. The fast scenario is mainly used for testing purposes, giving the same sites as the global scenario. Each scenario also lasts for differing amounts of time, with the fast scenario only lasting for 3 days for example.
####End of Game Report - Feature 14
#####Description
This is the report that is shown to the player at the end of a simulation. It details how the simulation went, giving actual and estimated running time, revenue and productivity.
#####How to Evaluate
The end of game report appears at the end of each simulation. To view it quickly select the fast scenario as this only lasts 3 days. Below is an explanation of each item in the report and how it is calculated.

* Final Score
    * This is calculated using a given formula (see end of README).
* Expected Project Length
    * This uses the nominal schedule calculater which takes the total effort needed to complete all the tasks and how much a developer can optimally do in one day and calculates how long the project should take in theory. This does not factor in any problems that happen or anything else that may effect worker productivity or the effort to complete one or more tasks.
* Actual Project Length
    * Once the simulation starts a counter is used to record how many days go by as the simulation runs. Once the simulation ends this counter is stopped, giving the actual length of the project. 
* Starting Capital
    * This is defined in the config file (See end of README).
* Capital Remaining
    * This represents how much money the player has left. If it goes below 0 then it represents how much the player overspent by. As the simulation runs, costs crop up such as fixing problems for example. All these costs are deducted from the player's capital and the number at the end of the simulation is the capital remaining.
* Total Workers
    * Each site has a certain number of workers, this figure is gotten by adding up all the workers across all the sites in the simulation.
* Expected Expenditure
    * This represents the amount of capital that needs to be spent in order to complete all the tasks. This does not take into account additional costs for fixing problems or the like.
* Actual Expenditure
    * This represents the actual amount of capital spent through the length of the simulation. It is calculated by summing all the costs incurred throughout the simulation.
* Expected Revenue
    * 
* Actual Revenue
    * 


####Nominal Schedule Calculator - Feature 5
#####Description
Computes the schedule of the entire project taking waterfall and agile development methodologies into account. It allows the player to see if a task, module, site or project is behind cased on the current time. 

The schedule calculator intelligently recognises that in waterfall modules will be waiting on the longest module to finish each task and accounts for this in the estimation. It also recognises that in waterfall a module that is delayed may not be be behind schedule, if that module is not the longest module and does not delay the project as a whole. 

In agile it recognises that if  a module is finished but is waiting on other modules to finish that it is not behind schedule. 

The schedule calculator is used to display the status of sites, modules and tasks, is used to estimate the days remaining in a project, and is used in the end of game screen to calculate final game score, revenue, the expected project length and the expected expenditure.
#####How to Evaluate
As the simulation is running, the player can see how well each site is doing with regard to their schedule, as the status is displayed on the tile, telling the player if the site is ahead/behind and also by how far.

####Game Score Calculator - Feature 3
#####Description
This feature calculates the final game score shown in the end of game report. It does this by taking into account the player's budget and their revenue.
#####How to Evaluate
Each time a simulation is run the final score will be different due to differences encountered during the simulation. If you take the values needed for the formula and apply them you will see that the result is equal to the final score being produced.

####Module Completion Calculator - Feature 8
#####Description
This feature applies a 25% variance on each task's effort in the simulation to ensure that each run of the simulation is different by varying the time needed to complete each task.
#####How to Evaluate
This can be seen by running the simulation and inspecting a site. The player will see a list of the tasks with how completed they are out of how much effort in total they require. Each run of the simulation will yield different effort totals so that each tasks will take differing amounts of time to complete each simulation.

####Problem Simulator - Feature 11
#####Description
As the simulation progresses problems will randomly happen to tasks. These problems will cause the task to lose some or all of its work, putting the site its associated with behind schedule.
#####How to Evaluate
There is a setting in the config file to adjust how frequently problem occur (see end of README). As the simulation progresses the player will receive a message that a problem has occurred in a particular task at a particular site. They will then be informed of the associated cost to fix the problem and avoid the progress reduction. The player can then ignore this, not pay anything and take the progress hit or they can pay the cost and remain on schedule.

####Intervention Interface - Feature 16
#####Description
Allows the player to spend money on “Interventions” to reduce the chance of problems happening. These can be accessed by clicking the “Buy Interventions” button at the top of the game. 
#####How to Evaluate
This feature can be evaluated by viewing the “Buy Interventions” tab at the top of the screen, next to the scenario choices. Once accessed, this menu will display multiple options for interventions as well as an associated cost. Upon purchasing an intervention the benefits associated with be applied to the simulation and as a result the development process will be smoother.

####Culture Influenced Reporting - Feature 15
#####Description
This feature affects how different sites report their progress. Each site has an associated culture, with Asian and Russian cultures always reporting that a site is on schedule if asked. Therefore, in order to find out how these sites are really doing the player must visit them at a cost which will then display the actual progress values. In addition to visiting a site a player can query a site with regards to its schedule, its current status and its morale (see Morale Feature).
#####How to Evaluate
There are two steps to evaluating this feature, one of which uses the inquiry interface mentioned below, and one uses the “traffic light” system which is displayed on the site tile view. To evaluate this feature using the latter method the user simply needs to view a site with Asian or Russian cultural influences over time, and the user can verify that each site with these influences will never change even if problems with the site occur over time.

This can be examined in more detail by inspecting the site using the inquiry interface - the operation of which is detailed below. However, each Asian or Russian site will only report accurately on a direct site visit, or when explicitly asked for a list of completed modules/tasks. 

####Inquiry Interface - Feature 7
#####Description
Allows the player to view the current progress a site had made on all its associated tasks in order to gauge progress. The user has two ways of doing this, they can send an email, though if the site is Asian or Russian the information may not be accurate. Alternatively the player can visit a site at a cost to view the site’s progress. This is always accurate, irrespective of the site’s culture.
#####How to Evaluate
The user may select each button on the site tile to perform various inquires to the progress of the site. Some of these options are culturally influenced as described in the above feature (Feature #15), and many of which have an associated cost as displayed as part of the interface. To verify each function works the user is presented with a pop up displayed the relevant information requested.

###Release 2

####Office Cam - Feature 20
#####Description
This feature allows the player to see the current state of a site through the medium of an  animated sprite. This sprite has an expression which will chance based on the morale of the site and if it is behind schedule or not.
#####How to Evaluate
As the site’s morale changes the facial expression/mood of the sprite displayed on the tile view changes.
There are also unique sprites for each site so each sprite does not share morale with the other sites.


####Site Morale - Feature 31
#####Description
Each site has a morale value which reflects how motivated the site is. The player can do things such as hold a party or organise a fun office excursion to increase a site's morale. However, repeated use of such activities will render them less effective at boosting morale. 

In addition, trying to raise the morale of a site that already has high morale is less effective than trying to raise the morale of a site where it is low. Morale is lost when problems occur and money is spent to correct them, tiring out the site's workers, though ignoring problems, while not giving an immediate drop in morale will increase the chances of the site's morale from dropping over time. 

Morale is directly linked to a site's productivity. If a site is at 80% morale then it will work at 80% of its normal speed. Alternatively, if a site's morale is at 120% then it will work 20% faster than normal. In this way it is possible to recover a behind schedule site by boosting their morale to above 100 at a cost. 

Finally, the morale of a site changes every day by +/- 1 based on whether or not the site is ahead/behind schedule

#####How to Evaluate
Much like the module completion calculator (Feature 8), each site’s morale is given a 25% variance at the start of the simulation to make sure that every run through is different. The baseline for a site’s morale is 100 and this goes up and down to maximum and minimums defined in the config file (see end of README). 

The player can inspect a site to view a site’s morale which is given as a percentage. Like task progress this will always give the accurate value. Alternatively, the player can call the site for free but that much like culture influenced reporting (feature 15) Asian and Russian sites will always report that morale is great if asked in this way. Upon calling a site, players can then choose to increase morale by buying things like pizza or setting up morale classes. These have an instant impact on that site’s morale.
Each site’s morale will fluctuate each day, going up if morale is good or the site is ahead of schedule, with it more likely to go down if morale is low, problems are ignored and the site is behind schedule.

Finally, as mentioned previously, a site’s morale directly impacts the worker’s productivity, low morale will cause site’s to work slowly and this can be seen as sites will start to fall behind schedule if morale is not kept high.

####Motivational Interventions - Feature 32
#####Description
This feature gives the player the ability to increase the morale of a site by purchasing morale interventions for the site. These come in the form of buying pizza or organising morale classes which will give an instant boost to the selected site’s morale but come at a cost. In addition, repeated use of the same intervention at a site will reduce its effectivness so if the player keeps buying pizza for a site, eventually the morale boost that it gives will diminish. The rate that the morale degrades in this fashion is given by a value in the config file (see end of README). All of the interventions are defined in the config file (see end of README).

#####How to Evaluate
During the simulation the player can call a site to check its morale, an option displayed on each site’s tile, which displays the current site’s morale and a list of interventions. While the value of the morale is displayed as a percentage in the inspect site screen, linguistic terms are used for when the player calls the site. These range from Terrible to Great. The player can then purchase these interventions and will see an increase in the site’s morale if the player then inspects the site, though they may not see a change in the linguistic variable used as these have ranges, so a change will only be registered if the moral intervention boosted the morale over the current linguistics variable’s range.

####One time  Interventions - Feature 33
#####Description
Allows the player to pay a sum of money to prevent a problem that has occurred from delaying a task’s progress.  
#####How to Evaluate
Once a problem occurs the player is notified of the type of problem and where it has occurred. They are also told the cost of fixing the problem. They are then given two options, either they can ignore the problem which is free, but the related task takes the progress delay and the chance for morale to decrease every day is increased. Alternatively, the player can fix the problem which costs the player money but does not cause the task’s progress to be reduced, but lowers morale slightly which relates to the extra work required to get the task back on schedule after the problem.

####Management Style - Feature 34
#####Description
The management style strives to provide a way of adding in the human element to the software development process by creating for the player an avatar with positive and negative qualities to represent their agency in the world. Each player is assigned “stats” based on one of three archetypes:
* Laissez-Faire
* Authoritarian
* A person who got the job through luck alone

Each of these have their own associated benefits and downsides which are intentionally hidden from the player to encourage experimentation and replayability. The impact that each management style has is relatively small, however, it can be the difference between success and failure of the project.
#####How to Evaluate
Once the game begins the user will be immediately presented with a choice of management styles, and once selected they may view their statistics in the “View Character Sheet” tab, listed at the top of the screen. The relevant stats are listed below for posterity.
* Sensitivity - used to reduce cultural issues
* Perception - reduces the monetary cost of problems
* Empathy - increases morale
* Charisma - increases developer effort
* Intelligence - increases revenue
* Assertiveness - increases developer rate
* Luck - allows for random world events to happen

The user may see random world events happen based on their luck stat, each of which may be positive or negative. These events are all listed in the master config file and may be adjusted at will.




###Master Config:
Edit this at /Sim/data/config_file.json
Values & Definitions for Global, Temporal and Cultural Distance were taken from http://jnoll.nfshost.com/cs4098/projects/global_distance.html

* Global Distances: Defines geographical distance between home site and other sites, a low number indicates that the distance between the home site and a given site is small.
* Temporal Distances: Defines time difference between home site and other sites, a low number indicates that the time zones of the home site and a given site are the same or overlap.
* Cultural Distances: Defines cultural differences between home site and other sites, a low number indicates that the culture of the home site and a given site are similar.
* Revenue: Revenue per year in dollars($).
* Starting Capital: The amount of money the player starts with in dollars($).
* Developer Effort: How many effort points a developer delivers per working hour.
* Developer Rate: The cost per hour a developer incurs in dollars($).
* Developer Working Hours: Hours a day the developer will work.
* Problem Constant: Constant value for problem simulator, used to tweak difficulty, decrease to reduce frequency of problems.
* Special Event Constant: Represents the chance that a good/bad event will occur. A lower value reduces the probability while a higher value does the opposite
* Morale Modifier: Determines how quickly a moral intervention's impact errodes after repeated use. The higher the value, the quicker the erosion.
* Min Morale: Determines the lowest value that a site's morale can be.
* Max Morale: Determines the highest value that a site's morale can be
* Interventions: Initial and Daily cost for interventions, and the tasks they will affect. The numbers 0-6 represent the 7 stages of the product's lifecycle. Is_Implemented is the initial state of the intervention, if the user has paid for it, or simply starts with it.
* Good Special Events: Gives details of the good events that can occur to the player during the game.
* Bad Special Events: Gives details of the bad events that can occur to the player during the game.
* Morale Interventions: Details for the morale interventions that the player can buy to boost a site's morale
* Problem Cooldown: use a lower number for this to decrease frequency of problems experienced in the game, this adds an increasing chance of problems occurring as time advances, which then resets once a problem happens
