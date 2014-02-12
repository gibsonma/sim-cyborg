describe("File Exists", function() {
    it("checks if file is at specific url", function() {
        expect(UrlExists('http://5.9.212.206:3000/data/config_file.json')).toEqual(true);
    });
});