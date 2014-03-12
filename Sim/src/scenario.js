
function site_builder(site_name, dev_type, home){
    switch (site_name){
        case "New York":
            return new Site(site_name, new Culture("western"), dev_type, TIMEZONE_AMERICA, home);
        case "Shanghai":
            return new Site(site_name, new Culture("asian"), dev_type, TIMEZONE_ASIA, home);
        case "Dublin":
            return new Site(site_name, new Culture("western"), dev_type, TIMEZONE_EUROPE, home);
        case "Poland":
            return new Site(site_name, new Culture("eastern european"), dev_type, TIMEZONE_EASTERN_EUROPE, home);
        case "San Francisco":
            return new Site(site_name, new Culture("western"), dev_type, TIMEZONE_AMERICA, home);
        case "Bangalore":
            return new Site(site_name, new Culture("asian"), dev_type, TIMEZONE_ASIA, home);
        default:
            console.log("Unrecognised site name");
            return null;
    }
}

function module_builder(name, assigned, points){
    var ten_percent = points*0.1;
    var fifteen_percent = points*0.15;
    var module = new Module(name, [
        task_builder("Design",fifteen_percent),
        task_builder("Implementation",fifteen_percent),
        task_builder("Unit Test",ten_percent),
        task_builder("Integration",fifteen_percent),
        task_builder("System Test",fifteen_percent),
        task_builder("Deployment", fifteen_percent),
        task_builder("Acceptance Tests",fifteen_percent)
            ], assigned);
    return module;
}

function task_builder(name, effort){
    return new Task(name, effort);
}

