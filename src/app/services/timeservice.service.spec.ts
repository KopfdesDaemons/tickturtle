import { TestBed } from '@angular/core/testing';

import { TimeserviceService } from './timeservice.service';

describe('TimeserviceService', () => {
  let service: TimeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
