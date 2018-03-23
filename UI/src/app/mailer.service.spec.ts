import { TestBed, inject } from '@angular/core/testing';

import { MailerService } from './mailer.service';

describe('MailerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailerService]
    });
  });

  it('should be created', inject([MailerService], (service: MailerService) => {
    expect(service).toBeTruthy();
  }));
});
