function daily_transactions(){
    deduct_daily_expenses();
}

function deduct_daily_expenses(){
    //var days_per_month = GAME_DATA.gs.days_per_month;
    //var daily_operating_cost = Math.round((1/days_per_month)*GAME_DATA.gs.revenue);
    var total = 0;
	var daily_developer_cost = number_assigned_workers() * GAME_DATA.gs.developer_rate * GAME_DATA.gs.developer_working_hours;
	var interventions = GAME_DATA.gs.interventions;
	for(var i = 0; i < interventions.length; i++)
	{
		if(interventions[i].is_implemented)total += interventions[i].daily_cost;
	}
    total += daily_developer_cost;
    new_transaction(-total);
}

function new_transaction(amount){
    GAME_DATA.gs.capital = GAME_DATA.gs.capital + amount;
    GAME_DATA.gs.financial_log.push({
        "time":GAME_DATA.gs.current_time, 
        "amount":amount
    });
}

