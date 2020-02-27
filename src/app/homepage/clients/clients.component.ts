import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import 'slick-carousel';

@Component({
	selector: 'app-clients',
	templateUrl: './clients.component.html',
	styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

	constructor() { }

	ngOnInit(){
		jQuery(".testimonial_slider").slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: false,
			autoplay: true,
			speed: 1000,
			vertical: false,
			infinite: true,
			autoplaySpeed: 2000,
		});
	}
}
