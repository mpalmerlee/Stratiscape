DandelionBackground = {

	dandelions: [],
	image: null,
	dandelionsLoadedCallback: null,//function to call once dandelion image is loaded and objects are populated
	degreesToRad: Math.PI/180,
	windAngle: 90,
	windSpeed: 0,
	
	populateDandelions: function(number, dandelionsLoadedCallback) {
		this.dandelionsLoadedCallback = dandelionsLoadedCallback;
		
		this.image = new Image();
		this.image.onload = function() {
			DandelionBackground.doneLoadingImage(number);
		};
		this.image.src = "img/dandelion-transparent.png";
		
	},
	
	doneLoadingImage: function(number) {
		var xHigh = 640 - 32;
		var yHigh = 480 - 57;
		for(var i = 0; i < number; i++)
		{
			var x = DandelionBackground.nextRandomInt(0, xHigh + 1);
			var y = DandelionBackground.nextRandomInt(0, yHigh + 1);
			DandelionBackground.dandelions.push(new Dandelion(x, y, 32, 57));
		}
		
		if(typeof DandelionBackground.dandelionsLoadedCallback == 'function')
		{
			DandelionBackground.dandelionsLoadedCallback();
		}
	},
	
	moveDandelions: function() {
		for(var i in this.dandelions)
		{
			this.dandelions[i].randomMove();
		}
	},
	
	nextRandomInt: function(lowInclusive, highExclusive) {

		if(highExclusive === null)
		{
			highExclusive = lowInclusive;
			lowInclusive = 0;
		}
		
		if(lowInclusive < 0)
			highExclusive += Math.abs(lowInclusive);

		return Math.floor(Math.random()*highExclusive) + lowInclusive;
	},
	
	nextRandomFloat: function(low, high) {

		if(high === null)
		{
			high = low;
			low = 0;
		}
		
		if(low < 0)
			high += Math.abs(low);
		
		high += 0.0000001;

		return Math.random()*high + low;
	}
};

Dandelion = Stratiscape.DrawnObject.extend({ //wheel drawn object class

	init: function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rotation = 0;
	},
	
	randomMove: function() {
		var windX = 0;
		var windY = 0;
		if(DandelionBackground.windSpeed > 0)
		{
			windX = DandelionBackground.windSpeed * Math.cos(DandelionBackground.windAngle * DandelionBackground.degreesToRad);
			windY = DandelionBackground.windSpeed * Math.sin(DandelionBackground.windAngle * DandelionBackground.degreesToRad);
		}
		var offsetX = windX;
		var offsetY = windY;
		//dandelions closer to the center of the pinwheel should move faster away
		
		var midX = this.x + this.width/2;
		var midY = this.y + this.height/2;
		if(midX > 170 && midX < 470 && midY > 90 && midY < 390)
		{
			var distanceX =  midX - (170 + 150);
			var distanceY = midY - (90 + 150);
			
			var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
			
			var closeness = (150 - distance) / 150;
			if(closeness > 0.1)
			{
				if(distanceX < 0)
					offsetX += closeness * -10;
				else 
					offsetX += closeness * 10;
				if(distanceY < 0)
					offsetY += closeness * -10;
				else
					offsetY += closeness * 10;
					
				if(this.rotation > 0)
					this.rotation += closeness * 1;
				else
					this.rotation -= closeness * 1;
			}
		}
		
		
		//sometimes don't move
		if(offsetX != 0 || offsetY != 0)
		{
			
			offsetX += DandelionBackground.nextRandomFloat(-0.5, 0.5);
			offsetY += DandelionBackground.nextRandomFloat(-0.5, 0.5);
			this.x += offsetX;
			this.y += offsetY;
			
			this.rotation += DandelionBackground.nextRandomFloat(-1.5, 1.5);
			
			//wrap
			if(this.x > 640)
				this.x = 0 - this.width;//DandelionBackground.nextRandomInt(0, 640 - this.width);
			else if(this.x < 0 - this.width)
				this.x = 640;
			if(this.y > 480)
				this.y = 0 - this.height;
			else if(this.y < 0 - this.height)
				this.y = 480;
		}
	},
	
	draw: function(ctx) {
	
		if(this.rotation != 0)
		{
			ctx.save();
			ctx.translate( this.x, this.y );
			ctx.rotate( this.rotation * DandelionBackground.degreesToRad);
			//ctx.translate( -objectRotationCenterX, -objectRotationCenterY );
			ctx.drawImage( DandelionBackground.image, 0, 0 );
			ctx.restore();
		}
		else
			ctx.drawImage(DandelionBackground.image, this.x, this.y);
	}
	
});