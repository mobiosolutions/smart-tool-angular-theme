import { Component,OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-solution',
	templateUrl: './solution.component.html',
	styleUrls: ['./solution.component.scss'],
})
export class SolutionComponent implements OnInit {
	modalRef: BsModalRef;
	constructor(private modalService: BsModalService) {}

	ngOnInit(): void {
	}
	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

}

