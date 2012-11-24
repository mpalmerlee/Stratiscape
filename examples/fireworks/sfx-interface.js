SfxInterface = function(fileNames) {
	this.Volume = 1.0;
	
	this.muted = false;
	
	this.fileNames = fileNames;
	this.audioObjects = {};//indexed by filename
	
	for(var i in fileNames)
	{
		this.audioObjects[fileNames[i]] = [];
		for(var j = 0; j < 3; j++)
			this.audioObjects[fileNames[i]].push(this.createAudioObject(fileNames[i]));
	}
	
}

SfxInterface.prototype.toggleMute = function() {
	this.muted = !this.muted;
	
	for(var filename in this.audioObjects)
	{
		for(var i = 0; i < this.audioObjects[filename].length; i++)
		{
			this.audioObjects[filename][i].muted = this.muted;
		}
	}
	
};

SfxInterface.prototype.setVolume = function(volume) {
	this.Volume = volume;
	
	for(var filename in this.audioObjects)
	{
		for(var i = 0; i < this.audioObjects[filename].length; i++)
		{
			this.audioObjects[filename][i].volume = this.Volume;
		}
	}
};

SfxInterface.prototype.playFileAt = function(index) {
	this.playFile(this.fileNames[index]);
};

SfxInterface.prototype.playFile = function(filename) {
	var aoArray = this.audioObjects[filename];
	for(var i = 0; i < aoArray.length; i++)
	{
		if(aoArray[i].currentTime == 0 || aoArray[i].ended)
		{
			aoArray[i].play();
			break;
		}
	}
};

SfxInterface.prototype.createAudioObject = function(fileName) {
	var audioObject = new Audio();
	audioObject.src = fileName;
	audioObject.loop = false;
	
	audioObject.controls = false;
	audioObject.autobuffer = true;
	audioObject.preload = 'auto';
	
	//audioObject.src = fileName + '.' + (audioObject.canPlayType('audio/mpeg;') ? 'mp3' : 'ogg');
	//audioObject.src = fileName + '.' + (audioObject.canPlayType('audio/ogg; codecs="vorbis"') ? 'ogg' : 'mp3');
	
	//var me = this;
	audioObject.addEventListener( 'ended', function(ev){
			//audioObject.load();
			//me.mediaEnded();
		}, false );
	
	// Attempt to preload (fails on Mobile Safari)
	audioObject.load();
	
	return audioObject;
};
