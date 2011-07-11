/* 
 * jCanvas
 * A simple layered Graphics Interface for the HTML5 Canvas tag
 * jCanvas.js
 * Matt Palmerlee
 *
 */

jCanvas = function(configObject) {
	/** The config object looks like {'containerSelector':'#id', 'layers':[{'name':'layer1', x:0, y:0, width:640, height:480,'zIndex':1,'backgroundColor':'black', 'clickCallback':'fnptr', 'dblclickCallback':'fnptr', 'mouseHitSelector':'#id for the page element which will serve as the mouse event listener for this canvas layer'}]} **/
	this.layers = [];
	this.layersByName = {};//layer objects indexed by name
	this.containerSelector = configObject.containerSelector;
	this.container = $(this.containerSelector);
	//this.clickHitContainer = $('<div style="position: relative;"></div>');//TODO: give id?
	//this.container.after(this.clickHitContainer);

	configObject.layers.sort(this.layerSortFunction);
	
	//var lastClickHitDiv = this.clickHitContainer;
	for(var i in configObject.layers)
	{
		var layerConfig = configObject.layers[i];
		var zIndex = layerConfig.zIndex;
		if(zIndex >= 0)
		{
			if(jCanvas.Global.layerNextZIndex <= zIndex)
				jCanvas.Global.layerNextZIndex = zIndex + 1;
		}
		else
		{
			zIndex = jCanvas.Global.layerNextZIndex++;
		}
		var selector = 'lyr_' + layerConfig.name + zIndex;
		var backgroundColor = '';
		if(layerConfig['backgroundColor'])
			backgroundColor = 'background-color:' + layerConfig['backgroundColor'] + ';';
		
		var canvas = $('<canvas id="'+selector+'" width="'+layerConfig.width+'" height="'+layerConfig.height+'" style="position:absolute;left:'+layerConfig.x+'px;top:'+layerConfig.y+'px;z-index:'+layerConfig.zIndex+';' + backgroundColor + '"></canvas>');
		//apparently we can't have a canvas inside another canvas, so we make these divs to capture the mouse clicks
		//var canvasClickHitDiv = $('<div id="'+'hitdiv_' + layerConfig.name + zIndex+'" style="position:absolute;left:'+layerConfig.x+'px;top:'+layerConfig.y+'px;z-index:'+(layerConfig.zIndex*100)+';width:'+layerConfig.width+'px;height:'+layerConfig.height+'px"></div>');

		this.container.append(canvas);
		//lastClickHitDiv.append(canvasClickHitDiv);
		//lastClickHitDiv = canvasClickHitDiv;//we append to the last click hit div (instead of always the container) so that the js event bubbling will work correctly
		
		if(layerConfig.mouseHitSelector)
		{
			if(layerConfig.clickCallback)
			{
				$(layerConfig.mouseHitSelector).live('click',{'mouseHitDiv':$(layerConfig.mouseHitSelector) ,'clickCallback':layerConfig.clickCallback}, function(e) {
					var pos = jCanvas.Global.getCursorPosition(e, e.data.mouseHitDiv);
					e.data.clickCallback(pos);
				});
			}
			
			if(layerConfig.dblclickCallback)
			{
				$(layerConfig.mouseHitSelector).live('dblclick',{'mouseHitDiv':$(layerConfig.mouseHitSelector) ,'dblclickCallback':layerConfig.dblclickCallback}, function(e) {
					var pos = jCanvas.Global.getCursorPosition(e, e.data.mouseHitDiv);
					e.data.dblclickCallback(pos);
				});
			}
		}
			
			
		var layer = new jCanvas.Layer('#' + selector, layerConfig.name, layerConfig.x, layerConfig.y, layerConfig.width, layerConfig.height, zIndex);
		this.layers.push(layer);
		this.layersByName[layer.name] = layer;
		
	}
	
};

jCanvas.Global = {layerNextZIndex: 1};

//returns a position object: {'x':null, 'y':null}
jCanvas.Global.getCursorPosition = function(e, mouseHitDiv) {
	//get Cursor Position relative to the mouseHitDiv coordinates
	var pos = {'x':null, 'y':null};

	if (e.pageX != undefined && e.pageY != undefined) {
		pos.x = e.pageX;
		pos.y = e.pageY;
	}
	else {
		pos.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		pos.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	var positionOffset = mouseHitDiv.offset();
	pos.x -= positionOffset.left;
	pos.y -= positionOffset.top;
	//pos.x -= e.data.mouseHitDiv[0].offsetLeft;
	//pos.y -= e.data.mouseHitDiv[0].offsetTop;
	
	return pos;
};

jCanvas.prototype.getLayer = function(name){
	if(this.layersByName[name])
		return this.layersByName[name];
	else
		return null;
};

jCanvas.prototype.draw = function() {
	for(var i in this.layers)
	{
		if(this.layers[i].needsDisplay)
		{
			this.layers[i].draw();
		}
	}
};

jCanvas.prototype.layerSortFunction = function(a, b) {
	if(a.zIndex > b.zIndex)
		return 1;
	else if(a.zIndex < b.zIndex)
		return -1;
	else
		return 0;
};

jCanvas.Layer = function(selector, name, x, y, width, height, zIndex) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.zIndex = zIndex;
	
	this.children = [];
	this.needsDisplay = false;//dirty flag
	
	this.canvas = $(selector);
	this.ctx = this.canvas[0].getContext("2d");
	
};

jCanvas.Layer.prototype.draw = function() {
	this.ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);
	
	for(var i in this.children)
	{
		if(typeof this.children[i].draw == 'function')
		{
			this.children[i].draw(this.ctx);
		}
	}
	
	this.needsDisplay = false;//set dirty flag to clean
};

jCanvas.Layer.prototype.isInBounds = function(x, y) {
	if(this.x <= x && this.y <= y && this.x + this.width >= x && this.y + this.height >= y)
		return true;
	else
		return false;
};

jCanvas.Layer.prototype.addChild = function(drawnObject) {
	drawnObject.layer = this;//populate layer back-reference
	this.children.push(drawnObject);
	this.needsDisplay = true;//should we do this here, or make the user do this?
};


/** jCanvas.DrawnObject is an abstract class and should not be instantiated directly **/
//uses John Resig's Simple JS Inheritance lib:
//http://ejohn.org/blog/simple-javascript-inheritance/
jCanvas.DrawnObject = Class.extend({ //abstract class

	init: function() {
		this.x = 0;
		this.y = 0;
		this.layer = null;//for convenience back-reference
	},
	
	draw: function(ctx) {
		return;
	},

	isInBounds: function(x, y) {
		return false;
	}
});
