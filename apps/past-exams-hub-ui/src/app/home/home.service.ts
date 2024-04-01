import { Injectable, inject } from '@angular/core';
import { ExamsService, StatisticsService } from '@org/portal/data-access';
import { BehaviorSubject, forkJoin, map, switchMap } from 'rxjs';

@Injectable()
export class HomeService {
  private statisticsService = inject(StatisticsService);
  private examsService = inject(ExamsService);

  private _refresh = new BehaviorSubject<void>(undefined);
  refresh$ = this._refresh.asObservable();

  fetchData() {
    return this.refresh$.pipe(
      switchMap(() =>
        forkJoin([
          this.statisticsService.statisticsGet(),
          this.examsService.examsLatestExamsGet(),
        ]).pipe(
          map(([statistics, latestExams]) => {
            return { statistics, latestExams };
          })
        )
      )
    );
  }
}
