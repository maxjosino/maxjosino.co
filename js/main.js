/* ===================================================================
 * Main JS
 *
 * ------------------------------------------------------------------- */

(function($) {

	"use strict";

	var cfg = {
		defAnimation   : "fadeInUp",    // default css animation
		scrollDuration : 800,           // smoothscroll duration
		statsDuration  : 4000           // stats animation duration
	},
	$WIN = $(window);


  /* Intro Animation
	* ------------------------------------------------------- */
	var ssIntroAnimation = function() {

		$WIN.on('load', function() {

	     	if (!$("html").hasClass('no-cssanimations')) {
	     		setTimeout(function(){
	    			$('.animate-intro').each(function(ctr) {
						var el = $(this),
	                   animationEfx = el.data('animate') || null;

	               if (!animationEfx) {
	                 	animationEfx = cfg.defAnimation;
	               }

	              	setTimeout( function () {
							el.addClass(animationEfx + ' animated');
						}, ctr * 300);
					});
				}, 100);
	     	}
		});

	};

	var checkScreenWidth = function(){
		var smallScreen = window.matchMedia("(max-width: 768px)");
		if (smallScreen.matches){
			document.getElementById("footerNotes").className = "col-five";
		}
		else
		document.getElementById("footerNotes").className = "col-four";
	};




  /* Initialize
	* ------------------------------------------------------ */
	(function ssInit() {

		ssIntroAnimation();
		checkScreenWidth();

		$(window).resize(checkScreenWidth);


	})();


})(jQuery);
