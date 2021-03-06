//This file includes Listener, BoxCollection and PreviewBox three classes.

// Listener is the trigger to everything. 
//and the jump out is set in listenKeys(), 
//because this is the smallest events so that saves resources

function Listener(){
	this.shortupKeyCode = 119;
}
	Listener.prototype.start = function(shortupKeyCode){
		if (shortupKeyCode){
			this.shortupKeyCode = shortupKeyCode;
		}
		this.listenCursor();
		this.listenKeys();
		this.listenLinks();
	}
	Listener.prototype.listenCursor = function(){
		$(window).mousemove(function(e){
			mouseXFuckGlobalVariable = e.clientX;
			mouseYFuckGlobalVariable = e.clientY;
		});
	}
	Listener.prototype.listenKeys = function(){
		var shortupKeyCode = this.shortupKeyCode;
		$(window).on("keypress", function(e){
			var key = e.which;
			var isInputing = ($("input:focus").length > 0) || ($("textarea:focus").length > 0);
			if ((!isInputing) && key == shortupKeyCode && hoverLinkFuckGlobalVariable != null) {
				if (boxColFuckGlobalVariable.member.length == 0 || boxColFuckGlobalVariable.topBox().src != $(hoverLinkFuckGlobalVariable).attr('href')){
					var newBox = new PreviewBox($(hoverLinkFuckGlobalVariable).attr('href'));
					boxColFuckGlobalVariable.add(newBox);
					newBox.render();
				}
				else {
					boxColFuckGlobalVariable.pop();
				}
			}
			if ((!isInputing) && key == shortupKeyCode && hoverLinkFuckGlobalVariable == null && boxColFuckGlobalVariable.member.length != 0) {
				boxColFuckGlobalVariable.pop();
			}
		});
	}
	Listener.prototype.listenLinks = function(){
		$("a").hover(function(){
			hoverLinkFuckGlobalVariable = this; 
		}, function(){
			hoverLinkFuckGlobalVariable = null;
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
	BoxCollection.prototype.pop = function(box){
		if (!box){
			var topBox = this.topBox();
			this.member.pop(topBox);
			topBox.destroy();
		}
		else {
			var index = this.member.indexOf(box);
			this.member.splice(index, 1);
			box.destroy();
		}
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
		var thisForClose = this;
		$(window).on('beforeunload', function(event){
			return "Are you going to leave this page?";
		});
		var clearBeforeunloadTimeout = window.setTimeout(function(){
			$(window).off('beforeunload');
		}, 2000);//cancel listening is case the box is not able to load.
		// get browser size
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();


		var eleContainer = document.createElement("div");
		this.eleContainer = eleContainer;
		$(eleContainer).addClass("box-container").width(boxWidthFuckGlobalVariable).height( boxHeightFuckGlobalVariable);

		// below is for menu
		var menuBtn = new Button('options', 'box-menu box-btn', 'menu.svg');
		var eleMenu = menuBtn.ele;
		$(eleMenu).click(function(){
			winWidth    = 650;  
	        winHeight   = 450;
	        winLeft     = ($(window).width()  - winWidth)  / 2,
	        winTop      = ($(window).height() - winHeight) / 2, 
	        winOptions   = 'width='  + winWidth  + ',height=' + winHeight + ',top='    + winTop    + ',left='   + winLeft;
	        var optionPageLink = 'chrome-extension://' + extensionIDFuckGlobalVariable + '/options.html';
	        window.open(optionPageLink,'OptionPage',winOptions);
	        return false;//Please add content here
		});

		//below is for move
		var moveBtn = new Button('drag to move', 'box-move box-btn', 'move.svg');
		var eleMove = moveBtn.ele;
		$(eleMove).mousedown(function(){
			var mask = document.createElement("div");
			$(mask).attr('id','moveMask');
			$("body").append(mask);
			var mouseXOrigin, mouseYOrigin, xOrigin, yOrigin;
			mouseXOrigin = mouseXFuckGlobalVariable;
			mouseYOrigin = mouseYFuckGlobalVariable;
			xOrigin = parseFloat($(eleContainer).css("left"));
			yOrigin = parseFloat($(eleContainer).css('top'));
			$(mask).on("mousemove", function(){
				var left = xOrigin + mouseXFuckGlobalVariable - mouseXOrigin;
				var top = yOrigin + mouseYFuckGlobalVariable - mouseYOrigin;

				$(eleContainer).css("left", left);
				$(eleContainer).css("top", top);
			})
		});
		$(window).mouseup(function(){
			$('#moveMask').off("mousemove");
			$('#moveMask').remove();
		});




		//below to share(finished)
		var shareBtn = new Button('share this page to Facebook', 'box-share box-btn', 'share.svg');
		var eleShare = shareBtn.ele;
		$(eleShare).click(function(){
			var pageTitle = document.title; //HTML page title
			var pageUrl = thisForClose.src; //Location of the page
			var openLink = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
			//Parameters for the Popup window
	        winWidth    = 650;  
	        winHeight   = 450;
	        winLeft     = ($(window).width()  - winWidth)  / 2,
	        winTop      = ($(window).height() - winHeight) / 2, 
	        winOptions   = 'width='  + winWidth  + ',height=' + winHeight + ',top='    + winTop    + ',left='   + winLeft;
	        
	        //open Popup window and redirect user to share website.
	        window.open(openLink,'Share This Link',winOptions);
	        return false;
		});

		// on click close button, close the box(finished)
		var closeBtn = new Button('close', 'box-close box-btn', 'close.svg');
		var eleClose = closeBtn.ele;
		$(eleClose).click(function(){
			boxColFuckGlobalVariable.pop(thisForClose);
		});

		var addrBtn = new Button('address', 'box-addr box-btn', 'address.svg');
		var eleAddr = addrBtn.ele;
		$(eleAddr).hover(function(){
			$(eleAddrInput).addClass('hover');
		}, function(){
			$(eleAddrInput).removeClass('hover');
		});

		var eleAddrInput = document.createElement('input');
		$(eleAddrInput).addClass('box-address-input').attr('placeholder', 'http:// or search directly on Google');
		$(eleAddrInput).hover(function(){
			$(eleAddr).addClass('hover');
		}, function(){
			$(eleAddr).removeClass('hover');
		});
		$(eleAddrInput).on('keydown', function(e){
			if (e.which == 13){
				if ($(this).val().substring(0, 4) != 'http'){
					var pattern = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
					debugger;
					if(!pattern.test($(this).val())) {
						$(ele).attr('src', 'https://www.google.com/search?q=' + $(this).val());
					} 
					else{
						$(ele).attr('src', 'http://' + $(this).val());
					}
				}
				else{
					$(ele).attr('src', $(this).val());
				}
				$(this).blur();
			}
		});



		var ele = document.createElement("iframe");//create preview box element, for future render
		$(ele).attr("src", this.src);//attr('sandbox', 'allow-scripts allow-forms allow-same-origin').
		var loadingImageLink = 'chrome-extension://'+ extensionIDFuckGlobalVariable +'/loading.gif';
		$(ele).css('background-image', 'url(' + loadingImageLink + ')');
		$(ele).addClass("preview-box");//set identity
		$(ele).addClass("preview-box").width(boxWidthFuckGlobalVariable).height(boxHeightFuckGlobalVariable);
		$(ele).attr("data-layer", this.layer);//set identity




		// 华丽的分割线------------------------------------------

		// judge the mouse position and set the position of preview box dynamically
		if (mouseXFuckGlobalVariable < windowWidth / 2){
			$(eleContainer).css("left", windowWidth - boxWidthFuckGlobalVariable - 10* this.layer);
		}
		else{
			$(eleContainer).css("left", 10* this.layer + 30);
		}
		if (mouseYFuckGlobalVariable < windowHeight / 2){
			$(eleContainer).css("top", windowHeight - 10* this.layer - boxHeightFuckGlobalVariable);
		}
		else{
			$(eleContainer).css("top", 10* this.layer);
		}
		$(ele).load(function(){
			$(window).off('beforeunload');//cancel the listening
			window.clearTimeout(clearBeforeunloadTimeout);
			$(this).css("background", "white");
		});


		// 华丽的分割线------------------------------------------


		this.ele = ele;
		$(eleContainer).append(eleAddr).append(eleAddrInput).append(eleMenu).append(eleClose).append(eleShare).append(eleMove).append(ele);// add box to box container
		$("body").append(eleContainer);//render the preview box container
		$(eleContainer).fadeIn(200);
	}
	PreviewBox.prototype.destroy = function(){
		$(this.eleContainer).fadeOut(200, function(){
			$(this).remove();
		});
	}


function Button(helpText, className, icon){
	this.helpText = helpText;//text display when hovering on it;
	this.ele = document.createElement('div');//html element of it;
	var imageLink = 'chrome-extension://'+ extensionIDFuckGlobalVariable + '/' + icon;
	$(this.ele).addClass(className).css("background-image", 'url(' + imageLink + ')');
}

function MessageBox(title, body, footer){
	this.title = title;
	this.body = body;
	this.footer = footer;
	this.ele;
}
	MessageBox.prototype.render = function(){
		var htmlStr = '<h3>' + this.title + '</h3><p>' + this.body + '</p><small>' + this.footer + '</small>';
		var mb = document.createElement('div');
		$(mb).addClass('pi-message-box');
		$(mb).html(htmlStr);
		this.ele = mb;
		$('body').append(mb);
		$(mb).slideDown(1000);
	}
	MessageBox.prototype.destroy = function(){
		$(this.ele).slideUp(1000);
	}

