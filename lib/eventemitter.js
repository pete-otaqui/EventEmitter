/**
 * EventEmitter Mixin
 *
 * Designed to be used in conjunction with a mixin "augment" function,
 * such as http://chamnapchhorn.blogspot.com/2009/05/javascript-mixins.html
 *
 * @usage augment(MyClass, EventEmitter);
 * my_inst = new MyClass();
 * my_inst.on('someEvent', function(e){ console.dir(e); });
 * my_inst.trigger('someEvent', {eventProp:'value'});
 * 
 * @example
 * // create a 'class'
 * MyClass = function() {}
 * // augment it with EventEmitter
 * EventEmitter.augment(MyClass.prototype);
 * // create a method, which triggers an event
 * MyClass.prototype.scrollComplete = function() {
 *     this.trigger('scrolled', {baz:'eck'});
 * };
 * 
 * // this callback is pulled out into a named function so that we can unbind it
 * var callback = function(e) {
 *     console.log('the scrolled event was fired! this.foo='+this.foo+', e.baz='+e.baz);
 * };
 * // create an instance of th class
 * var myinstance = new MyClass();
 * // set a property on the instance
 * myinstance.foo = 'bar';
 * // bind to the scrollComplete event
 * myinstance.on('scrolled', callback, myinstance);
 * // fire the method, which should trigger the event and therefore our callback
 * myinstance.scrollComplete();
 * // unbind the event, so that our callback should not get called
 * myinstance.removeListener('scrolled', callback);
 * // this should now not fire the callback
 * myinstance.scrollComplete();
 */
var EventEmitter = function() {};
/**
 * Bind a callback to an event, with an option scope context
 *
 * @param {string} name the name of the event
 * @param {function} callback the callback function to fire when the event is triggered
 * @param {object} context to use for the callback (which will become 'this' inside the callback)
 */
EventEmitter.prototype.on = function(name, callback, context) {
    var f;
    if (!context) context = this;
    if (!this.__ee_listeners[name]) this.__ee_listeners[name] = [];
    if (!this.__ee_unbinders[name]) this.__ee_unbinders[name] = [];
    f = function(e) {
        callback.apply(context, [e]);
    };
    this.__ee_unbinders[name].push(callback);
    this.__ee_listeners[name].push(f);
};
/**
 * Bind a callback to an event for a single execution, with an option scope context -
 * the callback will be unbound after the event is first triggered
 *
 * @param {string} name the name of the event
 * @param {function} callback the callback function to fire when the event is triggered
 * @param {object} context to use for the callback (which will become 'this' inside the callback)
 */
EventEmitter.prototype.once = function(name, callback, context) {
    var f, orig = this;
    if (!context) context = this;
    f = function(e) {
        callback.apply(context, [e]);
        orig.removeListener(name, f);
    };
    this.on(name, f, context);
};
/**
 * Trigger an event, firing all bound callbacks
 * 
 * @param {string} name the name of the event
 * @param {object} event the event object to be passed through to the callback
 */
EventEmitter.prototype.trigger = function(name, event) {
    if (event === undefined) event = {};
    if (!this.__ee_listeners[name]) return;
    var i = this.__ee_listeners[name].length;
    while (i--) this.__ee_listeners[name][i](event);
};
/**
 * Remove a bound listener
 * 
 * @param {string} name the name of the event
 * @param {object} event the event object to be passed through to the callback
 */
EventEmitter.prototype.removeListener = function(name, callback) {
    if (!this.__ee_unbinders[name]) return;
    var i = this.__ee_unbinders[name].length;
    while (i--) {
        if (this.__ee_unbinders[name][i] === callback) {
            this.__ee_unbinders[name].splice(i, 1);
            this.__ee_listeners[name].splice(i, 1);
        }
    }
};
/**
 * Augment an object with the EventEmitter mixin
 * 
 * @param {object} obj The object to be augmented (often an object's protoype)
 */
EventEmitter.augment = function(obj) {
    for (var method in EventEmitter.prototype) {
        if (!obj[method]) obj[method] = EventEmitter.prototype[method];
    }
    obj.__ee_listeners = {};
    obj.__ee_unbinders = {};
};
