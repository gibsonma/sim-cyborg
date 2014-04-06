
describe("site_builder", function()
{
	it("Creates a valid site object", function()
	{
		var result = site_builder("New York", "Agile", true, []);
		expect(result).toBeDefined();
		expect(result.name).toEqual("New York");
	});
});
describe("module_builder", function()
{
	it("Creates a valid module object", function()
	{
		var result = module_builder("Design", "5", 100);
		expect(result).toBeDefined();
		expect(result.name).toEqual("Design");
	});
});
describe("task_builder", function()
{
	it("Creates a valid task object", function()
	{
		var result = task_builder("Test", 100);
		expect(result).toBeDefined();
		expect(result.name).toEqual("Test");
	});
});