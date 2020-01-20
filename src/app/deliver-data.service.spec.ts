import { TestBed } from '@angular/core/testing';

import { DeliverDataService } from './deliver-data.service';

describe('DeliverDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliverDataService = TestBed.get(DeliverDataService);
    expect(service).toBeTruthy();
  });
});
