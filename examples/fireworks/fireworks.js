var FW = {
	'foregroundLayer':null,
	'backgroundLayer':null,
	'degreesToRad': Math.PI/180,
	'imageData': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,3,0,0,255,9,0,0,255,10,0,0,255,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,9,0,0,255,25,0,0,255,36,0,0,255,43,0,0,255,44,0,0,255,40,0,0,255,30,0,0,255,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,14,0,0,255,36,0,0,255,54,0,0,255,68,0,0,255,75,0,0,255,77,0,0,255,72,0,0,255,61,0,0,255,45,0,0,255,24,0,0,255,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,11,0,0,255,38,0,0,255,62,0,0,255,83,0,0,255,98,0,0,255,108,0,0,255,110,0,0,255,103,0,0,255,90,0,0,255,72,0,0,255,49,0,0,255,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,29,0,0,255,58,0,0,255,85,0,0,255,109,0,0,255,128,0,0,255,140,0,0,255,142,0,0,255,134,0,0,255,118,0,0,255,96,0,0,255,70,0,0,255,42,0,0,255,12,0,0,0,0,0,0,0,0,0,0,255,11,0,0,255,43,0,0,255,75,0,0,255,105,0,0,255,132,0,0,255,156,0,0,255,172,0,0,255,175,0,0,255,164,0,0,255,144,0,0,255,117,0,0,255,88,0,0,255,58,0,0,255,26,0,0,0,0,0,0,0,0,0,0,255,20,0,0,255,53,0,0,255,86,0,0,255,119,0,0,255,151,0,0,255,180,0,0,255,202,0,0,255,207,0,0,255,191,0,0,255,164,0,0,255,134,0,0,255,101,0,0,255,68,0,0,255,35,0,0,255,1,0,0,0,0,0,0,255,24,0,0,255,58,0,0,255,92,0,0,255,127,0,0,255,161,0,0,255,194,0,0,255,226,0,0,255,238,0,0,255,209,0,0,255,176,0,0,255,142,0,0,255,108,0,0,255,74,0,0,255,40,0,0,255,5,0,0,0,0,0,0,255,24,0,0,255,58,0,0,255,92,0,0,255,126,0,0,255,160,0,0,255,193,0,0,255,224,0,0,255,234,0,0,255,208,0,0,255,175,0,0,255,141,0,0,255,107,0,0,255,74,0,0,255,39,0,0,255,5,0,0,0,0,0,0,255,19,0,0,255,52,0,0,255,85,0,0,255,117,0,0,255,148,0,0,255,176,0,0,255,198,0,0,255,202,0,0,255,187,0,0,255,162,0,0,255,132,0,0,255,100,0,0,255,67,0,0,255,34,0,0,0,0,0,0,0,0,0,0,255,9,0,0,255,41,0,0,255,72,0,0,255,102,0,0,255,129,0,0,255,152,0,0,255,167,0,0,255,170,0,0,255,160,0,0,255,140,0,0,255,115,0,0,255,86,0,0,255,56,0,0,255,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,26,0,0,255,55,0,0,255,82,0,0,255,105,0,0,255,123,0,0,255,135,0,0,255,137,0,0,255,130,0,0,255,114,0,0,255,93,0,0,255,68,0,0,255,40,0,0,255,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,8,0,0,255,34,0,0,255,58,0,0,255,78,0,0,255,93,0,0,255,103,0,0,255,105,0,0,255,99,0,0,255,86,0,0,255,68,0,0,255,45,0,0,255,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,10,0,0,255,32,0,0,255,49,0,0,255,63,0,0,255,70,0,0,255,72,0,0,255,67,0,0,255,56,0,0,255,41,0,0,255,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,4,0,0,255,20,0,0,255,31,0,0,255,38,0,0,255,39,0,0,255,35,0,0,255,26,0,0,255,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,5,0,0,255,5,0,0,255,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'imageOrig': null,
	'allImages': [],
	'SfxInterface': null,
	
	Setup: function(foregroundLayer, backgroundLayer){
		FW.foregroundLayer=foregroundLayer;
		FW.backgroundLayer=backgroundLayer;
		
		
		FW.SfxInterface = new SfxInterface(['Resources/boom.wav']);
		FW.SfxInterface.setVolume(0.2);
		
		/*
		FW.imageData = new Image();
		FW.imageData.src = 'Resources/round-grad.png';
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		ctx.drawImage(FW.imageData, 0, 0);
		
		var st = "";
		st = canvas.toDataURL("image/png") + "<br />";
		
		var imageData = ctx.getImageData(0, 0, 16, 16);
		for(var i in imageData.data)
		{
			st += imageData.data[i] + ",";
		}
		document.getElementById('debugData').innerHTML = st;
		*/
		
		FW.imageOrig = foregroundLayer.ctx.createImageData(16, 16);
		for (var i = 0; i < FW.imageData.length; i+=4)
		{
			FW.imageOrig.data[i+0] = FW.imageData[i+0];//red
			FW.imageOrig.data[i+1] = FW.imageData[i+1];//green
			FW.imageOrig.data[i+2] = FW.imageData[i+2];//blue
			FW.imageOrig.data[i+3] = FW.imageData[i+3];//alpha
		}
		
		//we can't use putImageData because we loose our transparent parts, so we use (new Image()).src = canvas.toDataURL
		var canvas = document.createElement('canvas');
		canvas.width = 16;
		canvas.height = 16;
		var ctx = canvas.getContext('2d');
		
		//create some random colors and make images out of them
		for(var i=0; i < 100; i++)
		{
			var color = new FW.Util.ColorRGBA();
			var newData = FW.Util.ChangeImageColor(FW.imageOrig.data, color);
			
			var tempImage = ctx.createImageData(16, 16);
			for(var j in newData)
				tempImage.data[j] = newData[j];
			ctx.putImageData(tempImage, 0, 0);
			var newImage = new Image();
			newImage.src = canvas.toDataURL("image/png");
			FW.allImages.push(newImage);
		}
		
		
		window.setInterval(FW.Update, 100);
		
		window.setInterval (FW.Draw, 1000/60);
	},
	
	CreateBlast: function(x, y) {
		var particleCount = FW.Util.NextRandom(8, 37);
		var dAngle = 360/particleCount;
		
		var velocity =  FW.Util.NextRandom(8, 31);
		var img = FW.allImages[FW.Util.NextRandom(0, FW.allImages.length)];
		for(var i = 0; i < particleCount; i++)
		{
			FW.foregroundLayer.addChild(new FW.Particle(x, y, 16, 16, (i%particleCount)*dAngle, velocity, img));
		}
		
		FW.SfxInterface.playFileAt(0);
	},
	
	Update: function() {
	
		for(var i in FW.foregroundLayer.children)
		{
			FW.foregroundLayer.children[i].update();
		}
		
		FW.foregroundLayer.needsDisplay = true;//set dirty flag
	},
	
	Draw: function () {
		document.StratiscapeDraw.draw();
		
		if(document.stats)
		{
			document.stats.update();
		}
	},
	
	
	Util: {}
};

FW.Particle = Stratiscape.DrawnObject.extend({ //particle class

	init: function(x, y, width, height, angle, velocity, image) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.wRadius = this.width/2;
		this.hRadius = this.height/2;
		
		this.image = image;
		
		this.velocity = velocity;
		this.angle = angle;
	},
	
	update: function() {
		var offsetX = 0;
		var offsetY = 0;
		if(this.velocity != 0)
		{
			offsetX = this.velocity * Math.cos(this.angle * FW.degreesToRad);
			offsetY = this.velocity * Math.sin(this.angle * FW.degreesToRad);
		}
		
		this.x -= offsetX;
		this.y -= offsetY;
		
		this.velocity -= 1.0;
		if(this.velocity <= 0)
			this.layer.removeChild(this);
	},
	
	draw: function(ctx) {
		//ctx.putImageData(this.image, this.x - this.wRadius, this.y - this.hRadius);
		ctx.drawImage(this.image, this.x - this.wRadius, this.y - this.hRadius);
	}
	
});

/**
 * A ColorRGBA represents the red green blue and alpha of a color
 * @constructor
 */
FW.Util.ColorRGBA = function(r, g, b, a) {
	if(typeof r == "undefined")	r = FW.Util.NextRandom(0, 256);
	if(typeof g == "undefined")	g = FW.Util.NextRandom(0, 256);
	if(typeof b == "undefined") b = FW.Util.NextRandom(0, 256);
	if(typeof a == "undefined")	a = FW.Util.NextRandom(0, 256);
	this.r = r;//red
	this.g = g;//green
	this.b = b;//blue
	this.a = a;//alpha
};

/**
 * multiply returns a new colorRGBA with the r, g, b values multiplied by the multiplyier
 * @this {FW.Util.ColorRGBA}
 * @return {FW.Util.ColorRGBA}
 */
FW.Util.ColorRGBA.prototype.multiply = function(multiplyier) {
	return new FW.Util.ColorRGBA(Math.floor(this.r * multiplyier)
								, Math.floor(this.g * multiplyier)
								, Math.floor(this.b * multiplyier)
								, this.a);
};

/**
 * toString converts a ColorRGBA object to a string the canvas can recognize
 * @this {FW.Util.ColorRGBA}
 * @return {string}
 */
FW.Util.ColorRGBA.prototype.toString = function() {
	return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
};

FW.Util.NextRandom = function(lowInclusive, highExclusive) {

	if(highExclusive === null || typeof highExclusive == "undefined")
	{
		highExclusive = lowInclusive;
		lowInclusive = 0;
	}
	
	if(lowInclusive < 0)
		highExclusive += Math.abs(lowInclusive);
	else
		highExclusive -= lowInclusive;

	return Math.floor(Math.random()*highExclusive) + lowInclusive;
};

FW.Util.ChangeImageColor = function(/*Image bitmap array*/ bmpArr, /*ColorRGBA*/ colorNew) {

	var retBmpArr = new Array(bmpArr.length);
	for (var i = 0; i < bmpArr.length; i+=4)
	{
		if (bmpArr[i+3] != 0)//if the pixel is non-transparent?
		{
			retBmpArr[i+0] = colorNew.r;//red
			retBmpArr[i+1] = colorNew.g;//green
			retBmpArr[i+2] = colorNew.b;//blue
		}
		else//just copy from our source to our return value
		{
			retBmpArr[i+0] = bmpArr[i+0];//red
			retBmpArr[i+1] = bmpArr[i+1];//green
			retBmpArr[i+2] = bmpArr[i+2];//blue
		}
		retBmpArr[i+3] = bmpArr[i+3];//alpha, keep it the same as the source
	}
	
	return retBmpArr;
};