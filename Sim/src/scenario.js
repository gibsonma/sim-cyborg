
[{
    name:"New York",
    dev_type:"Agile",
    home:false,
    workers: 10
}
{
    name:"New York",
    dev_type:"Agile",
    home:false,
    workers: 20
}
{
    name:"New York",
    dev_type:"Agile",
    home:false,
    workers: 12
}]

function scenario_builder(sites, gs){
    $.each(sites, function(site){
        var site_obj = site_builder(site.name, site.dev_type, site.home);

        gs.sites.push(
    });
            this.sites = [site, site2, site3];
            this.home_site = site3;
            main_module = new Module("Backend", [new Task("Design",3000), new Task("Implement", 2500), new Task("Test", 3500)]);
            main_module.tasks[0].assigned = 3; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 5;
            main_module.tasks[2].assigned = 3;  
            second_module = new Module("Frontend", [new Task("Design",3000), new Task("Implement", 2500), new Task("Test", 3500)]);
            second_module.tasks[0].assigned = 3; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 4;
            second_module.tasks[2].assigned = 2; 
            third_module = new Module("Middlend", [new Task("Design",3000), new Task("Implement", 2500), new Task("Test", 3500)]);
            third_module.tasks[0].assigned = 4; // NB will need to have proper methods to change who's assigned to what
            third_module.tasks[1].assigned = 4;
            third_module.tasks[2].assigned = 3; 
            this.modules = [main_module, second_module, third_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            this.sites[2].working_on.push(third_module);
}

function site_builder(site_name, dev_type, home){
    switch (site_name){
        case "New York":
            return new Site(site_name, new Cuture("western"), dev_type, TIMEZONE_AMERICA, home);
        case "Shanghai":
            return new Site(site_name, new Cuture("asian"), dev_type, TIMEZONE_ASIA, home);
        case "Dublin":
            return new Site(site_name, new Cuture("western"), dev_type, TIMEZONE_EUROPE, home);
        case "Poland":
            return new Site(site_name, new Cuture("eastern european"), dev_type, TIMEZONE_EASTERN_EUROPE, home);
        case "San Francisco":
            return new Site(site_name, new Cuture("western"), dev_type, TIMEZONE_AMERICA, home);
        case "Bangalore":
            return new Site(site_name, new Cuture("asian"), dev_type, TIMEZONE_ASIA, home);
        default:
            console.log("Unrecognised site name");
            return null;
    }
}

function module_builder(name, tasks, dev_type, assigned){
    if (tasks !== null) return new Module(name, tasks);
    
    switch (dev_type):
    case "Agile":
        var requirements = task_builder("Requirements", 1000);
        var design = task_builder("Design",1000);
        var implementation = task_builder("Implementation",1000);
        var testing = task_builder("Testing",2000);
        var acceptance = task_builder("Acceptance Tests",1000);
        break;
    case "Waterfall":
        var requirements = task_builder("Requirements", 1000);
        var design = task_builder("Design",1000);
        var implementation = task_builder("Implementation",1000);
        var testing = task_builder("Testing",1000);
        var deployment = task_builder("Deployment",1000);
        var acceptance = task_builder("Acceptance Tests",1000);
        break;
}

function task_builder(name, effort){
    return new Task(name, effort);
}

