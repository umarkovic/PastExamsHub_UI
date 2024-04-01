import { Injectable } from '@angular/core';
import { ExamSolutionService } from '@org/portal/data-access';
import { BehaviorSubject, switchMap, tap } from 'rxjs';

@Injectable()
export class SolutionService {
  private _refresh = new BehaviorSubject<void>(undefined);
  refresh$ = this._refresh.asObservable();

  constructor(private examSolutionService: ExamSolutionService) {}

  refreshData() {
    this._refresh.next(undefined);
  }

  fetchData(uid: string) {
    return this.refresh$.pipe(
      switchMap(() => {
        return this.examSolutionService.examSolutionUidGet(uid);
      })
    );
  }

  postGrade(uid: string, value: boolean, isAlreadyGraded: boolean) {
    this.examSolutionService
      .examSolutionGradePost(uid, value, isAlreadyGraded)
      .pipe(tap(() => this.refreshData()))
      .subscribe();
  }
}
