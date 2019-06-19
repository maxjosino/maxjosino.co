/* ===================================================================
 * Main JS
 *
<<<<<<< HEAD
 * ------------------------------------------------------------------- */
=======
 * ------------------------------------------------------------------- */ 
>>>>>>> parent of f068ea7... cleaning the room

(function($) {

	"use strict";

<<<<<<< HEAD
	var cfg = {
		defAnimation   : "fadeInUp",    // default css animation
		scrollDuration : 800,           // smoothscroll duration
		statsDuration  : 4000           // stats animation duration
	},
	$WIN = $(window);


	/* Preloader
	 * -------------------------------------------------- */
	var ssPreloader = function() {

		$WIN.on('load', function() {
=======
	var cfg = {		
		defAnimation   : "fadeInUp",    // default css animation		
		scrollDuration : 800,           // smoothscroll duration
		statsDuration  : 4000           // stats animation duration
	},	
	$WIN = $(window);

	
	/* Preloader 
	 * -------------------------------------------------- */
	var ssPreloader = function() {

		$WIN.on('load', function() {	
>>>>>>> parent of f068ea7... cleaning the room

			// force page scroll position to top at page refresh
			$('html, body').animate({ scrollTop: 0 }, 'normal');

<<<<<<< HEAD
	      // will first fade out the loading animation
=======
	      // will first fade out the loading animation 
>>>>>>> parent of f068ea7... cleaning the room
	    	$("#loader").fadeOut("slow", function(){

	        // will fade out the whole DIV that covers the website.
	        $("#preloader").delay(300).fadeOut("slow");

<<<<<<< HEAD
	      });
	  	});
	}; 	
=======
	      }); 
	  	});
	}; 


 

  
	
>>>>>>> parent of f068ea7... cleaning the room

  /* Intro Animation
	* ------------------------------------------------------- */
	var ssIntroAnimation = function() {

		$WIN.on('load', function() {
<<<<<<< HEAD

=======
		
>>>>>>> parent of f068ea7... cleaning the room
	     	if (!$("html").hasClass('no-cssanimations')) {
	     		setTimeout(function(){
	    			$('.animate-intro').each(function(ctr) {
						var el = $(this),
<<<<<<< HEAD
	                   animationEfx = el.data('animate') || null;

	               if (!animationEfx) {
	                 	animationEfx = cfg.defAnimation;
=======
	                   animationEfx = el.data('animate') || null;		                                      

	               if (!animationEfx) {
	                 	animationEfx = cfg.defAnimation;	                 	
>>>>>>> parent of f068ea7... cleaning the room
	               }

	              	setTimeout( function () {
							el.addClass(animationEfx + ' animated');
						}, ctr * 300);
<<<<<<< HEAD
					});
				}, 100);
	     	}
		});
=======
					});						
				}, 100);
	     	} 
		}); 
>>>>>>> parent of f068ea7... cleaning the room

	};


<<<<<<< HEAD

=======
  
>>>>>>> parent of f068ea7... cleaning the room


  /* Initialize
	* ------------------------------------------------------ */
	(function ssInit() {

		ssPreloader();
<<<<<<< HEAD
		ssIntroAnimation();

	})();


})(jQuery);
=======
		ssIntroAnimation();		

	})();
 

})(jQuery);
>>>>>>> parent of f068ea7... cleaning the room
