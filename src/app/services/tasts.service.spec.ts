import { TestBed } from '@angular/core/testing';

import { TastsService } from './tasts.service';

describe('TastsService', () => {
  let service: TastsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TastsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
