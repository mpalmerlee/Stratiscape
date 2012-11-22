/* 
 * Stratiscape
 * A simple layered Graphics Interface for the HTML5 Canvas tag
 * Stratiscape.js
 * Matt Palmerlee
 *
 */

Stratiscape = function(configObject) {
	/** The config object looks like {'containerId':'id', 'canvasNotSupportedCallback: 'fnptr', 'layers':[{'name':'layer1', x:0, y:0, width:640, height:480,'zIndex':1,'backgroundColor':'black', 'clickCallback':'fnptr', 'dblclickCallback':'fnptr', 'mouseHitId':'id for the page element which will serve as the mouse event listener for this canvas layer'}]} **/
	this.inverseScaleRatio = 1.0;
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
		var mouseHitElm = null;
		if(layerConfig.mouseHitId)
		{
			var me = this;
			mouseHitElm = document.getElementById(layerConfig.mouseHitId);
			if(layerConfig.clickCallback)
			{
				mouseHitElm.layerConfig = layerConfig;
				Stratiscape.Global.onEvent(mouseHitElm, 'click', function(e) {
					var pos = me.getScaledCursorPosition(e);
					(e.srcElement || e.target).layerConfig.clickCallback(pos);
				});
			}
			
			if(layerConfig.dblclickCallback)
			{
				mouseHitElm.layerConfig = layerConfig;
				Stratiscape.Global.onEvent(mouseHitElm, 'dblclick', function(e) {
					var pos = me.getScaledCursorPosition(e);
					(e.srcElement || e.target).layerConfig.dblclickCallback(pos);
				});
			}
		}
		
		var layer = new Stratiscape.Layer(layerId, layerConfig.name, layerConfig.x, layerConfig.y, layerConfig.width, layerConfig.height, layerConfig.zIndex, mouseHitElm);
		this.layers.push(layer);
		this.layersByName[layer.name] = layer;
	}
	
};
/**
 * Gets the cursor position relative to the mouseHitDiv coordinates taking into account the scale ratio
 * @return a position object: {'x':null, 'y':null} with the inverseScaleRatio applied
 */
Stratiscape.prototype.getScaledCursorPosition = function(e) {
	var pos = Stratiscape.Global.getCursorPosition(e);
	//apply the inverseScaleRatio to the mouse position
	if(this.inverseScaleRatio) {
		pos.x *= this.inverseScaleRatio;
		pos.y *= this.inverseScaleRatio;
	}
	return pos;
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
	
	var elm = e.srcElement || e.target;
	
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
};

/**
 * Scales element based on config object passed in
 * @param config object specifying options for scaling the element: {'widthScale':1.5, 'heightScale':1.5, 'lockPosition':false}
 */
Stratiscape.Global.scaleElement = function(el, config, lockPosition) {
	if(!el)
		return;
	el.style.width = (el.width || el.clientWidth) * config.widthScale + "px";
	el.style.height = (el.height || el.clientHeight) * config.heightScale + "px";
	if(!lockPosition) {
		if(el.offsetLeft != 0) {
			el.style.left = el.offsetLeft * config.widthScale + "px";
		}
		if(el.offsetTop != 0) {
			el.style.top = el.offsetTop * config.heightScale + "px";
		}
	}
};

/**
 * Determines best scale ratio based on client screen size and desired padding 
 *  and scales all stratiscape layers and mouse hit elements as appropriate.
 *  Additionally, all elements corresponding to ids passed into the config's additionalElementIds property will be scaled with the lockPosition option on
 * @param config object specifying options for scaling: {'mainWidth':800, 'mainHeight':600, 'paddingWidth':20, 'paddingHeight':60, 'ratioTolerance': 0.02, 'additionalElementIds':['pageContainer','outerDiv']}
 * @return an object for use with scaleElement: {'widthScale': 1.0, 'heightScale': 1.0} in case additional elements need to be scaled by the user
 */
Stratiscape.prototype.scaleLayers = function(config) {
	var returnConfig = {'widthScale': 1.0, 'heightScale': 1.0};
	
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	
	var currentScreenRatio = screenWidth / screenHeight;
	var optimalRatio = config.mainWidth / config.mainHeight;
	var limitRatio = 1;
	var ratioTolerance = config.ratioTolerance || 0.02;
	//only scale if the screen ratio is within the ratio tolerance
	if (currentScreenRatio < (optimalRatio - ratioTolerance) ||
		currentScreenRatio > (optimalRatio + ratioTolerance)) {
		
		var scaleToFitX = screenWidth / (config.mainWidth + (config.paddingWidth || 0));
		var scaleToFitY = screenHeight / (config.mainHeight + (config.paddingHeight || 0));

		var limitRatio = Math.min(scaleToFitX, scaleToFitY);
		
		returnConfig = {'widthScale': limitRatio, 'heightScale': limitRatio};
		
		//scale canvas layers
		for(var i in this.layers)
		{
			var layer = document.StratiscapeDraw.layers[i];
			Stratiscape.Global.scaleElement(layer.canvas, returnConfig);
			if(layer.mouseHitElm) {
				Stratiscape.Global.scaleElement(layer.mouseHitElm, returnConfig);
			}
		}
		
		//scale additionalElementIds if specified with the lockPosition option
		if(config.additionalElementIds) {
			for(var i in config.additionalElementIds) {
				Stratiscape.Global.scaleElement(document.getElementById(config.additionalElementIds[i]), returnConfig, true);
			}
		}
		
		//right now there is a problem in the position of the mouse hit detectors when scaling
		// couldn't figure out a better way than to reverse apply the scale to the mouse position
		this.inverseScaleRatio = 1.0 / limitRatio;
	}
	
	return returnConfig;
};

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

Stratiscape.Layer = function(id, name, x, y, width, height, zIndex, mouseHitElm) {
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
	
	this.mouseHitElm = null;
	if(mouseHitElm)
		this.mouseHitElm = mouseHitElm;
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

Stratiscape.Layer.prototype.clear = function() {

	for(var i in this.children){
		this.children[i].layer = null;//remove backreference
	}

	this.children = [];
	this.needsDisplay = true;
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
