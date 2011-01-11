describe("EventEmitter", function() {
    var simpleObject,
        simpleCallback,
        exampleKlass,
        exampleInstance,
        exampleCallback,
        tempVar;
    
    
    beforeEach(function() {
        tempVar = '';
        simpleObject = {
            hideMe : function() {
                this.trigger('hidden', {source:this})
            }
        };
        EventEmitter.augment(simpleObject);
        simpleObject.on('hidden', simpleCallback);
        
        exampleKlass = function() {};
        EventEmitter.augment(exampleKlass.prototype);
        exampleKlass.prototype.showMe = function() {
            this.trigger('shown', {source:this, someProp:'someVal'});
        };
        
        exampleCallback = function(e) {tempVar = 'exampleCallback'};
        
        exampleInstance = new exampleKlass();
        exampleInstance.on('shown', exampleCallback);
        
    });
    
    
    
    
    it('should be able to augment an object', function() {
        expect(simpleObject.on).toBeDefined();
    });
    
    it('should fire a bound callback', function() {
        exampleInstance.showMe();
        expect(tempVar).toBe('exampleCallback');
    });
    
    it('should fire multiple bound callbacks', function() {
        var t1 = false,
            t2 = false,
            t3 = false
        exampleInstance.on('shown', function(){
           t1 = true; 
        });
        exampleInstance.on('shown', function(){
           t2 = true; 
        });
        exampleInstance.on('shown', function(){
           t3 = true; 
        });
        exampleInstance.showMe();
        expect(t1).toBeTruthy();
        expect(t2).toBeTruthy();
        expect(t3).toBeTruthy();
    });
    
    it('should fire a bound callback in a given scope context', function() {
        var scope = {
            prop: 'I am the scope'
        };
        exampleInstance.on('shown', function(){
           expect(this.prop).toBe('I am the scope');
        }, scope);
    });
    
    it('should allow for listener removal', function() {
        var t1 = false;
        var tempCallback = function() {
            t1 = true;
        }
        exampleInstance.on('shown', tempCallback);
        exampleInstance.showMe();
        expect(t1).toBeTruthy();
        
        t1 = false;
        exampleInstance.removeListener('shown', tempCallback);
        exampleInstance.showMe();
        expect(t1).toBeFalsy();
    });
    
    it('should pass through the event object', function() {
        var t1 = false;
        var tempCallback = function(e) {
            expect(e.someProp).toBe('someVal');
        }
        exampleInstance.on('shown', tempCallback);
        exampleInstance.showMe();
    });

});