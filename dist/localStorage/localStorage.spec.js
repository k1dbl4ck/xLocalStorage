import { storage } from './localStorage';
describe('localStorage', function () {
    it('should create a class', function () {
        expect(storage).toBeDefined();
    });
    it('should be able to initialize', function (done) {
        storage.init().then(function () {
            expect(1).toEqual(1);
            done();
        });
    });
    it('should be able to set a value', function (done) {
        storage.setItem('test', 'value').then(function () {
            expect(1).toEqual(1);
            done();
        }).catch(function (err) {
            fail('Could not set a value : ' + err);
            done();
        });
    });
    it('should be able to get a value', function (done) {
        var result = storage.getItem('test');
        expect(result).toEqual("value");
        done();
    });
    it('should be able to get a key by index', function (done) {
        var result = storage.key(0);
        expect(result).toEqual("test");
        done();
    });
    it('should be able to return total storage length', function (done) {
        var result = storage.length();
        expect(result).toEqual(1);
        done();
    });
    it('should be able to remove a value', function (done) {
        storage.removeItem('test');
        var result = storage.getItem('test');
        expect(result).toEqual(null);
        done();
    });
    it('should be able to remove all values', function (done) {
        storage.setItem('test', 'value').then(function () {
            storage.clear();
            var result = storage.length();
            expect(result).toEqual(0);
            done();
        }).catch(function (err) {
            fail('Could not set a value to remove : ' + err);
            done();
        });
    });
});
//# sourceMappingURL=localStorage.spec.js.map