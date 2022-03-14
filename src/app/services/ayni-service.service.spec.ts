import { TestBed } from '@angular/core/testing';

import { AyniServiceService } from './ayni-service.service';

describe('AyniServiceService', () => {
  let service: AyniServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AyniServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
