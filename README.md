EventEmitter
============

EventEmitter is a Javascript mixin for creating custom events, not bound to the DOM.

Methods
-------

* EventEmitter.augment(MyClass.prototype);
* myInstance.on('asyncCompleted', function(e) {console.dir(e);});
* myInstance.trigger('asyncCompleted', {key1:'value1', key2:'value2', source:myInstance});

Tests are written using Jasmine, and can be run by opening test/SpecRunner.html in a browser.