Pinwheel = {

	wheels: [],
	wheelAngles: [],//starting angles of wheels
	degreesToRad: Math.PI/180,
	angleToLocation: {},//computed angle to {x:0,y:0} type location objects
	positionZeroOverlayImage: null,
	
	init: function(pinwheelsReadyCallback) {
		this.positionZeroOverlayImage = new Image();
		this.positionZeroOverlayImage.onload = function() {
			pinwheelsReadyCallback();
		};
		this.positionZeroOverlayImage.src = "img/wheel-pos-0-overlay.png";
	},
	
	populateWheels: function() {
		var wheelColorMids = ['#FF7F7F', '#FFB27F', '#FFE97F', '#7FFF8E', '#7FFFC5', '#7FFFFF', '#7FC9FF', '#7F92FF', '#A17FFF', '#D67FFF', '#FF7FED', '#FF7FB6'];
		var wheelColorStops = ['#FF0000', '#FF6A00', '#FFD800', '#00FF21', '#00FF90', '#00FFFF', '#0094FF', '#0026FF', '#4800FF', '#B200FF', '#FF00DC', '#FF006E'];
		var angle = 225; //the first wheel is to be in the top left
		for(var i=0; i < wheelColorStops.length; i++)
		{
			this.wheelAngles.push(angle)

			angle -= 30;
			if(angle < 0)
				angle += 360;
		}
		
		
		for(var i=0; i < wheelColorStops.length; i++)
		{
			this.wheels.push(new Pinwheel.Wheel(i, this.wheelAngles[i], 150, 150, '#FFFFFF', wheelColorMids[i], wheelColorStops[i]));
		}
	},
	
	rotateWheels: function(change) {
		
		for(var i=0; i < this.wheels.length; i++)
		{
			var angle = this.wheels[i].angle;
			angle -= change;
			
			while(angle < 0)
				angle += 360;
			while(angle >= 360)
				angle -= 360;
				
			this.wheels[i].updateAngle(angle);
		}
	}

};

Pinwheel.Wheel = jCanvas.DrawnObject.extend({ //wheel drawn object class

	init: function(position, angle, width, height, colorStart, colorMid, colorStop) {
		this.position = position;
		this.width = width;
		this.height = height;
		
		this.colorStart = colorStart;
		this.colorMid = colorMid;
		this.colorStop = colorStop;
		
		this.updateAngle(angle);
	},
	
	updateAngle: function(angle) {
		this.angle = angle;
		if(!(angle in Pinwheel.angleToLocation))
		{
			var x = 0;
			var y = 0;
			x = this.width + (this.width/2) * Math.cos(angle * Pinwheel.degreesToRad);
			y = this.height + (this.height/2) * Math.sin(angle * Pinwheel.degreesToRad);
			Pinwheel.angleToLocation[angle] = {'x':x, 'y':y};
		}
		this.x = Pinwheel.angleToLocation[angle].x;
		this.y = Pinwheel.angleToLocation[angle].y;
	},
	
	draw: function(ctx) {
	
		if(this.position == 0)
			return;//we never actaully draw the 0 radial gradient, it's handled by the image at the end
	
		var halfWidth = this.width/2;
		
		var radgrad = ctx.createRadialGradient( this.x,
												this.y,
												1,
												this.x,
												this.y,
												halfWidth);
		radgrad.addColorStop(0, this.colorStart);
		radgrad.addColorStop(0.4, this.colorMid);
		radgrad.addColorStop(0.9, this.colorStop);
		radgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
		ctx.fillStyle = radgrad;
		ctx.fillRect(0,0,300,300);

		if(this.position == 11)
		{
			var wheelZero = Pinwheel.wheels[0];
			//ctx.drawImage(Pinwheel.positionZeroOverlayImage, wheelZero.x - halfWidth + 1, wheelZero.y - halfWidth + 1);
			
			ctx.save();
			ctx.translate( wheelZero.x, wheelZero.y);
			//ctx.translate( wheelZero.x - halfWidth + 1, wheelZero.y - halfWidth + 1);
			//ctx.rotate( wheelZero.angle + (Pinwheel.degreesToRad * 68.5) );//TODO: this is just what worked for starting pos, there is probably a better way than this magic number
			ctx.rotate( (wheelZero.angle - 225) *  Pinwheel.degreesToRad);
			ctx.translate( -75 , -75 );
			ctx.drawImage( Pinwheel.positionZeroOverlayImage, 0, 0 );
			ctx.restore();
		}
	}
	
});