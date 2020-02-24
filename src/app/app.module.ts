import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { BannerComponent } from './homepage/banner/banner.component';
import { SolutionComponent } from './homepage/solution/solution.component';
import { HowItWorksComponent } from './homepage/how-it-works/how-it-works.component';
import { FeaturesComponent } from './homepage/features/features.component';
import { PricingPlansComponent } from './homepage/pricing-plans/pricing-plans.component';
import { StartWithUsComponent } from './homepage/start-with-us/start-with-us.component';
import { MapComponent } from './homepage/map/map.component';
import { ContactUsComponent } from './homepage/contact-us/contact-us.component';
import { ClientsComponent } from './homepage/clients/clients.component';
import { VideoComponent } from './homepage/solution/video/video.component';
import { BlogComponent } from './homepage/blog/blog.component';

@NgModule({
	declarations: [
	AppComponent,
	HeaderComponent,
	FooterComponent,
	HomepageComponent,
	BannerComponent,
	SolutionComponent,
	HowItWorksComponent,
	FeaturesComponent,
	PricingPlansComponent,
	StartWithUsComponent,
	MapComponent,
	ContactUsComponent,
	ClientsComponent,
	VideoComponent,
	BlogComponent
	],
	imports: [
	BrowserModule,
	NgbModule,
	ModalModule.forRoot()
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
