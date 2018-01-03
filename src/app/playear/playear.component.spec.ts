import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayearComponent } from './playear.component';

describe('PlayearComponent', () => {
  let component: PlayearComponent;
  let fixture: ComponentFixture<PlayearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
