import { Injectable } from '@angular/core';
import { ExamsService } from '@org/portal/data-access';

@Injectable()
export class BlanketService {
  constructor(private examsService: ExamsService) {}

  fetchData(lastPage: string, uid: string) {
    return this.examsService.examsGet(
      lastPage === 'predmeti' ? undefined : uid,
      lastPage === 'predmeti' ? uid : undefined,
      0,
      0
    );
  }
}
