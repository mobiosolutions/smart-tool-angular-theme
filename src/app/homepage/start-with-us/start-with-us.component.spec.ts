import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartWithUsComponent } from './start-with-us.component';

describe('StartWithUsComponent', () => {
  let component: StartWithUsComponent;
  let fixture: ComponentFixture<StartWithUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartWithUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartWithUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
