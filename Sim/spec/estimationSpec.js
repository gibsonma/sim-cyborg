describe("Agile - 1 site - 1 module", function()
{
    it("Check sum tasks", function()
    {
        sites = [
            site_builder("Poland", "Agile", true, [
                module_builder("Middle End", 1, 32),
            ])
        ];
        setupGame(sjs.Scene({w:1, h:1}), sites);

        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(52);
    });
});
