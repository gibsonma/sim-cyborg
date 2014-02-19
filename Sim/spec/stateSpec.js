describe("game object", function() {
    var game = new GameState();
    it("checks if sites are properly set", function() {
        expect(game.sites).not.toBeNull();
    });
    it("checks if time is properly set", function() {
        expect(game.current_time).not.toBeNull();
    });
    it("checks if tasks are properly set", function() {
        expect(game.tasks).not.toBeNull();
    });
    it("checks if real task effort is properly set", function() {
        expect(game.real_task_effort).not.toBeNull();
    });
    it("checks if development type is properly set", function() {
        expect(game.development_type).not.toBeNull();
    });
    it("checks if problems are properly set", function() {
        expect(game.problems).not.toBeNull();
    });
    it("checks if finance is non negative", function() {
        expect(game.finance).not.toBeLessThan(0);
    });
    it("checks if modules are properly set", function() {
        expect(game.modules).not.toBeNull();
    });
    var initGame = init_GameState();
    it("checks if the init returns a properly defined object", function() {
        expect(initGame).toBeDefined();
    });

});


