describe("Json Related Functions", function() {

    it("checks if file is at specific url", function() {
        expect(jsonExistsParses('http://localhost:3000/data/config_file.json')).toEqual(true);
    });
});