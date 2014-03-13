function daily_transactions(){
    deduct_daily_expenses();
    add_daily_revenue();
}

function deduct_daily_expenses(){
    //var days_per_release = GAME_DATA.gs.days_per_release;
    //var daily_operating_cost = Math.round((1/days_per_release)*GAME_DATA.gs.revenue);
    var daily_developer_cost = number_assigned_workers() * GAME_DATA.gs.developer_rate * GAME_DATA.gs.developer_working_hours;
    var total = daily_developer_cost;
    new_transaction(-total);
}

function add_daily_revenue(){
    var days_per_release = GAME_DATA.gs.days_per_release;
    var daily_revenue = GAME_DATA.gs.revenue/days_per_release;
    new_transaction(daily_revenue);
}

function new_transaction(amount){
    GAME_DATA.gs.capital = GAME_DATA.gs.capital + amount;
    GAME_DATA.gs.financial_log.push({
        "time":GAME_DATA.gs.current_time, 
        "amount":amount
    });
}

