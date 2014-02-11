describe("game object", function() {
	var game = new game_state();
    it("check if sites are properly set", function() {
        expect(game.sites).not.toBeNull();
    });
     it("check if time is properly set", function() {
        expect(game.current_time).not.toBeNull();
    });
      it("check if tasks are properly set", function() {
        expect(game.tasks).not.toBeNull();
    });
      it("check if real task effort is properly set", function() {
        expect(game.real_task_effort).not.toBeNull();
    });
       it("check if development type is properly set", function() {
        expect(game.development_type).not.toBeNull();
    });
       it("check if problems are properly set", function() {
        expect(game.problems).not.toBeNull();
    });
       it("check if finance is non negative", function() {
        expect(game.finance).not.toBeLessThan(0);
    });
        it("check if modules are properly set", function() {
        expect(game.modules).not.toBeNull();
    });
       it("check if subsystems are properly set", function() {
        expect(game.subsystems).not.toBeNull();
    });
});