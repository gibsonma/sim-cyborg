
//Given a module, this function will calculate how much effort will be required to complete it
//by summing up the expected total of its tasks and returning it
function getEffortForModule(module)
{
	if(!module.tasks)return -1;
	var result = 0;
	for(var i = 0; i < module.tasks.length; i++)
	{
		result += module.tasks[i].total;
	}
	return result;
}
//Given a site, this function goes through all the tasks being worked on and returns how many workers that are working at the site
function getSiteWorkers(site)
{
	var result = 0, modules = site.working_on;
	for(var i = 0; i < modules.length; i++)
	{
		for(var j = 0; j < modules[i].tasks.length; j++)result += modules[i].tasks[j].assigned;	
	}
	return result;
}
function scheduleCalculator(gs)

{  
    return sum_tasks(gs)/WORK_LOAD;
}

function sum_tasks(gs){
    var listOfModules = gs.modules;
    var sumTasks = 0;
    for(var i = 0; i < listOfModules.length; i++){
        var modTasks = listOfModules[i].tasks;
        for(var j = 0; j < modTasks.length; j++)
        {
            sumTasks += modTasks[j].total;
        }
    }
    return sumTasks;
}
function number_assigned_workers(){

    var gs = GAME_DATA.gs;
    var total_assigned = 0;
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];

        for (var j=0; j < site.working_on.length; j++){
            var module = site.working_on[j];
            switch (site.development_type) {
                case "Waterfall":
                        total_assigned += most_assigned_task(module);
                    break;
                case "Agile":
                    for (var k=0; k < module.tasks.length; k++){
                        var task = module.tasks[k];
                        total_assigned += task.assigned;
                    }
                    break;
            }
        }
    }
    return total_assigned;
}
function most_assigned_task(module){

    var most_assigned = 0;
    for (var k=0; k < module.tasks.length; k++){
        var task = module.tasks[k];
        if (task.assigned > most_assigned) most_assigned = task.assigned;
    }
    return most_assigned;
}

function check_if_completed(gs) {
    var finished = true;
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        for (var j=0; j < site.working_on.length; j++){
            var module = site.working_on[j];
            for (var k=0; k < module.tasks.length; k++){
                var task = module.tasks[k];
                if(task.completed < task.actual_total) finished = false;
            }
        }
    }
}

function report(gs){
    this.expected_effort = Math.round(scheduleCalculator(gs));
    this.actual_effort = Math.round(gs.current_time/24*gs.developer_effort*number_assigned_workers());
    this.expected_expenditure = Math.round(sum_tasks(gs)/gs.developer_effort*number_assigned_workers() * 1.24); // see email for explanation
    this.actual_expenditure = get_total_expenditure();
    var month = gs.current_time/24/gs.days_per_release;
    this.expected_revenue = Math.round(gs.revenue*month);
    this.actual_revenue = Math.round(get_total_revenue());
    this.expected_time = scheduleCalculator(gs)/gs.developer_effort;
    var expected_months = this.expected_time/24/gs.days_per_release;
    this.final_score = Math.round(gs.capital + (expected_months-month)*gs.revenue);
}

function get_total_expenditure(){ // work out the amount of expenditure based on financial log
    var log = GAME_DATA.gs.financial_log;
    if (log.length == 0) return 0;
    var expenses = 0;
    for (var i=0; i< log.length; i++){
        var amount = log[i].amount;
        if (amount < 0) expenses = expenses + Math.abs(amount);
    }
    return expenses;
}

function get_total_revenue(){
    var log = GAME_DATA.gs.financial_log;
    if (log.length == 0) return 0;
    var income = 0;
    for (var i=0; i< log.length; i++){
        var amount = log[i].amount;
        if (amount > 0) income += Math.abs(amount);
    }   
    return income;
}

//Function which takes a site and determines if it should be working based on the timezone it is in
//It does this by getting the times that the site should be working based on its timezone and checking if the current hour is within this range
function should_be_working(site, gs)
{
    var current_hour = gs.time["Current Hour"];
    var tmp;
    var time_range = TIME_CLOCK.slice(site.timezone[0], site.timezone[1]);//Extract timezone from time array
    if(time_range.length < 8)//If full array not retrieved then timezone must span midnight ex(18-2)
    {
        time_range = TIME_CLOCK.slice(0, site.timezone[1]);//Get partial timezone from midnight
        tmp = TIME_CLOCK.slice(site.timezone[0]);//Get second partial from before midnight
        time_range = time_range.concat(tmp);//Concatenate the two
    }
    if(time_range.indexOf(current_hour) == -1) return false;//Check if current hour is within timezone
    return true;
}

function module_lifecycle_stage(site) {
    var lowest_cycle = -1;
    for (var j=0; j < site.working_on.length; j++){
        var module = site.working_on[j];
        for (var i=0; i < module.tasks.length; i++){
            var task = module.tasks[i];
            if (task.completed < task.actual_total) {
                if (i < lowest_cycle || lowest_cycle == -1) {
                    lowest_cycle = i;
                }
            }
        }
    }
    return lowest_cycle;
}

function getIndexOfSiteByName(name, gs) {
    for(var i = 0; i < gs.sites.length; i++){
        if(name == gs.sites[i].name)
        {
            return i;
        }

    }
    return -1;
}
