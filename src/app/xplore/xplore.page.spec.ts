import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { XplorePage } from './xplore.page';

describe('XplorePage', () => {
  let component: XplorePage;
  let fixture: ComponentFixture<XplorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XplorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(XplorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
