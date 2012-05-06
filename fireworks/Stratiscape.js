/* 
 * Stratiscape
 * A simple layered Graphics Interface for the HTML5 Canvas tag
 * Stratiscape.js
 * Matt Palmerlee
 *
 */

Stratiscape = function(configObject) {
	/** The config object looks like {'containerId':'id', 'canvasNotSupportedCallback: 'fnptr', 'layers':[{'name':'layer1', x:0, y:0, width:640, height:480,'zIndex':1,'backgroundColor':'black', 'clickCallback':'fnptr', 'dblclickCallback':'fnptr', 'mouseHitId':'id for the page element which will serve as the mouse event listener for this canvas layer'}]} **/
	this.layers = [];
	this.layersByName = {};//layer objects indexed by name
	this.container = document.getElementById(configObject.containerId);
	
	var containerHTML = this.container.innerHTML;
	
	//check to see if the canvas tag is not supported
	if(!document.createElement('canvas').getContext)
	{
		this.canvasSupported = false;
		//todo: is this callback really necessary?
		if(configObject.canvasNotSupportedCallback)
		{
			configObject.canvasNotSupportedCallback();
		}
		return;//might as well quit now
	}
	this.canvasSupported = true;

	configObject.layers.sort(this.layerSortFunction);
	
	
	for(var i in configObject.layers)
	{
		var layerConfig = configObject.layers[i];
		if(layerConfig.zIndex >= 0)
		{
			if(Stratiscape.Global.layerNextZIndex <= layerConfig.zIndex)
				Stratiscape.Global.layerNextZIndex = layerConfig.zIndex + 1;
		}
		else
		{
			layerConfig.zIndex = Stratiscape.Global.layerNextZIndex++;
		}
		var layerId = 'lyr_' + layerConfig.name + layerConfig.zIndex;
		var backgroundColor = '';
		if(layerConfig['backgroundColor'])
			backgroundColor = 'background-color:' + layerConfig['backgroundColor'] + ';';
		
		containerHTML += '<canvas id="'+layerId+'" width="'+layerConfig.width+'" height="'+layerConfig.height+'" style="position:absolute;left:'+layerConfig.x+'px;top:'+layerConfig.y+'px;z-index:'+layerConfig.zIndex+';' + backgroundColor + '"></canvas>';
	}
	
	this.container.innerHTML = containerHTML;
	
	//second pass for the mouse hit detection and actually creating the layers
	for(var i in configObject.layers)
	{
		var layerConfig = configObject.layers[i];
		var layerId = 'lyr_' + layerConfig.name + layerConfig.zIndex;
		
		//apparently we can't have a canvas inside another canvas, so we make use of the passed in mouseHitId elements to capture the mouse clicks
		if(layerConfig.mouseHitId)
		{
			var mouseHitElm = document.getElementById(layerConfig.mouseHitId);
			if(layerConfig.clickCallback)
			{
				mouseHitElm.layerConfig = layerConfig;
				Stratiscape.Global.onEvent(mouseHitElm, 'click', function(e) {
					var pos = Stratiscape.Global.getCursorPosition(e);
					e.srcElement.layerConfig.clickCallback(pos);
				});
			}
			
			if(layerConfig.dblclickCallback)
			{
				mouseHitElm.layerConfig = layerConfig;
				Stratiscape.Global.onEvent(mouseHitElm, 'dblclick', function(e) {
					var pos = Stratiscape.Global.getCursorPosition(e);
					e.srcElement.layerConfig.dblclickCallback(pos);
				});
			}
		}
		
		var layer = new Stratiscape.Layer(layerId, layerConfig.name, layerConfig.x, layerConfig.y, layerConfig.width, layerConfig.height, layerConfig.zIndex);
		this.layers.push(layer);
		this.layersByName[layer.name] = layer;
	}
	
};

Stratiscape.Global = {layerNextZIndex: 1};

//returns a position object: {'x':null, 'y':null}
Stratiscape.Global.getCursorPosition = function(e) {
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
	
	var elm = e.srcElement;
	
	do {
		pos.x -= elm.offsetLeft || 0;
        pos.y -= elm.offsetTop || 0;
        elm = elm.offsetParent;
    } while(elm);
	
	
	return pos;
};

Stratiscape.Global.onEvent = function(elem, type, callback) {
	if ( elem.addEventListener ) {
		elem.addEventListener( type, callback, false );

	} else if ( elem.attachEvent ) {
		elem.attachEvent( "on" + type, callback );
	}
}

Stratiscape.prototype.getLayer = function(name){
	if(this.layersByName[name])
		return this.layersByName[name];
	else
		return null;
};

Stratiscape.prototype.draw = function() {
	for(var i in this.layers)
	{
		if(this.layers[i].needsDisplay)
		{
			this.layers[i].draw();
		}
	}
};

Stratiscape.prototype.layerSortFunction = function(a, b) {
	if(a.zIndex > b.zIndex)
		return 1;
	else if(a.zIndex < b.zIndex)
		return -1;
	else
		return 0;
};

Stratiscape.Layer = function(id, name, x, y, width, height, zIndex) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.zIndex = zIndex;
	
	this.children = [];
	this.needsDisplay = false;//dirty flag
	
	this.canvas = document.getElementById(id);
	this.ctx = this.canvas.getContext("2d");
	
};

Stratiscape.Layer.prototype.draw = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	for(var i in this.children)
	{
		if(typeof this.children[i].draw == 'function')
		{
			this.children[i].draw(this.ctx);
		}
	}
	
	this.needsDisplay = false;//set dirty flag to clean
};

Stratiscape.Layer.prototype.isInBounds = function(x, y) {
	if(this.x <= x && this.y <= y && this.x + this.width >= x && this.y + this.height >= y)
		return true;
	else
		return false;
};

Stratiscape.Layer.prototype.addChild = function(drawnObject) {
	drawnObject.layer = this;//populate layer back-reference
	this.children.push(drawnObject);
	this.needsDisplay = true;//should we do this here, or make the user do this?
};

Stratiscape.Layer.prototype.removeChild = function(drawnObject) {
	var index = this.children.indexOf(drawnObject);
	if(index != -1)
	{	
		drawnObject.layer = null;//remove backreference
		this.children.splice(index, 1);
		this.needsDisplay = true;
	}
};


/** Stratiscape.DrawnObject is an abstract class and should not be instantiated directly **/
//uses John Resig's Simple JS Inheritance lib:
//http://ejohn.org/blog/simple-javascript-inheritance/
Stratiscape.DrawnObject = Class.extend({ //abstract class

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
