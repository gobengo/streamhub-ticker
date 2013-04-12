define([
    'jasmine',
    'streamhub-ticker/views/TickerView',
    'streamhub-sdk',
    'streamhub-sdk/streams',
    '../MockStream',
    'jasmine-jquery'],
function (jasmine, TickerView, Hub, Streams, MockStream) {
describe('A TickerView', function () {
    it ("can have tests run", function () {
        expect(true).toBe(true);
    });
    it("can do HTML tests",function(){  
        setFixtures('<div id="hub"></div>');  
        $('#hub')
            .append('<li>So</li>')
            .append('<li>So</li>');
        expect($('#hub li').length).toBe(2);  
    });
	
	// construction behavior
    describe('can be constructed', function() {
    	it ("with no options", function () {
	        var view = new TickerView();
        	expect(view).toBeDefined();
    	});
    	it ("with empty options", function () {
        	var view = new TickerView({});
        	expect(view).toBeDefined();
    	});
    	it ("with only a Mock Hub.Collection", function () {
        	var view = new TickerView({
            	streams: new Streams({main: new MockStream()})
        	});
    	    expect(view).toBeDefined();
    	});
	    it ("with an el", function () {
	        setFixtures('<div id="hub-TickerView"></div>');  
	        var view = new TickerView({
	            el: $('#hub-TickerView')
	        });
	        expect(view).toBeDefined();
	    });
	    it ("with an el and Mock Hub.Collection", function () {
	        setFixtures('<div id="hub-TickerView"></div>');  
	        var view = new TickerView({
	            streams: new Streams({main: new MockStream()}),
	            el: $('#hub-TickerView')
	        });
	        expect(view).toBeDefined();
	    });
	    it ("with an el and Mock Hub.Collection and a mock feed collection", function () {
	        setFixtures('<div id="hub-TickerView"></div>');  
	        var view = new TickerView({
	            streams: new Streams({main: new MockStream()}),
	            el: $('#hub-TickerView'),
	            feedStreams: new Streams({main: new MockStream()})
	        });
	        expect(view).toBeDefined();
	    });
	});
	
	// post construction behavior    
    describe ("after correct construction", function () {
	    var view;
	    
	    beforeEach(function() {
	        setFixtures(
		        '<style>.hub-item{margin:0;padding:0;display:inline-block;width:50px;height:1px;'+
		        'overflow:hidden;}</style><div style="position:relative;">'+
		        '<div id="hub-TickerView" style="position:absolute;overflow-x:scroll;height:0px;'+
		        'white-space:nowrap;"></div></div>'
		    );
	        view = new TickerView({
	            streams: new Streams({main: new MockStream()}),
	            el: $('#hub-TickerView').get(0),
	            feedStreams: new Streams({main: new MockStream()})
	        });
		});
        it ("should contain 50 mock items & childViews after setRemote", function () {
            view.streams.start();
            expect(Object.keys(view.childViews).length).toBe(50);
            expect(view.$el.find('.hub-item').length).toBe(50);
        });
        it ("should have scrolled all the way right after data was received", function () {
            view.$el.width(100);
            
            var spy = jasmine.createSpy();
            view.on('add', spy);
            view.streams.start();
            waitsFor(function() {
                return spy.callCount == 50 && !view.isScrolling;
            });
            runs(function() {
                expect(spy.callCount).toBe(50);
	            expect(view.$el[0].scrollWidth).toBe(50 * 50); //items.count * item.width
	            expect(view.$el.scrollLeft()).toBe(50 * 50 - 100); //bootstrap * item.width - el.width
                expect(view.$el.find('article.content').length).toBe(50);
            });                   
        });
        it ("should be scrollable to a piece of content", function () {
            view.$el.width(100);
            view.streams.start();
            view.$el.stop(true, true);

            view.scrollTo('49');
            waitsFor(function() {
                return !view.isScrolling;
            });
            runs(function() {
	            expect(view.$el.scrollLeft()).toBe(50 * 50 - 100); //item.id+1 * item.width - el.width);
            });
        });
        it ("should be scrollable to a piece of content", function () {
            view.$el.width(100);
            view.streams.start();
            view.$el.stop(true, true);

            
            view.scrollTo('0');
            waitsFor(function() {
                return !view.isScrolling;
            });
            runs(function() {
                expect(view.$el.scrollLeft()).toBe(0); // it will stop at 0
            });
        });
        it ("should be scrollable to a piece of content", function () {
            view.$el.width(100);
            view.streams.start();
            view.$el.stop(true, true);


            view.scrollTo('19');
            waitsFor(function() {
                return !view.isScrolling;
            });
            runs(function() {
	            expect(view.$el.scrollLeft()).toBe(20 * 50 - 100); //item.id+1 * item.width - el.width
            });
        });
        it ("should have populated the feed view collections after feedCol.setRemote", function () {
            view.streams.start();
            view.feedStreams.start();
            var keys = Object.keys(view.childViews);
            var total = 0;
            for (i in keys) {
            	feedCol = Object.keys(view.childViews[keys[i]].feedView.childContent);
            	total = total + feedCol.length;
            	expect(feedCol.length).toBeLessThan(3);
            }
        	expect(total).toBe(50);
        });
    });
}); 
});