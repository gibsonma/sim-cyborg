
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
                for (var k=0; k<module.tasks.length; k++){

                    var task = module.tasks[k];
                    var max_per_hour = (module.assigned*gs.developer_effort*gs.developer_working_hours)/24;
                    var work = longest_task(site.modules, k) * max_per_hour;
                    effort += work;
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
                    effort += remainder(task.total, gs.developer_effort*module.assigned);
                }
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
                for (var k=0; k<module.tasks.length; k++){
                    var task = module.tasks[k];
                    var max_per_hour = (module.assigned*gs.developer_effort*gs.developer_working_hours)/24;
                    var work = ratio_effort_completed_longest_task(site.modules, k) * max_per_hour;
                    effort += work;
                }
            }
            break;
        case "Agile":
            for (var j=0; j < site.modules.length; j++){
                var module = site.modules[j];
                console.log("Module: " + module.name);
                var completed = 0;
                var out_of = 0;
                for (var k = 0; k < module.tasks.length; k++){
                    var task = module.tasks[k];
                    completed += task.completed;
                    out_of += credited_total(task);
                }
                var ratio_completed = completed/out_of;
                console.log("Ratio completed: " + ratio_completed);

                var max_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
                var work =  hours_for_module(module) * max_per_hour;
                console.log("Work: " + work);
                effort += work * ratio_completed;
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

function ratio_effort_completed_longest_task(modules, task_idx){
    var longest = longest_task(modules, task_idx);
    for (var i=0; i< modules.length; i++){
        for (var j=0; j< modules[i].tasks.length; j++){
            var task = modules[i].tasks[j];
            if (task === longest){
                return hours_for_task(modules[i], longest)*(longest.completed/longest.actual_total);
            }
        }
    }
}

function longest_task(modules, task_idx){
    var gs = GAME_DATA.gs;
    var longest;
    var length_of_longest =0;
    for (var i=0; i < modules.length; i++){
        var module = modules[i];
        var task = module.tasks[task_idx];
        if (hours_for_task(module, task) > length_of_longest) {
            longest = task;
            length_of_longest = hours_for_task(module, task);
        }
    }
    return longest;
}

function hours_for_longest_module(site){
    var gs = GAME_DATA.gs;
    var length_of_longest =0;
    for (var i=0; i< site.modules.length; i++){
        var module_length = hours_for_module(site.modules[i]);
        if (module_length > length_of_longest) length_of_longest = module_length;
    }
    return length_of_longest;
}

function hours_for_module(module){
    var module_total = 0;
    for (var j=0; j < module.tasks.length; j++){
        var task = module.tasks[j];
        module_total += hours_for_task(module, task);
    }
    return module_total;
}

function completed_hour_for_module(module){
    var module_total = 0;
    for (var j=0; j < module.tasks.length; j++){
        var task = module.tasks[j];
        module_total += completed_hours_for_task(module, task);
    }
    return module_total;
}

function hours_for_task(module,task){
    var gs = GAME_DATA.gs;
    var hourly_effort = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
    var length_of_idle = remainder(task.total, module.assigned*gs.developer_effort)/hourly_effort;
    var task_total = credited_total(task)/hourly_effort;
    return length_of_idle + task_total;
}

function completed_hours_for_task(module,task){
    var gs = GAME_DATA.gs;
    var hourly_effort = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
    var task_total = task.completed/hourly_effort;
    if (task.completed >= task.actual_total){
        var length_of_idle = remainder(task.total, module.assigned*gs.developer_effort)/hourly_effort;
        task_total += length_of_idle;
    }
    return task_total;
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
