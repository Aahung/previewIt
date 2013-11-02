//This file includes Listener, BoxCollection and PreviewBox three classes.

// Listener is the trigger to everything. 
//and the jump out is set in listenKeys(), 
//because this is the smallest events so that saves resources

function Listener(boxCol){
	this.hoverLink;
	this.mouseX;
	this.mouseY;
	this.boxCol = boxCol;
}
	Listener.prototype.start = function(){
		this.listenCursor();
		this.listenKeys();
		this.listenLinks();
	}
	Listener.prototype.listenCursor = function(){
		var mouseX, mouseY;
		$(window).mousemove(function(e){
			mouseX = e.clientX;
			mouseY = e.clientY;
		});
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}
	Listener.prototype.listenKeys = function(){
		var boxCol = this.boxCol; //change to local variable
		var hoverLink = this.hoverLink;
		$(window).on("keypress", function(e){
			var key = e.which;
			if (key == 119 && hoverLink != null) {
				if (boxCol.member.length == 0 || boxCol.topBox().src != $(hoverLink).attr('href')){
					var newBox = new PreviewBox($(hoverLink).attr('href'));
					boxCol.add(newBox);
					newBox.render();
				}
				else {
					boxCol.pop();
				}
			}
			if (key == 119 && hoverLink == null && boxCol.member.length != 0) {
				boxCol.pop();
			}
		});
	}
	Listener.prototype.listenLinks = function(){
		$("a").hover(function(){
			hoverLink = this; 
		}, function(){
			hoverLink = null;
		});
	}



function BoxCollection(){
	this.topLayer = 0;
	this.member = [];
}
	BoxCollection.prototype.add = function(box){
		this.member.push(box);
		box.layer = this.topLayer + 1;
		this.detect();
	}
	BoxCollection.prototype.remove = function(box){
		this.member.pop(box);
		this.detect();
	}
	BoxCollection.prototype.detect = function(){
		var topLayer = 0;
		for (var i = 0; i < this.member.length; i ++){
			if (this.member[i].layer > topLayer)
				topLayer = this.member[i].layer;
		}
		this.topLayer = topLayer;
	}
	BoxCollection.prototype.pop = function(){
		var topBox = this.topBox();
		this.member.pop(topBox);
		topBox.destroy();
		this.detect();
	}
	BoxCollection.prototype.topBox = function(){
		var boxes = this.member;
		var topLayer = this.topLayer;
		var topBox = $.grep(boxes, function(n, i){
			return n.layer == topLayer;
		});
		return topBox[0];
	}



function PreviewBox(src){
	this.src = src;
	this.layer;
	this.eleContainer;
	this.eleMenu;
	this.ele;
}
	PreviewBox.prototype.render = function(){
		// get browser size
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var eleContainer = document.createElement("div");
		this.eleContainer = eleContainer;
		$(eleContainer).addClass("box-container");
		var eleMenu = document.createElement("div");
		$(eleMenu).addClass("box-menu");
		var ele = document.createElement("iframe");//create preview box element, for future render
		this.ele = ele;
		$(ele).attr("src", this.src);
		$(ele).addClass("preview-box");//set identity
		var backgroundImageLink = 'chrome-extension://'+ previewItExtensionID +'/loading.gif';
		$(ele).css("background", "url('" + backgroundImageLink + "')");
		debugger;
		$(ele).attr("data-layer", this.layer);//set identity
		// judge the mouse position and set the position of preview box dynamically
		if (mouseX < windowWidth / 2){
			$(eleContainer).css("right", 10* this.layer);
		}
		else{
			$(eleContainer).css("left", 10* this.layer);
		}
		if (mouseY < windowHeight / 2){
			$(eleContainer).css("bottom", 10* this.layer);
		}
		else{
			$(eleContainer).css("top", 10* this.layer);
		}
		$(ele).load(function(){
			$(this).css("background", "white");
		});
		$(eleContainer).append(ele);// add box to box container
		$(eleContainer).append(eleMenu);//add menu
		$("body").append(eleContainer);//render the preview box container
	}
	PreviewBox.prototype.destroy = function(){
		this.ele.remove();
		this.eleContainer.remove();
	}