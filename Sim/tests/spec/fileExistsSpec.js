describe("File Exists", function() {

    it("checks if file is at specific url", function() {
        expect(UrlExists('http://localhost:3000/data/config_file.json')).toEqual(true);
    });
});