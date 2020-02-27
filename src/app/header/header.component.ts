import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	constructor() { }

	
	public ngOnInit()
	{
		$(document).ready(function(){
			$(".menuSmall, .toggle_mobile").click(function(){
				$(".fix_menu").addClass("openMenu");
				$("body").addClass("fixbody");
			});
			$(".closeMenu").click(function(){
				$(".fix_menu").removeClass("openMenu");
				$("body").removeClass("fixbody");
			});
		});
		$(window).scroll(function(){
			var sticky = $('.header'),
			scroll = $(window).scrollTop();

			if (scroll >= 200) sticky.addClass('fixed');
			else sticky.removeClass('fixed');
		});
	}
}
