describe("deduct_daily_expenses", function()
{
	new_transaction = jasmine.createSpy();
	it("Calls new_transaction", function()
	{
		deduct_daily_expenses();
		expect(new_transaction).toHaveBeenCalled();
		expect(new_transaction).toHaveBeenCalledWith(jasmine.any(Number));
	});
});