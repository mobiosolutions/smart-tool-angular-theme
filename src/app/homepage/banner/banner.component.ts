import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import 'slick-carousel';

@Component({
	selector: 'app-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

	constructor() { }

	ngOnInit(){
		jQuery('.bannerSlider').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			fade: true,
			arrows: false,
			dots: true,
			autoplay: true,
			appendDots: $('.bannerDots'),
			speed: 1000,
			autoplaySpeed: 4500,
			pauseOnHover: true,
			customPaging : function(slider, i) {
				var thumb = jQuery(slider.$slides[i]).data();
				return '<a>'+('0'+(i+1)).slice(-2)+'</a>';
			}
		});
	}

}
