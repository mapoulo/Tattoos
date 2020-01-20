import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomizePage } from './customize.page';

describe('CustomizePage', () => {
  let component: CustomizePage;
  let fixture: ComponentFixture<CustomizePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
