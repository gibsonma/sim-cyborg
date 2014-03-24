
//Given a module, this function will calculate how much effort will be required to complete it
//by summing up the expected total of its tasks and returning it
function getEffortForModule(module)
{
    if (module.tasks == undefined) return -1;
    var result = 0;
    for(var i = 0; i < module.tasks.length; i++)result += module.tasks[i].total;
    return result;
}

//Given a site, this function goes through all the tasks being worked on and returns how many workers that are working at the site
function getSiteWorkers(site)
{
    var result = 0;

    for(var i = 0; i < site.modules.length; i++)
    {
        result += site.modules[i].assigned;
    }
    return result;
}
function scheduleCalculator(gs)
{   
    var sum =0;
    for (var i=0; i< gs.sites.length; i++){
        sum += sum_tasks(gs.sites[i]);
    }
    return sum;
}

function sum_tasks(site){
    var gs = GAME_DATA.gs;
    var effort=0;
    switch (site.development_type) {
        case "Waterfall":
            for (var j=0; j< site.modules.length; j++){
                var module = site.modules[j];
                var work_done = module.assigned*gs.developer_effort/TICKS_PER_UNIT_TIME;
                for (var k=0; k<module.tasks.length; k++){
                    var task = module.tasks[k];
                    var max_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
                    var work = effort_per_time_longest_task(site.modules, k) * max_per_hour;
                    effort += work;
                    if (task.total + work_done > work) {
                        effort += remainder(task.total, work_done);
                    }
                }
            }
            break;
        case "Agile":
            for (var j=0; j< site.modules.length; j++){
                var module = site.modules[j];
                var max_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
                var work =  hours_for_longest_module(site) * max_per_hour;
                effort += work;
                for (var k=0; k<module.tasks.length; k++){
                    var task = module.tasks[k];
                    effort += remainder(task.total, gs.developer_effort);
                }
                //        effort += remainder(task.total, work_done);
            }
            break;
    }
    return effort;
}

function actual_effort_completed_gs(){
    var gs = GAME_DATA.gs;
    var total = 0;
    for (var i=0; i < gs.sites.length; i++){
        total += actual_effort_completed(gs.sites[i]);
    }
    return total;
}

function actual_effort_completed(site){
    var gs = GAME_DATA.gs;
    var effort=0;
    switch (site.development_type) {
        case "Waterfall":
            for (var j=0; j< site.modules.length; j++){
                var module = site.modules[j];
                var work_done = module.assigned*gs.developer_effort/TICKS_PER_UNIT_TIME;
                for (var k=0; k<module.tasks.length; k++){
                    var task = module.tasks[k];
                    if (task.completed == task.actual_total){
                        var max_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
                        var work = effort_per_time_longest_task_completion(site.modules, k) * max_per_hour;
                        effort += work;
                        if (credited_total(task) + work_done > work) {
                            effort += remainder(credited_total(task), work_done);
                        }
                    }
                    else {
                        effort += task.completed;
                    }
                }
            }
            break;
        case "Agile":
            for (var j=0; j < site.modules.length; j++){
                var module = site.modules[j];

                var completed = 0;
                var out_of = 0;
                for (var k = 0; k < module.tasks.length; k++){
                    var task = module.tasks[k];
                    completed += task.completed;
                    out_of += credited_total(task);
                }
                var ratio_completed = completed/out_of;

                var max_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
                var work =  hours_for_longest_module(site) * max_per_hour;
                effort += work * ratio_completed;
                for (var k=0; k<module.tasks.length; k++){
                    var task = module.tasks[k];
                    if (task.completed >= task.total) {
                        effort += remainder(credited_total(task), gs.developer_effort);
                    }
                }
            }
            break;
    }
    return effort;
}

function remainder(total, work){
    return (Math.ceil(total/work) * work) - total;
}

function credited_total(task){
    if (task.actual_total > task.total){
        return task.total;
    }
    else return task.total + (task.total - task.actual_total);
}

function effort_per_time_longest_task_completion(modules, task_idx){
    var gs = GAME_DATA.gs;
    var length_of_longest =0;
    var longest;
    var length_of_idle_of_longest;
    for (var i=0; i < modules.length; i++){
        var module = modules[i];
        var task = module.tasks[task_idx];
        if (credited_total(task)/module.assigned > length_of_longest) {
            longest = task;
            var hourly_effort = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
            length_of_idle_of_longest = remainder(credited_total(task), hourly_effort)/ hourly_effort;
            length_of_longest = credited_total(task)/hourly_effort;
        }
    }
    if (longest.completed < longest.total){
        return length_of_longest*(longest.completed/longest.total);
    }
    else {
        return length_of_longest + length_of_idle_of_longest;
    }
}

function hours_for_longest_module(site){
    var gs = GAME_DATA.gs;
    var length_of_longest =0;
    for (var i=0; i< site.modules.length; i++){
        var module = site.modules[i];
        var module_total = 0;
        for (var j=0; j < module.tasks.length; j++){
            var task = module.tasks[j];
            module_total += task.actual_total;
        }
        var work_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
        var legnth_of_module = module_total/work_per_hour;
        if (legnth_of_module > length_of_longest) length_of_longest = legnth_of_module;
    }
    return length_of_longest;
}

function effort_per_time_longest_task(modules, task_idx){
    var gs = GAME_DATA.gs;
    var length_of_longest =0;
    for (var i=0; i < modules.length; i++){
        var module = modules[i];
        var task = module.tasks[task_idx];
        var work_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24
        if (task.total/module.assigned > length_of_longest) {
            length_of_longest = task.total/work_per_hour;
        }
    }
    return length_of_longest;
}
function number_assigned_workers(){

    var gs = GAME_DATA.gs;
    var total_assigned = 0;
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        total_assigned += getSiteWorkers(site);
    }
    return total_assigned;
}

function check_if_completed(gs) {
    var finished = true;
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        for (var j=0; j < site.modules.length; j++){
            var module = site.modules[j];
            for (var k=0; k < module.tasks.length; k++){
                var task = module.tasks[k];
                if(task.completed < task.actual_total) finished = false;
            }
        }
    }
    return finished;
}

function report(gs){

    var days_completed = gs.current_time / 24;
    var effort_per_day = gs.developer_effort * gs.developer_working_hours * number_assigned_workers();

    var months = gs.current_time/24/gs.days_per_month;
    this.months_str = months_to_str(months);

    this.actual_effort = Math.round(actual_effort_completed_gs());
    this.expected_effort = Math.round(scheduleCalculator(gs));

    this.expected_expenditure = Math.round((scheduleCalculator(gs)/gs.developer_effort) * gs.developer_rate * 1.24); // see email for explanation
    this.actual_expenditure = get_total_expenditure();

    var month = Math.ceil(gs.current_time/24/gs.days_per_month);
    this.expected_revenue = Math.round(gs.revenue/2);
    this.actual_revenue = Math.round( (6-(month-6)) * (gs.revenue/12) );

    this.expected_months = scheduleCalculator(gs)/ effort_per_day / gs.days_per_month;

    this.final_score = Math.round(gs.capital + (6-(month-6))* (gs.revenue/12));

    this.expected_months_str = months_to_str(this.expected_months);
}

function months_to_str(months){
    var ret;
    var gs = GAME_DATA.gs;
    var plural_str = "months";

    if (months < 1) ret = Math.round(months*gs.days_per_month) + " days";
    else {
        if (Math.floor(months) == 1) plural_str = "month";
        ret = Math.floor(months) + " " + plural_str+ " and " + Math.ceil((months-Math.floor(months))*  gs.days_per_month) + " days";
    }
    return ret;
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
    for (var j=0; j < site.modules.length; j++){
        var module = site.modules[j];
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

function getSiteByName(name, gs) {
    for(var i = 0; i < gs.sites.length; i++){
        if(name == gs.sites[i].name) return gs.sites[i];
    }
    return -1;
}

function get_home_site(sites){
    for (var i=0; i < sites.length; i++){
        if (sites[i].home == true) return sites[i];
    }
    console.log("Home site not set");
}

function currently_doing_which_task(tasks){
    for (var i=0; i<tasks.length; i++){
        var task = tasks[i];
        if (task.completed < task.actual_total) {
            if (task.completed != 0) return task;
            if (i > 0) return tasks[i-1];
        }
    }
    return tasks[tasks.length-1];
}

function progress_on_current_task(module){
    var doing_task = currently_doing_which_task(module.tasks);
    if (doing_task.completed == doing_task.actual_total) return total_of_current_task(module);
    var progress = doing_task.completed / GAME_DATA.gs.developer_effort / module.assigned / GAME_DATA.gs.developer_working_hours;
    return progress;
}

function total_of_current_task(module){
    var doing_task = currently_doing_which_task(module.tasks);
    var total = doing_task.total / GAME_DATA.gs.developer_effort / module.assigned / GAME_DATA.gs.developer_working_hours;
    if (doing_task.completed == doing_task.actual_total) return total;
    return total;
}
