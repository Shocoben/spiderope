define(function(){

	var ImagesManager = function(path)
	{
		this.imageList = [];
		this.imagesPathSD = path.SD;
		this.imagesPathHD = path.HD || path.SD;
		this.currentImagesPath = path.SD;
		this.numberImages = 0;
		this.imageLoaded = 0;
	};

	ImagesManager.prototype.changePath = function(newPath)
	{
		this.currentImagesPath = newPath;
	}

	ImagesManager.prototype.log = function(str)
	{
		console.log("[NLImages] " + str);
	}

	ImagesManager.prototype.getImage = function(imageName)
	{
			// console.log(imageName);
		if (this.imageList[imageName] !== undefined)
		{
			return this.imageList[imageName][1];
		}
		else
		{
			return false;
		}
	}

	ImagesManager.prototype.detectPathFromSize= function(size)
	{
		if (size.width > size.height)
		{
			this.currentImagesPath = (size.width<860)? this.imagesPathSD : this.imagesPathHD ;
		}
		else {
			this.currentImagesPath = (size.height<860)? this.imagesPathSD : this.imagesPathHD ;
		}
	}

	ImagesManager.prototype.getImageSize = function(imageName)
	{	
	    if (imageName != undefined) {
	        return {
	            x: this.imageList[imageName][1].width
                , y: this.imageList[imageName][1].height
	        };
	    }
	}


	ImagesManager.prototype.pushImages = function(myImageMatrix){
		for (var i = 0; i < myImageMatrix.length; i++)
		{
			var p = myImageMatrix[i];
			if (!this.getImage(p[0]))
			{
				this.imageList[p[0]] = [p[0], new Image()]; // Pushes the image to the list					
				this.imageList[p[0]][1].src = this.currentImagesPath + p[1];
				var currentLoader = this;
				this.imageList[p[0]][1].onload = function(){this.src = this.src; imageLoad(currentLoader);};// Gives a reference to the image when the function onload will be called
				this.numberImages++;
			}
		}
		this.percentCoeff = 100 / this.numberImages;
	}

	ImagesManager.prototype.getLoadPercentage = function(){
		return this.imageLoaded * this.percentCoeff;
	}

	var imageLoad = function(currentLoader){

		// Sets the image to loaded state;
		currentLoader.imageLoaded++;
	}
	
	ImagesManager.prototype.isAllMoreThanZero = function(){
		for (var i in this.imageList)
		{
			var image = this.imageList[i][1];
			if (image.width <= 0 || !image.width)
			{
				return false;
			}
		}
		return true;
	}

	ImagesManager.prototype.isLoaded = function()
	{
		if (this.imageLoaded < this.numberImages || !this.isAllMoreThanZero()){
			return false;
		}
		return true;
	}


	return ImagesManager;
});
