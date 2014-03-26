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
                    var longest = longest_task(site.modules, k);
                    var work = hours_for_task(longest.module, longest.task) * max_per_hour;
                    effort += work;
                }
            }
            break;
        case "Agile":
            for (var j=0; j< site.modules.length; j++){
                var module = site.modules[j];
                var max_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
                var work =  hours_for_module(module) * max_per_hour;

                var longest_mod = longest_module(site);
                if (module !== longest_mod){
                    var ratio_current_to_longest = hours_for_module(longest_mod)/hours_for_module(module);
                    var ratio = ratio_current_to_longest

                    effort += work * ratio;
                }
                else {
                    effort += work;
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
                    var longest = longest_task(site.modules, k);
                    var work = completed_hours_for_task(longest.module, longest.task) * max_per_hour;
                    effort += work;
                }
            }
            break;
        case "Agile":
            for (var j=0; j < site.modules.length; j++){
                var module = site.modules[j];
                var max_per_hour = module.assigned*gs.developer_effort*gs.developer_working_hours/24;
                var work =  completed_hours_for_module(module) * max_per_hour;

                var longest_mod = longest_module(site);
                if (module !== longest_mod){
                    var longest_completed = completed_hours_for_module(longest_mod);
                    var longest_total = hours_for_module(longest_mod);
                    var ratio_completion_longest = longest_completed/longest_total;

                    var ratio_current_to_longest = hours_for_module(longest_mod)/hours_for_module(module);

                    var ratio = ratio_current_to_longest*ratio_completion_longest
                    if (ratio > 1){
                        effort += work * ratio;
                    }
                    else {
                        effort += work;
                    }
                }
                else {
                    effort += work;
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

function ratio_effort_completed_longest_task(modules, task_idx){
    var longest = longest_task(modules, task_idx);
    return completed_hours_for_task(longest.module, longest.task);
}

function longest_task(modules, task_idx){
    var gs = GAME_DATA.gs;
    var longest;
    var module_of_longest;
    var length_of_longest =0;
    for (var i=0; i < modules.length; i++){
        var module = modules[i];
        var task = module.tasks[task_idx];
        if (hours_for_task(module, task) > length_of_longest) {
            longest = task;
            module_of_longest = module;
            length_of_longest = hours_for_task(module, task);
        }
    }
    return {task:longest, module:module_of_longest};
}

function longest_module(site){
    var gs = GAME_DATA.gs;
    var longest = site.modules[0];
    for (var i=0; i < site.modules.length; i++){
        var module = site.modules[i];
        var length = hours_for_module(module);
        if (hours_for_module(module) > hours_for_module(longest)){
            longest = module;
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

function completed_hours_for_module(module){
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

function hours_for_longest_task(modules, task_idx){
    var longest = longest_task(modules, task_idx);
    return hours_for_task(longest.module, longest.task);
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

