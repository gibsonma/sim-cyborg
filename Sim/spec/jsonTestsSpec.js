describe("Json Related Functions", function() {

    it("checks if file is at specific url", function() {
        expect(jsonExistsParses('data/config_file.json')).toEqual(true);
    });
});
