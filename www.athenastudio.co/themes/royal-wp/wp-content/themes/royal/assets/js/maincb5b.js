(function($) {

	"use strict";
	
	/* Default Variables */
	var Royal_Options = {
		parallax:true,
		loader:true,
		animations:true,
		scrollSpeed:700,
		navigation:'sticky',
		security:'',
		intro:{
			animate:true,
			animateDelayFirst:500,
			animateDelay:300
		}
	};
	
	if (typeof Royal!=='undefined') {
		jQuery.extend(Royal_Options, Royal);
	}

	$.Royal_Theme = {

		//Initialize
		init:function() {
			this.intro();
			this.navigation();
			this.portfolio();
			this.shortcodes();
			this.animations();
			this.loader();
			this.map();
			this.tweaks();
			this.popupVideo();
			this.parallax();			
			this.imageSlider();
			this.contentSlider();
			this.blog();
            this.shop();
			this.twitter();
		},
		
		//Check if tocuh device
		isTouch:function() {
			return ('ontouchstart' in document.documentElement);
		},

		//Page Loader
		loader:function() {
			if (Royal_Options.loader) {
				var loaderHide = function() {
					jQuery(window).trigger('royal.loaded');
					jQuery('.page-loader .content').delay(500).fadeOut();
					jQuery('.page-loader').delay(1000).fadeOut('slow', function() {
						jQuery(window).trigger('royal.complete');
					});
				};

				//Loadsafe
				jQuery(window).on('load', function() {
					window._loaded = true;
				});
				
				window.loadsafe = function(callback) {
					if (window._loaded) {
						callback.call();
					} else {
						jQuery(window).on('load', function() {
							callback.call();
						});
					}
				};
	
				//Hide loader
				if (jQuery('#intro').attr('data-type')==='video' && !this.isTouch()) {
					jQuery(window).on('royal.intro-video', function() {
						window.loadsafe(function() {
							loaderHide();
						});
					});
				} else {
					jQuery(window).on('load', function() {
						loaderHide();
					});
				}
			} else {
                jQuery('.page-loader').remove();
				jQuery(window).trigger('royal.loaded');	
                
                setTimeout(function() {
                    jQuery(window).trigger('royal.complete');
                }, 1);
			}
		},
	
		//Navigation
		navigation:function() {
			//Dropdown menu
			var dropdownHide = function() {
				if (jQuery('.navbar .dropdown.open').length===0) {return;}
				
				jQuery('.navbar .dropdown.open').each(function() {
					var $menu = jQuery(this);
					
					if (!$menu.hasClass("active")) {
						$menu.removeClass('open');
					}
					
					$menu.find('.dropdown-menu').animate({opacity:0}, {duration:150, queue:false});
				});
			};
			
			var dropdownShow = function($that) {
				$that.find('.dropdown-menu').css({opacity:0});
				$that.addClass('open').find('.dropdown-menu').animate({opacity:1}, {duration:150, queue:false});
			};
	
			//Collapse menu
			var collapseMenu = function() {
				if (jQuery('.navbar-collapse.collapse.in').length>0) {
					jQuery('.navbar-collapse.collapse.in').each(function() {
						jQuery(this).parent().find('.navbar-toggle').click();
					});
				}
			};
	
			//Resize window
			jQuery(window).resize(function() {
				collapseMenu();
				dropdownHide();
			}).scroll(function() {
				collapseMenu();
			});
	
			//Navbar toggle
			jQuery('.navbar .navbar-toggle').on('click', function(e) {
				e.preventDefault();
				dropdownHide();
			});
	
			//Create floating navigation bar
			if (jQuery('#intro').length>0 && Royal_Options.navigation==='sticky') {
				jQuery(window).on("scroll", function() {
					var pos = jQuery(window).scrollTop();
					
					if (pos>=100) {
						jQuery(".navbar").addClass("floating slide-down");
					} else {
						jQuery(".navbar").removeClass("floating slide-down");
					}
				});
			}
			
			if (jQuery('#intro').length===0 && Royal_Options.navigation!=='sticky') {
				$('.navbar').addClass('fixed-top');
			}

			//Dropdown menu
			var dropdownTimer, dropdownExists = false;

			jQuery('.dropdown').hover(function() {
				if (!jQuery(this).parent().parent().hasClass('in') && !jQuery(this).parent().parent().hasClass('collapsing')) {
					clearTimeout(dropdownTimer);
					if (jQuery(this).hasClass('open')) {return;}
					if (dropdownExists) {dropdownHide();}
					dropdownExists = true;
					dropdownShow(jQuery(this));
				}
			}, function() {
				if (!jQuery(this).parent().parent().hasClass('in')) {
					dropdownTimer = setTimeout(function() {
						dropdownHide();
						dropdownExists = false;
					}, 500);
				}
			});

			jQuery(document).on('click', '.navbar-collapse.in .dropdown > a', function(e) {
				e.preventDefault();
				var $parent = jQuery(this).parent();

				if (!$parent.hasClass('open')) {
					dropdownShow($parent);
				} else {
					dropdownHide();
				}
			});

			//Scroll to anchor links
			jQuery('a[href^=\\#]').click(function(e) {
				if (jQuery(this).attr('href')!=='#' && !jQuery(e.target).parent().parent().is('.navbar-nav') && !jQuery(this).attr('data-toggle')) {
					jQuery(document).scrollTo(jQuery(this).attr('href'), Royal_Options.scrollSpeed, {offset:{top:-85, left:0}});
					e.preventDefault();
				}
			});

			//Navigation
			jQuery(document).ready(function() {
				jQuery('.navbar-nav').onePageNav({
					currentClass:'current-menu-item',
					changeHash:false,
					scrollSpeed:Royal_Options.scrollSpeed,
					scrollOffset:85,
					scrollThreshold:0.5,
					filter:'li a[href^=\\#]',
					begin:function() {
						collapseMenu();
					}
				});
			});

			if (document.location.hash && Royal_Options.loader) {
				if (!/\?/.test(document.location.hash)) {
					jQuery(window).on('load', function() {
						jQuery(window).scrollTo(document.location.hash, 0, {offset:{top:-85, left:0}});
					});
				}
			}

			//To top
			jQuery('.footer .to-top').click(function() {
				jQuery(window).scrollTo(jQuery('body'), 1500, {offset:{top:0, left:0}});
			});
		},

		//Intro
		intro:function() {
			if (jQuery('#intro').length===0) {
				return;
			}

			var $intro = jQuery('#intro');
			var useImages = false, useVideo = false;

			//Vertical Align Content
			var verticalAlignContent = function() {
				var contentH = $intro.find('.content').outerHeight(), 
					windowH = jQuery(window).height(), 
					value = Math.floor((windowH-contentH)/2)-60;
				
				if (jQuery("#wpadminbar").length>0) {
					var barH = jQuery("#wpadminbar").height();
					value -= barH;
				}
				
				$intro.find('.content').css({marginTop:value});
			};

			//Magic mouse
			var magicMouse = function() {
				var mouseOpacity = 1-jQuery(document).scrollTop()/400;
				if (mouseOpacity<0) {mouseOpacity = 0;}
				$intro.find('.mouse').css({opacity:mouseOpacity});
			};

			if (!Royal_Options.intro.animate) {
				$that.find('.animate').removeClass('animate');
			}

			jQuery(window).on('resize', function() {
				verticalAlignContent();
			});
			
			jQuery(window).on('load', function() {
				verticalAlignContent();
				magicMouse();
			});

			jQuery(window).on('scroll', function() {
				magicMouse();
			});
			
			var $elements;

			//Static image or pattern
			if ($intro.data('type')==='single-image') {
				useImages = true;
				$elements = $intro.find('.animate');
				
				if ($elements.length>0) {
					verticalAlignContent();

					jQuery(window).on('royal.complete', function() {
						jQuery($elements).each(function(i) {
							var $this = jQuery(this);
							setTimeout(function() {
								$this.addClass('complete');
							}, 0+(i*Royal_Options.intro.animateDelay));
						});
					});
				} else {
					verticalAlignContent();
				}

				jQuery('<div />').addClass('slider fullscreen').prependTo('body');
                
				if (jQuery('div.image').length>0) {
                    jQuery('div.image').css({
                        opacity:0,
                        backgroundImage:"url('"+jQuery('div.image').data('source')+"')",
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'cover'
                    }).appendTo('.slider');
                }

				jQuery('.slider').waitForImages(function() {
					jQuery(this).find('.image').css({opacity:1});
				});

				if ($intro.data('parallax')==='true' && !this.isTouch()) {
					jQuery(document).ready(function() {
						jQuery('.slider').find('.image').css({backgroundRepeat:'repeat'}).parallax('50%', 0.25);
                    });
				}
			}		
			//Slideshow
			else if ($intro.data('type')==='slideshow') {
				useImages = true;

				var contentListShow = function($that, $contentList, index) {
					var $current;
					
					if (!$contentList) {
						$contentList = jQuery('#intro');
						$current = $contentList;
					} else {
						$current = $contentList.find('> div[data-index='+index+']');
					}

					var $elements = $current.find('.animate');

					if ($elements.length>0) {
						$elements.removeClass('complete');
						$current.show();
						verticalAlignContent();

						jQuery($elements).each(function(i) {
							var $this = jQuery(this);
							setTimeout(function() {
								$this.addClass('complete');
							}, Royal_Options.intro.animateDelayFirst+(i*Royal_Options.intro.animateDelay));
						});
					} else {
						$current.show();
						verticalAlignContent();
					}
				};

				var contentListHide = function($that, $contentList, onComplete) {
					if ($contentList) {
						var $current = $contentList.find('> div:visible');
						if (typeof $current!=='undefined') {
							$contentList.find('> div').hide();
						}
					}
					if (onComplete && typeof onComplete==='function') {onComplete();}
				};

				var $imagesList = $intro.find($intro.data('images')),
					$contentList = $intro.data('content') ? $intro.find($intro.data('content')) : false,
					changeContent = $contentList!==false ? true : false,
					$toLeft = $intro.data('to-left') ? $intro.find($intro.data('to-left')) : false,
					$toRight = $intro.data('to-right') ? $intro.find($intro.data('to-right')) : false,
					delay = parseInt($imagesList.data('delay'), 10)>0 ? parseInt($imagesList.data('delay'), 10)*1000 : 10000;

				$intro.data('delay', parseInt($imagesList.data('delay'), 10));
                
				$imagesList.hide().prependTo($intro);
                $intro.find('.single-slide').appendTo($intro.find('.content'));
                
				if ($toLeft) {
                    $toLeft.appendTo($intro.find('.content'));
                }
                
                if ($toRight) {
                    $toRight.appendTo($intro.find('.content'));
                }
                
                $intro.find('.vc_row').remove();

				var images = [];
				$imagesList.find('> img').each(function(index) {
					images.push({src:jQuery(this).attr('src')});
					jQuery(this).attr('data-index', index);
				});

				if (changeContent) {
                    $contentList.find('> div').hide();
					$contentList.find('> div').each(function(index) {
						jQuery(this).attr('data-index', index);
					});
				}

				var slideshowTimeout = false, 
                    slideshowCurrent = 0, 
                    slideshowIsFirst = true;
                
				var tempInt = Royal_Options.intro.animateDelayFirst;

				var slideshowChange = function($that, index) {
					if (!images.length) {
						return;
					}
						
					if (index>=images.length) {
						index = 0;
					} else if (index<0) {
						index = images.length - 1;
					}
					
					slideshowCurrent = index;

					var isFirst = $that.find('.image').length===0 ? true : false;

					if (isFirst) {
						jQuery('<div />').css({
							backgroundImage:"url('"+images[index].src+"')",
							backgroundRepeat:'no-repeat'
						}).addClass('image').appendTo('.slider');
					} else {
						jQuery('<div />').css({
							backgroundImage:"url('"+images[index].src+"')",
							backgroundRepeat:'no-repeat',
							opacity:0
						}).addClass('image').appendTo('.slider');

						setTimeout(function() {
							$that.find('.image:last-child').css({opacity:1});
							setTimeout(function() {
								$that.find('.image:first-child').remove();
							}, 1500);
						}, 100);
					}

					if ($contentList || slideshowIsFirst) {
						contentListHide($that, $contentList, function() {
							if (!slideshowIsFirst) {
								if (Royal_Options.intro.animateDelayFirst===0) {
									Royal_Options.intro.animateDelayFirst = tempInt;
								}
								
								contentListShow($that, $contentList, index);
							} else {
								jQuery(window).on('royal.complete', function() {
									Royal_Options.intro.animateDelayFirst = 0;
									contentListShow($that, $contentList, index);
								});
							}
						});
					}
					
					slideshowIsFirst = false;
	
					clearTimeout(slideshowTimeout);
					
					slideshowTimeout = setTimeout(function() {
						slideshowNext($that);
					}, delay);
				};

				var slideshowCreate = function() {
					jQuery('<div />').addClass('slider fullscreen').prependTo('body');
					
					jQuery(window).on('royal.loaded', function() {
						$imagesList.imagesLoaded(function() {
							slideshowChange(jQuery('.slider'), 0);
						});
					});
				};

				var slideshowNext = function($slider) {
					slideshowChange($slider, slideshowCurrent+1);
				};
				
				var slideshowPrev = function($slider) {
					slideshowChange($slider, slideshowCurrent-1);
				};

				slideshowCreate();

				if ($toLeft!==false && $toRight!==false) {
					$toLeft.click(function(e) {
						slideshowPrev(jQuery('.slider'));
						e.preventDefault();
					});
					
					$toRight.click(function(e) {
						slideshowNext(jQuery('.slider'));
						e.preventDefault();
					});
				}
			}
			//Fullscreen Video
			else if ($intro.data('type')==='video') {
				useVideo = true;

				if (this.isTouch()) {
					jQuery('#video-mode').removeClass('animate').hide();
					useImages = true;
					useVideo = false;
				}

				$elements = $intro.find('.animate');
				
				if ($elements.length>0) {
					verticalAlignContent();
	
					jQuery(window).on('royal.complete', function() {
						jQuery($elements).each(function(i) {
							var $this = jQuery(this);
							
							setTimeout(function() {
								$this.addClass('complete');
							}, 0+(i*Royal_Options.intro.animateDelay));
						});
					});
				} else {
					verticalAlignContent();
				}
				
				jQuery(document).ready(function() {
					var reserveTimer,
						onlyForFirst = true;

					jQuery(window).on('YTAPIReady', function() {
						reserveTimer = setTimeout(function() {
							jQuery(window).trigger('royal.intro-video');
							onlyForFirst = false;
						}, 5000);
					});

                    if (jQuery('.slider.fullscreen').length>0) {
                        var $video = jQuery('.slider.fullscreen');
                        
                        $video.prependTo('body').on('YTPStart', function() {
                                if (onlyForFirst) {
                                    clearTimeout(reserveTimer);
                                    jQuery(window).trigger('royal.intro-video');
                                    onlyForFirst = false;
                                }
                            }).mb_YTPlayer({
                                onError:function() {
                                    clearTimeout(reserveTimer);
                                    jQuery(window).trigger('royal.intro-video');
                                }
                        });

                        if ($video.data('overlay')) {
                            jQuery('.YTPOverlay').css({
                                backgroundColor:'rgba(0, 0, 0, '+$video.data('overlay')+')'
                            });
                        }
                    }
				});

				var videoMode = false, videoModeSelector = '#intro .mouse, #intro .content, .slider.fullscreen .overlay';

				jQuery('#video-mode').click(function() {
					jQuery(videoModeSelector).animate({opacity:0}, {duration:500, queue:false, complete:function() {
						if (!videoMode) {
							jQuery('.slider').YTPUnmute();
							
							jQuery('.YTPOverlay').animate({opacity:0}, {duration:500, queue:false, complete:function() {
								jQuery(this).hide();
							}});

							jQuery('<div />').appendTo('#intro').css({
								position:'absolute',
								textAlign:'center',
								bottom:'30px',
								color:'#fff',
								left:0,
								right:0,
								opacity:0
							}).addClass('click-to-exit');

							jQuery('<h5 />').appendTo('.click-to-exit').text('Click to exit full screen');

							setTimeout(function() {
								jQuery('.click-to-exit').animate({opacity:1}, {duration:500, queue:false, complete:function() {
									setTimeout(function() {
										jQuery('.click-to-exit').animate({opacity:0}, {duration:500, queue:false, complete:function() {
											jQuery(this).remove();
										}});
									}, 1500);
								}});
							}, 500);
						}

						videoMode = true;

						jQuery(this).hide();
					}});
				});

				$intro.click(function(e) {
                    if (videoMode && jQuery(e.target).is('#intro')) {
                        jQuery('.slider').YTPMute();
                        jQuery('.YTPOverlay').show().animate({opacity:1}, {duration:500, queue:false});
                        jQuery(videoModeSelector).show().animate({opacity:1}, {duration:500, queue: false});
                        $intro.find('.click-to-exit').remove();
                        videoMode = false;
                    }
                });
			}
		},

		//Portfolio
		portfolio:function() {
			if (jQuery('.portfolio-item').length===0) {
				return;
			}

			var that = this;

			var calculatePortfolioItems = function() {
				var sizes = {lg:5, md:5, sm:4, xs:2}, 
					$that = jQuery('.portfolio-items'),
					w = jQuery(window).width(), 
					onLine = 0, value = 0;

				if ($that.attr('data-on-line-lg')>0) {sizes.lg = parseInt($that.attr('data-on-line-lg'), 10);}
				if ($that.attr('data-on-line-md')>0) {sizes.md = parseInt($that.attr('data-on-line-md'), 10);}
				if ($that.attr('data-on-line-sm')>0) {sizes.sm = parseInt($that.attr('data-on-line-sm'), 10);}
				if ($that.attr('data-on-line-xs')>0) {sizes.xs = parseInt($that.attr('data-on-line-xs'), 10);}

				//New width
				if (w<=767) {
					onLine = sizes.xs;
				} else if (w>=768 && w<=991) {
					onLine = sizes.sm;
				} else if (w>=992 && w<=1199) {
					onLine = sizes.md;
				} else {
					onLine = sizes.lg;
				}

				value = Math.floor(w/onLine);
				
				//Portfolio image
				var $img = jQuery('.portfolio-item > img');
				
				if ($img.prop('complete')) {
					var $item = $img.parent(),
						width = $img.width(),
						height = $img.height();
					
					height = height*value/width;

					$item.css({width:value+'px', height:height+'px'});
				}
			};

			jQuery(window).resize(function() {
				calculatePortfolioItems();
			});
			
			jQuery(document).ready(function() {
				calculatePortfolioItems();
				jQuery('.portfolio-items').isotope({
					itemSelector:'.portfolio-item', 
					layoutMode:'fitRows'
				});
			});
	
			jQuery('.portfolio-filters a').click(function(e) {
				var $that = jQuery(this);
				jQuery('.portfolio-filters a').removeClass('active');
				$that.addClass('active');

				jQuery('.portfolio-items').isotope({filter:$that.attr('data-filter')});
				e.preventDefault();
			});

			var closeProject = function() {
				jQuery('#portfolio-details').parent().animate({opacity:0}, { duration:600, queue:false});
				jQuery('#portfolio-details').parent().animate({height:0}, { duration:700, queue:false, complete:function() {
					jQuery(this).find('#portfolio-details').hide().html('').removeAttr('data-current');
					jQuery(this).css({height:'auto', opacity:1});
				}});
			};
	
			//IE < 10 Fix
			jQuery('.portfolio-item').click(function(e) {
				if (jQuery(e.target).is('.portfolio-item')) {
					jQuery(this).find('a').click();
				}
			}).find('img').click(function(e) {
				if (jQuery(e.target).is('img')) {
					jQuery(this).parent().find('a').click();
				}
			});

			//Portfolio item
			jQuery('.portfolio-item a').filter('[data-url]').click(function(e) {
				var $that = jQuery(this);
				
				if ($that.parent().find('.loading').length===0) {
					jQuery('<div />').addClass('loading').appendTo($that.parent());
					$that.parent().addClass('active');

					var $loading = jQuery(this).parent().find('.loading'),
						$container = jQuery('#portfolio-details'), 
						$parent = $container.parent(), 
						timer = 1, projectRel;

					if ($container.is(':visible')) {
						closeProject();
						timer = 800;
						$loading.animate({width:'70%'}, {duration:2000, queue:false});
					}

					setTimeout(function() {
						$loading.stop(true, false).animate({width:'70%'}, {duration:6000, queue:false});

						//Add AJAX query to the url
						var url = $that.attr("data-url")+"?ajax=1";
						
						jQuery.get(url).done(function(response) {
							$container.html(response);

							$container.waitForImages(function() {
								$loading.stop(true, false).animate({width:'100%'}, {duration:500, queue:true});

								$loading.animate({opacity:0}, {duration:200, queue:true, complete:function() {
									$that.parent().removeClass('active');
									jQuery(this).remove();

									$parent.css({opacity:0, height:0});
									$container.show();

									that.imageSlider($container, function() {
										jQuery(document).scrollTo($container, 600, {offset:{top:-85, left:0}});
										$parent.animate({opacity:1}, {duration:700, queue:false});
										$parent.animate({height:$container.outerHeight(true)}, {duration:600, queue:false, complete:function() {
											projectRel = $that.parent().is('.portfolio-item') ? $that.parent() : $that.parent().parent();
											jQuery(this).css({height:'auto'});
											$container.attr('data-current', projectRel.attr('rel'));
										}});
									});
								}});
							});
						}).fail(function() {
							$that.parent().removeClass('active');
							$loading.remove();
						});
					}, timer);
				}

				e.preventDefault();
            });

			jQuery(document.body).on('click', '#portfolio-details .icon.close i', function() {
				closeProject();
			});

			//Anchor Links for Projects
			var dh = document.location.hash;

			if (/#view-/i.test(dh)) {
				var $item = jQuery('[rel="'+dh.substr(6)+'"]');
				if ($item.length>0) {
					jQuery(document).scrollTo('#portfolio', 0, {offset:{top:0, left:0}});
					jQuery(window).on('royal.complete', function() {
						$item.trigger('click');
					});
				}
			}

			jQuery('a[href^="#view-"]').click(function() {
				var $item = jQuery('[rel="'+jQuery(this).attr('href').substr(6)+'"]');
				if ($item.length>0) {
					jQuery(document).scrollTo('#portfolio', Royal_Options.scrollSpeed, {offset:{top:-85, left:0}, onAfter:function() {
						$item.trigger('click');
					}});
				}
			});
		},
		
		//Popup video
		popupVideo:function() {
			if (jQuery('.popup-video').length===0) {
				return;
			}
			
			jQuery('.popup-video').magnificPopup({
				type:"iframe",
				preloader:true
			});
		},

		//Parallax Sections
		parallax:function() {
			if (jQuery('.parallax').length===0) {
				return;
			}
			
			var that = this;

			jQuery(window).on('load', function() {
				jQuery('.parallax').each(function() {
					if (jQuery(this).attr('data-image')) {
						jQuery(this).css({backgroundImage:'url('+jQuery(this).attr('data-image')+')'});
						if (Royal_Options.parallax && !that.isTouch() && !/MSIE/.test(navigator.userAgent)) {
							jQuery(this).parallax('50%', 0.5);
						}
					}
				});
			});
		},

		//Google Maps
		map:function() {
			if (jQuery('#google-map').length===0) {
				return;
			}
			
			var that = this;
	
			jQuery(window).on('load', function() {
				that.mapCreate();
			});
		},
		
		//Create map
		mapCreate:function() {
			var $map = jQuery('#google-map');
			
			//Main color			
			var main_color = Royal_Options.mapColor==='' ? $map.data('color') : Royal_Options.mapColor;
			Royal_Options.mapColor = '';
			
			//Map marker
			var map_marker = Royal_Options.mapMarker==='' ? $map.data('marker') : Royal_Options.mapMarker;
			Royal_Options.mapMarker = '';

			//Coordinates
			var coordY = $map.attr('data-latitude'), 
				coordX = $map.attr('data-longitude');
			
			var latlng = new google.maps.LatLng(coordY, coordX);

			var settings = {
				zoom:parseInt($map.attr('data-map-zoom') || 14, 10),
				center:new google.maps.LatLng(coordY, coordX),
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				mapTypeControl:false,
				scrollwheel:false,
				draggable:true,
				mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU},
				navigationControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL},
				styles:[{"stylers":[{"hue":main_color}, {"saturation":-20}, {"lightness":5}]}]
			};

			var map = new google.maps.Map($map.get(0), settings);
			google.maps.event.addDomListener(window, "resize", function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center);
			});

			var contentString = $map.parent().find('#map-info').html() || '';
			var infowindow = new google.maps.InfoWindow({content: contentString});
			var companyImage = new google.maps.MarkerImage(map_marker, null, null, new google.maps.Point(27, 62), new google.maps.Size(54, 64));
			var companyPos = new google.maps.LatLng(coordY, coordX);
			var companyMarker = new google.maps.Marker({
				position:companyPos,
				map:map,
				icon:companyImage,
				zIndex:3
			});

			google.maps.event.addListener(companyMarker, 'click', function() {
				infowindow.open(map, companyMarker);
			});
		},

		//Content slider
		contentSlider:function($root, element) {
			if (typeof $root==='undefined') {$root = jQuery('body');}
			if (typeof element==='undefined') {element = 'div';}

			$root.find('.content-slider').each(function() {
				var $that = jQuery(this), timeout, delay = false, process = false;

				$that.css({position:'relative'}).find('> '+element).each(function(index) {
					$that.height(jQuery(this).outerHeight(true));
					jQuery(this).attr('data-index', index);
					jQuery(this).css({position:'relative', left:0, top:0});
					
					if (index>0) {
						jQuery(this).hide();
					} else {
						$that.attr('data-index', 0);
					}
				});
				
				var $arrows;

				if ($that.attr('data-arrows')) {
					$arrows = jQuery($that.attr('data-arrows'));
				} else {
					$arrows = $that.parent();
				}

				if ($that.attr('data-delay')) {
					delay = parseInt($that.attr('data-delay'), 10);
					timeout = setInterval(function() {
						$arrows.find('.arrow.right').click();
					}, delay);
				}
				
				if ($that.find('> '+element+'[data-index]').length<2) {
					$arrows.hide();
					clearInterval(timeout);
					delay = false;
				}

				$arrows.find('.arrow').click(function() {
					if (!process) {
						process = true;
						clearInterval(timeout);

						var index = parseInt($that.attr('data-index'), 10), last = parseInt($that.find('> '+element +':last-child').attr('data-index'), 10), set;
						var property;
						
						if (jQuery(this).hasClass('left')) {
							set = index===0 ? last : index-1;
							property = [ {left:100}, {left:-100}];
						} else {
							set = index===last ? 0 : index+1;
							property = [{left:-100}, {left:100}];
						}

						var $current = $that.find('> '+element+'[data-index='+index+']'),
							$next = $that.find('> '+element+'[data-index='+set+']');

						$that.attr('data-index', set);
						$current.css({left:'auto', right:'auto'});
						$current.animate({opacity:0}, {duration:300, queue:false});

						$current.animate(property[0], {duration:300, queue:false, complete:function() {
							jQuery(this).hide().css({opacity:1}).css({left:0});

							$that.animate({height:$next.outerHeight(true) }, {duration:(($that.outerHeight(true)===$next.outerHeight(true)) ? 0 : 200), queue:false, complete:function() {
								$next.css({opacity:0, left:'auto', right:'auto'}).css(property[1]).show();
								$next.animate({opacity:1}, {duration:300, queue:false});

								$next.animate({left:0}, {duration:300, queue:false, complete:function() {
									if (delay!==false) {
										timeout=setInterval(function() {
											$arrows.find('.arrow.right').click();
										}, delay);
									}
									process = false;
								}});
							}});
						}});
					}
				});

				jQuery(window).resize(function() {
					$that.each(function() {
						jQuery(this).height(jQuery(this).find('> '+element+':visible').outerHeight(true));
					});
				}).resize();
			});
		},

		//Tweaks for some pages
		tweaks:function() {
			//Error pages
			if (jQuery('#error-page').length>0) {
				jQuery(window).resize(function() {
					jQuery('#error-page').css({marginTop:-Math.ceil(jQuery('#error-page').outerHeight()/2)});
				}).resize();
			}
			
			//Comment form submit button
			jQuery( '.comment-form #submit' ).addClass( 'btn btn-default' );
		},

		//Shortcodes
		shortcodes:function() {
			//Progress bars
			if (jQuery('.progress .progress-bar').length>0) {
				setTimeout(function() {
					jQuery(window).scroll(function() {
						var scrollTop = jQuery(window).scrollTop();
						jQuery('.progress .progress-bar').each(function() {
							var $that = jQuery(this), itemTop = $that.offset().top-jQuery(window).height()+$that.height()/2;

							if (scrollTop>itemTop && $that.outerWidth()===0) {
								var percent = jQuery(this).attr('aria-valuenow')+'%';
								var $value = jQuery(this).parent().parent().find('.progress-value');

								if ($value.length>0) {
									$value.css({width:percent, opacity:0}).text(percent);
								}

								$that.animate({width:percent}, {duration:1500, queue:false, complete:function() {
									if ($value.length>0) {
										$value.animate({opacity:1}, {duration:300, queue:false});
									}
								}});
							}
						});
					}).scroll();
				}, 1);
			}

			//Circular bars
			if (jQuery('.circular-bars').length>0) {
				jQuery('.circular-bars input').each(function() {
					jQuery(this).val(0).knob({
						fgColor:jQuery(this).attr('data-color') || jQuery('a').css('color'),
						width:'90px',
						readOnly:true,
						thickness:0.10
					});
				});

				setTimeout(function() {                        
					jQuery(window).scroll(function() {
						var scrollTop = jQuery(window).scrollTop();

						jQuery('.circular-bars input').each(function() {
							var $that = jQuery(this), itemTop = $that.offset().top-jQuery(window).height()+$that.height()/2;

							if (scrollTop>itemTop && $that.val()==='0') {
								jQuery({value:0}).animate({value:$that.attr('data-value')}, {
									duration:1500,
									queue:false,
									step:function() {
										$that.val(Math.ceil(this.value)).trigger('change');
									}
								});
							}
						});
					}).scroll();
				}, 1);
			}

			//Milestone Counters
			if (jQuery('.milestone').length>0) {
				jQuery('.milestone').each(function() {
					jQuery(this).find('.counter').text('0');
				});

				setTimeout(function() {
					jQuery(window).scroll(function() {
						var scrollTop = jQuery(window).scrollTop();

						jQuery('.milestone').each(function() {
							var $that = jQuery(this), $counter = $that.find('.counter'),
								itemTop = $that.offset().top-jQuery(window).height()+$that.height()/2;

							if (scrollTop>itemTop && parseInt($counter.text(), 10)===0) {
								jQuery({value: parseInt($counter.attr('data-from'), 10)}).animate({
									value:$counter.attr('data-to')
								}, {
									duration:parseInt($counter.attr('data-speed'), 10) || 2000,
									queue:false,
									step:function() {
										$counter.text(Math.ceil(this.value));
									}
								});
							}
						});
					}).scroll();
				}, 1);
			}
		},

		//Images Slider
		imageSlider:function($root, onComplete) {
			if (typeof $root==='undefined') {$root = jQuery('body');}
			
			if ($root.find('.wp-block-gallery').length===0 && $root.find('.image-slider').length===0) {
				if (onComplete && typeof onComplete==='function') {onComplete();}
				return;
			}
			
			//Replace block gallery
			$root.find('.wp-block-gallery').each(function() {
				var $that = jQuery(this);
				var $list = $that.find('li');
				
				$list.each(function() {
					var $item = jQuery(this);
					var $img = $item.find('img');
					$img.removeClass().addClass('img-responsive img-rounded');
					$img.removeAttr('data-id').removeAttr('srcset').removeAttr('sizes').removeAttr('alt');
					$img.appendTo($item);

					var $figure = $item.find('figure');
					$figure.remove();
				});
				
				var $arrows = 	'<div class="arrows">'+
									'<a class="arrow left">'+
										'<i class="fas fa-chevron-left"></i>'+
									'</a>'+
									'<a class="arrow right">'+
										'<i class="fas fa-chevron-right"></i>'+
									'</a>'+
								'</div>';
				
				$that.append($arrows);
				$arrows = $that.find('.arrows');
				
				$that.wrap('<div class="image-slider" />').contents().unwrap();
				$list.wrap('<div />').contents().unwrap();
			});
			
			//Init slider
			$root.find('.image-slider').each(function() {
				var $that = jQuery(this), $arrows = $that.find('.arrows');
				var $list = jQuery(this).find('> div').not('.arrows');
				var timeout, delay = false, process = false;
				
				var setHeight = function($that, onComplete) {
					$that.css({
						height:$that.find('> div:visible img').outerHeight(true)
					});
					
					if (onComplete && typeof onComplete==='function') {onComplete();}
				};

				if ($that.attr('data-delay')) {
					delay = parseInt($that.attr('data-delay'), 10);
					timeout = setInterval(function() {
						$arrows.find('.arrow.right').click();
					}, delay);
				}

				jQuery(this).waitForImages(function() {
					jQuery(this).css({position:'relative'});

					$list.hide().css({
						position:'absolute',
						top:0,
						left:0,
						zIndex:1,
						width:'100%',
						paddingLeft:15,
						paddingRight:15,
					});

					$list.eq(0).show();

					setHeight($that, onComplete);
					
					jQuery(window).resize(function() {
						setTimeout(function() {
							setHeight($that);
						}, 1);
					});

					if ($list.length===1) {
						$arrows.hide();
						clearInterval(timeout);
						delay = false;
					}
				});
				
				$arrows.find('.arrow').on('click', function(e) {
					if (process) {
						e.preventDefault();
						return;
					}
					
					clearInterval(timeout);

					var isRight = jQuery(this).hasClass('right');
					var $current = $that.find('> div:visible').not('.arrows'), $next;

					if (isRight) {
						$next = $current.next();
						if (!$next || $next.is('.arrows')) {$next = $list.eq(0);}
					} else {
						if ($current.is(':first-child')) {
							$next = $list.last();
						} else {
							$next = $current.prev();
						}
					}

					process = true;
					$current.css({zIndex:1});
					
					$next.css({opacity:0, zIndex:2}).show().animate({opacity:1}, {duration:300, queue:false, complete:function() {
						$current.hide().css({opacity:1});
						
						if (delay!==false) {
							timeout = setInterval(function() {
								$arrows.find('.arrow.right').click();
							}, delay);
						}
						
						process = false;
					}});
				});
			});
		},
        
        //Shop
        shop:function() {
            //Single product image slider
            if (jQuery('#product-slider-nav').length>0) {
                jQuery('#product-slider-nav').slick({
                    asNavFor:'#product-slider',
                    arrows:false,
                    dots:false,
                    infinite:true,
                    touchMove:false,                    
                    vertical:true,
                    verticalSwiping:true,
                    slidesToShow:3,
                    focusOnSelect:true,
                    responsive:[{
                        breakpoint:767,
                        settings:{
                            vertical:false,
                            slidesToShow:3
                        }
                    }]
                });
                
                jQuery('#product-slider').slick({
                    asNavFor:'#product-slider-nav',
                    arrows:false,
                    dots:false,
                    swipeToSlide:true                    
                });
            }
        },

		//Twitter widget
		twitter:function() {
			if (jQuery('.twitter-feed').length===0) {
				return;
			}

			var that = this;

			jQuery(window).on('load', function() {           
				var $this = jQuery('.twitter-feed').find('ul').addClass('content-slider').parent();
				that.contentSlider($this, 'li');
			});
		},

		//Share functions
		share:function(network, title, image, url) {
			//Window size
			var w = 650, h = 350, params = 'width='+w+', height='+h+', resizable=1';

			//Select Data
			if (typeof title==='undefined') {
				title = jQuery('title').text();
			} else if (typeof title==='string') {
				if (jQuery(title).length>0) {title = jQuery(title).text();}
			}

			if (typeof image==='undefined') {
				image = '';
			} else if (typeof image==='string') {
				if (!/http/i.test(image)) {
					if (jQuery(image).length>0) {
						if (jQuery(image).is('img')) {
							image = jQuery(image).attr('src');
						} else {
							image = jQuery(image).find('img').eq(0).attr('src');
						}
					} else {
						image = '';
					}
				}
			}

			if (typeof url==='undefined') {
				url = document.location.href;
			} else {
				url = document.location.protocol+'//'+document.location.host+document.location.pathname+url;
			}

			//Share
			if (network==='twitter') {
				return window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(title+' '+url), 'share', params);
			} else if (network==='facebook') {
				return window.open('https://www.facebook.com/sharer/sharer.php?s=100&p[url]='+encodeURIComponent(url)+'&p[title]='+encodeURIComponent(title)+'&p[images][0]='+encodeURIComponent(image), 'share', params);
			} else if (network==='pinterest') {
				return window.open('https://pinterest.com/pin/create/bookmarklet/?media='+image+'&description='+title+' '+encodeURIComponent(url), 'share', params);
			} else if (network==='google') {
				return window.open('https://plus.google.com/share?url='+encodeURIComponent(url), 'share', params);
			} else if (network==='linkedin') {
				return window.open('https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(url)+'&title='+title, 'share', params);
			}
			
			return;
		},

		//Blog
		blog:function() {
			if (jQuery('.blog-masonry').length===0) {
				return;
			}

			//Get column width
			function getColumnWidth() {
				var $that = jQuery('.blog-masonry'), w = $that.outerWidth(true) - 30,
					ww = jQuery(window).width(), columns;

				if ($that.hasClass('blog-masonry-four')) {
					columns = 4;
				} else if ($that.hasClass('blog-masonry-three')) {
					columns = 3;
				} else if ($that.hasClass('blog-masonry-two')) {
					columns = 2;
				} else {
					columns = 1;
				}

				if (ww<=767) {
					columns = 1;
				} else if (ww>=768 && ww<=991 && columns>2) {
					columns -= 1;
				}
				
				return Math.floor(w/columns);
			}

			jQuery('.blog-post.masonry').css({width:getColumnWidth()});

			jQuery('.blog-masonry').waitForImages(function() {
				jQuery(this).isotope({
					itemSelector:'.blog-post.masonry',
					resizable:false,
					transformsEnabled:false,
					masonry:{columnWidth:getColumnWidth()}
				});
			});

			jQuery(window).resize(function() {
				var size = getColumnWidth();
				jQuery('.blog-post.masonry').css({width:size});
				jQuery('.blog-masonry').isotope({
					masonry: {columnWidth:size}
				});
			});
		},

		//Animations
		animations:function() {
			if (this.isTouch()) {
				Royal_Options.animations = false;
			}
			
			if (!Royal_Options.animations) {
				jQuery('.animation[class*="animation-"]').removeClass('animation');
			} else {
				var animationItem = jQuery('.animation[class*="animation-"]');

				if (animationItem.length) {
					var delay;

					animationItem.not('.active').each(function(i) {
						if (i!==0 && jQuery(this).offset().top===jQuery(animationItem.get(i-1)).offset().top) {
							delay++;
						} else {
							delay = 0;
						}
						
						jQuery(this).css({
							'-webkit-transition-delay':delay*150+'ms',
							   '-moz-transition-delay':delay*150+'ms',
								 '-o-transition-delay':delay*150+'ms',
								'-ms-transition-delay':delay*150+'ms',
									'transition-delay':delay*150+'ms'
						});
					});

					setTimeout(function() {
						jQuery(window).on('royal.complete', function() {
							jQuery(window).scroll(function() {
								var scrollTop = jQuery(window).scrollTop();
								animationItem.not('.active').each(function() {
									var $that = jQuery(this), 
										itemTop = $that.offset().top-jQuery(window).height()+$that.outerHeight()/2;
									
									if (scrollTop>itemTop) {
										jQuery(this).addClass('active');
									}
								});
							}).scroll();
						});
					}, 1);
				}
			}
	
			/*** How it looks (iMacs preview) ***/
			if (jQuery('.imacs').length>0) {
				if (!Royal_Options.animations) {
					jQuery('.imacs').find('.item').not('.center').addClass('complete');
					return;
				}
				
				setTimeout(function() {
					jQuery(window).on('royal.complete', function() {
						jQuery(window).scroll(function() {
							var scrollTop = jQuery(window).scrollTop();
							jQuery('.imacs').find('.item').not('.complete').each(function() {
								var $that = jQuery(this), 
									itemTop = $that.offset().top-jQuery(window).height()+$that.height()/2;
								
								if (scrollTop>itemTop && !$that.hasClass('center')) {
									$that.addClass('complete');
								}
							});
						}).scroll();
					});
				}, 1);
			}
		}
	};

	//Initialize
	$.Royal_Theme.init();

})(jQuery);

//Share Functions
function shareTo(network, title, image, url) {
	return jQuery.Royal_Theme.share(network, title, image, url);
}

