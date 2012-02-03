// Inspiration most certainly goes to Paul Hayes
// http://www.paulrhayes.com/2009-07/animated-css3-cube-interface-using-3d-transforms/

// My modifications allow for multiple rectangles
// Responsive design
// Automatically spin use CSS3 keyframe animation
// Pause on touch/drag (need to tinker a bit for smoother drag - multiple view ports overlapping cause some binding issues)

$(function(){

	var cube_index = 0;
	
	$("#title").fitText(1.2, { minFontSize: '30px', maxFontSize: '100px' });
	
	$(window).resize(function(e) {
	
		var cr_width = $('.cube > div:first-child').width();
		cr_width = cr_width - 15; //magic number
		
		$('.cube > div:nth-child(5)').css('-webkit-transform','rotateY(-90deg) translateZ(-' + cr_width + 'px)'); 
		
	});
	
	var mouse = { 
	    	start : {}
	    },
	    touch = document.ontouchmove !== undefined,
	    viewport = {
	    	x: -10, 
			y: 20, 
			el: $('.cube')[cube_index],
			move: function(coords) {
				if(coords) {
					if(typeof coords.x === "number") this.x = coords.x;
					if(typeof coords.y === "number") this.y = coords.y;
				}
	
				this.el = $('.cube')[cube_index];
				
				$('.viewport[data=' + cube_index + ']').find('.cube').first().css('-webkit-animation-name', 'noSpin');
				
				this.el.style.webkitTransform = "rotateX("+this.x+"deg)";
				
			},
			reset: function() {
				this.move({x: 0, y: 0});
			}
		};
		
	viewport.duration = function() {
		var d = touch ? 50 : 500;
		viewport.el.style.webkitTransitionDuration = d + "ms";
		return d;
	}();
	
	$('.viewport').bind('mousedown touchstart', function(evt) {
	
		delete mouse.last;
		
		if($(evt.target).is('a, iframe')) {
			return true;
		}
		

		cube_index = parseInt($(evt.target).attr('data'));

		evt.originalEvent.touches ? evt = evt.originalEvent.touches[0] : null;
		mouse.start.x = evt.pageX;
		mouse.start.y = evt.pageY;
		
		$(this).bind('mousemove touchmove', function(event) {
			
			// Only perform rotation if one touch or mouse (e.g. still scale with pinch and zoom)
			
			cube_index = parseInt($(event.target).attr('data'));
			
			if(!touch || !(event.originalEvent && event.originalEvent.touches.length > 1)) {
			
				event.preventDefault();
				
				// Get touch co-ords
				event.originalEvent.touches ? event = event.originalEvent.touches[0] : null;
				$(this).trigger('move-viewport', {x: event.pageX, y: event.pageY});		
				
			}			
		});	
		
		$('.viewport').bind('mouseup touchend', function () {
			$('.viewport').unbind('mousemove touchmove');
		});
		
	});
	
	$('.viewport').bind('move-viewport', function(evt, movedMouse) {

		cube_index = parseInt($(evt.target).attr('data'));
	
		// Reduce movement on touch screens
		var movementScaleFactor = touch ? 4 : 1;
		
		if (!mouse.last) {
	  		mouse.last = mouse.start;
		} else {
		  	if (forward(mouse.start.x, mouse.last.x) != forward(mouse.last.x, movedMouse.x)) {
		  		mouse.start.x = mouse.last.x;
		  	}
		  	if (forward(mouse.start.y, mouse.last.y) != forward(mouse.last.y, movedMouse.y)) {
		  		mouse.start.y = mouse.last.y;
		 	}
		}
		
		viewport.move({
			x: viewport.x + parseInt((mouse.start.y - movedMouse.y)/movementScaleFactor),
			y: viewport.y - parseInt((mouse.start.x - movedMouse.x)/movementScaleFactor)
		});
		
		mouse.last.x = movedMouse.x;
		mouse.last.y = movedMouse.y;		
			
		function forward(v1, v2) {
			return v1 >= v2 ? true : false;
		}
	});
	
	$('#playSpins').click(function() {
	
		$('.cube').css('-webkit-animation-name', 'spin');
		$('.cube').css('-webkit-animation-play-state', 'running');
	
	});
	
	$('#pauseSpins').click(function() {
	
		$('.cube').css('-webkit-animation-name', 'spin');
		$('.cube').css('-webkit-animation-play-state', 'paused');
	
	});
	
});

