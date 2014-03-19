//Get passed an intervention & buys it for the player
function purchase_intervention(chosen)
{
	chosen.is_implemented = true;//Changes it to implemented 
	new_transaction(-chosen.init_cost);//Records the cost of it
	console.log("Intervention: " + chosen.name + " purchased");
}
//Get passed an intervention & removes it from the player's daily expenses
function disregard_intervention(chosen)
{
	chosen.is_implemented = false;
	console.log("Intervention: " + chosen.name + " is no longer in use by the player");
}
//Pauses the game and opens a dialog listing the interventions
//Add Confirmation that intervention is bought
//Change to table format
//Name of intervention 
function displayInterventions(gs)
{
	GAME_DATA.ticker.pause();
	var interventions = '<table class="itable"><tr class="itr"><td class="itd">Name</td><td = class="itd">Cost</td><td class="itd">Daily Cost</td><td class ="itd">Buy</td></tr>';
	for(var i = 0; i < gs.interventions.length; i++)
	{
		var item = gs.interventions[i];
		if(item.is_implemented)
		{
			interventions += '<tr class="itr"><td class="itd">'+item.name+'</td><td class="itd">'+item.init_cost+'</td><td class="itd">'+item.daily_cost+'</td><td class="itd">Already Implemented</td>';
		}
		else 
		{
			interventions += '<tr class="itr"><td class="itd">'+item.name+'</td><td class="itd">'+item.init_cost+'</td><td class="itd">'+item.daily_cost+'</td><td class="itd"><button id="intervention">BUY ' + item.name+'</button></td>'
		}
		interventions += '</tr>';
		
	//	interventions += '<button id="intervention">' + gs.interventions[i].name + ' $' + gs.interventions[i].init_cost +  '</button>' + '</br>';
	//	console.log(interventions);
	}
	interventions += '</table>';
	vex.dialog.confirm({
      message: '<p>' + interventions + '</p>', 
      callback: function(value) {
        GAME_DATA.ticker.resume();
        return value;
      }
    });
}
//Takes an intervention, purchases it for the player and applies the necessary changes
//to the relevant problems based on which intervention was chosen
function implementChosenIntervention(gs, intervention_name)
{
	var interventions = gs.interventions;
	var chosen;
	for(var i = 0; i < interventions.length; i++)
	{
		if(intervention_name.indexOf(interventions[i].name) != -1)
		{//Finds which intervention was chosen based on the name
			chosen = interventions[i];
			break;
		}
	}
	if(!chosen)return -1;
	purchase_intervention(chosen);
	GAME_DATA.ticker.pause()
	vex.dialog.alert(chosen.name + " have been purchased!");
	GAME_DATA.ticker.resume();
	switch(chosen.name)//Values taken from http://jnoll.nfshost.com/cs4098/projects/global_distance.html
	{				   //High impact of 4 translates to a 0.4 reduction in problem occurance
		case 'Face to face meetings':
				reduce_percentages([0.4,0.4,0.4,0.4,0.4,0.4,0.4]);
				break;
		case 'Video Conferencing':
				reduce_percentages([0.2,0,0,0,0,0,0]);
				break;
		case 'Cultural Training':
				reduce_percentages([0.3,0.3,0.3,0.3,0.3,0.3,0.3]);
				break;
		case 'Cultural Ambassador':
				reduce_percentages([0.3,0.3,0.3,0.3,0.3,0.3,0.3]);
				break;
		case 'Low Context Comms':
				reduce_percentages([0.2,0.2,0.2,0.2,0.2,0.2,0.2]);
				break;
		case 'Synchronous Communication Possibilities':
				reduce_percentages([0.3,0.3,0.3,0.3,0.3,0.3,0.3]);
				break;
		case 'Communication Tools':
				reduce_percentages([0.2,0.2,0.2,0.2,0.2,0.2,0.2]);
				break;
		case 'Exchange Program':
				reduce_percentages([0.4,0,0,0,0,0.4,0]);
				break;
		case 'Reduce Multi-cultural interactions':
				reduce_percentages([0.1,0.1,0.1,0.1,0.1,0.1,0.1]);
				break;
		default:
			console.log("Invalid Intervention Passed in");
			break;
	}
}
//Passed in an array of numbers, subtracts them from the corresponding percentages
//to a minimum of 0.25
function reduce_percentages(changes_list)
{
	for(var i = 0; i < changes_list.length; i++)
	{
		percentages[i] -= changes_list[i];
		if(percentages[i] < 0.25)percentages[i] = 0.25;
	}
}

//Gets passed the game state and a problem
//Find out which interventions apply to the problem and return it
function get_applicable_interventions(gs, problem)
{
	var task_num = problem.taskNum;
	var affects;
	var result = [];
	for(var i = 0; i < gs.interventions.length; i++)
	{
		affects = gs.interventions[i].affects;
		if(affects[task_num])result.push(gs.interventions[i]);
	}
	return result;
}

function intervention(gs)
{
    sites = gs.sites;	
    for(var i = 0; i < sites.length; i++)
    {
        if(sites[i].problems.length > 0)
        {
            var index = i;//Need to record index for use in callback
            var problem = sites[i].problems[0];
			var interventions = get_applicable_interventions(gs, problem);
			var buttonList = '';
			var game = gs;
			for(var i = 0; i < interventions.length; i++)
			{//Generates the list of buttons
				buttonList += '<button id="intervention">' + interventions[i].name + ' $' + interventions[i].init_cost +  '</button>'
			}
            GAME_DATA.ticker.pause();//Pause the game
			vex.dialog.alert({
                message: '<p>'+problem.name+' has occured in site '+sites[index].name+'. It will cost $' + problem.cost + ' to correct, below are some options you can purchase to try and prevent this from happening again in the future</p>' + buttonList,
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, {
                      text: 'OK'
                    })
                  ],
                callback: function(value) {    
                    sites[index].problems.pop();//Pop the problem
                    new_transaction(-problem.cost);//Deduct cost of fixing problem
                    GAME_DATA.ticker.resume();//Note effect of problem no longer being reversed
                    return console.log("Resolution Chosen");
                }
            });
        }
    }
}

//Added because vex is being really annoying, so this is called in gameSpec instead of intervention
//It has the same functionality, but gets passed an extra parameter to tell it whether or not it
//should fix the problem
function interventionAlt(gs, val)
{
    sites = gs.sites;			
    for(var i = 0; i < sites.length; i++)
    {
        if(sites[i].problems.length > 0)
           {
			var index = i;//Need to record index for use in callback
            var problem = sites[i].problems[0];
            if(!val)//If problem ignored
            {
				sites[index].problems.pop();//Pop the problem
				GAME_DATA.ticker.resume();//Resume game		
				return console.log("Problem not fixed");
            }
			console.log("Actual total: " +gs.sites[index].modules[problem.module].tasks[problem.taskNum].actual_total);
			gs.sites[index].modules[problem.module].tasks[problem.taskNum].actual_total -= problem.reduction_in_total;//Undo the changes that the problem did on the task
			console.log(gs.sites[index].modules[problem.module].tasks[problem.taskNum].actual_total);
			var cost = problem.cost;
			new_transaction(-cost);//Deduct cost of fixing problemnew_transaction(-1000);//Deduct cost of fixing problem
			sites[index].problems.pop();
			return console.log("Problem has been fixed!");
        }
    }
}

function generateProblemPercentages() //to give each problem a minimal level of mitigation i.e the numbers reduced by interventions choices
{ 


    for(var i = 0; i < 7; i++)
    {
        var percentage = 0.3 + Math.floor(Math.random()*5)/10; //40% variance
        percentages.push(percentage);
    }
    return percentages;

}

function problemSim(gs)
{
    var numSites = gs.sites.length;
    var seed = Math.floor(Math.random() * numSites); //get a random number between 0 and number of sites
    var site = gs.sites[seed].name;
    var dGeo = gs.global_distances[site];
    var dTemporal = gs.temporal_distances[site]; 
    var dCulture = gs.cultural_distances[site];
    var dGlobal = dTemporal + dCulture + dGeo;

    var fail = dGlobal/(1+dGlobal);

    var probCD = gs.sites[seed].problemCooldown;
    var failC = fail*PROBLEM_CONSTANT*probCD;
    gs.sites[seed].problemCooldown += 0.005;


    var failure_seed = Math.random();
    //console.log(failC +" vs " + failure_seed);
    if(failure_seed < failC)
    {
        gs.sites[seed].problemCooldown = 0.005;
        console.log("A problem has been encountered in the "+ site + " office.")

        var problemSeed = Math.floor(Math.random() * 7)+1; //choose one of 7 problems
        var workingOnSeed = Math.floor(Math.random() * gs.sites[seed].modules.length); //choose one module being worked on
        var problemSite = gs.sites[seed];
        var problemModule = problemSite.modules[workingOnSeed];

        switch(problemSeed)
        {
            case 1: 
                var chanceAfterReduction = percentages[problemSeed-1];

                if(failC < chanceAfterReduction){
                    var problemTask = problemModule.tasks[problemSeed-1];  //design
                    var prob = new Problem("A task has fallen more than 25% behind",50, problemModule.tasks[problemSeed-1].actual_total,workingOnSeed,problemSeed);
                    problemTask.actual_total += problemTask.actual_total/50; //add a 50% overhead
                    gs.sites[seed].problems.push(prob);
                }
                break;

            case 2:
                var chanceAfterReduction = percentages[problemSeed-1];

                if(failC < chanceAfterReduction){
                    var problemTask = problemModule.tasks[problemSeed-1];  //implementation
                    var prob = new Problem("A task has fallen more than 25% behind",50, problemModule.tasks[problemSeed-1].actual_total,workingOnSeed,problemSeed);
                    problemTask.actual_total += problemTask.actual_total/50; 
                    gs.sites[seed].problems.push(prob);
                }
                break;

            case 3:
                var chanceAfterReduction = percentages[problemSeed-1];

                if(failC < chanceAfterReduction){
                    var problemTask = problemModule.tasks[problemSeed-1];  //test
                    var prob = new Problem("unit tests failed",25, problemModule.tasks[problemSeed-1].actual_total,workingOnSeed,problemSeed);
                    problemTask.actual_total += problemTask.actual_total/25; 
                    gs.sites[seed].problems.push(prob);
                }
                break;

            case 4:
                var chanceAfterReduction = percentages[problemSeed-1];

                if(failC < chanceAfterReduction){
                    var problemTask = problemModule.tasks[problemSeed-1];  //integration
                    var prob = new Problem("integration failure",40, problemModule.tasks[problemSeed-1].actual_total,workingOnSeed,problemSeed);
                    problemTask.actual_total += problemTask.actual_total/40; 
                    gs.sites[seed].problems.push(prob);
                }
                break;

            case 5:
                var chanceAfterReduction = percentages[problemSeed-1];

                if(failC < chanceAfterReduction){
                    var problemTask = problemModule.tasks[problemSeed-1];  //system test
                    var prob = new Problem("system test failure",55, problemModule.tasks[problemSeed-1].actual_total,workingOnSeed,problemSeed);
                    problemTask.actual_total += problemTask.actual_total/55;
                }
                break;   

            case 6:
                var chanceAfterReduction = percentages[problemSeed-1];

                if(failC < chanceAfterReduction){
                    var problemTask = problemModule.tasks[problemSeed-1];  //deployment
                    var prob = new Problem("deployment failure",70, problemModule.tasks[problemSeed-1].actual_total,workingOnSeed,problemSeed);
                    problemTask.actual_total += problemTask.actual_total/70; 
                }
                break; 

            case 7:
                var chanceAfterReduction = percentages[problemSeed-1];

                if(failC < chanceAfterReduction){            
                    var problemTask = problemModule.tasks[problemSeed-1];  //acceptance
                    var prob = new Problem("acceptance test failure",100, problemModule.tasks[problemSeed-1].actual_total,workingOnSeed,problemSeed);
                    problemTask.actual_total += problemTask.actual_total/100;
                    problemSite.critical_problem = true;
                }
                break;                        

            default:
                console.log("What's yer prob");
        }
    }
    //console.log(failC);
    return failC;

}
