import { Injectable } from '@angular/core';
import { ExamSolutionService, ExamsService } from 'libs/portal/src/api/api';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';

@Injectable()
export class SingleBlanketService {
  private _pageSettings = new BehaviorSubject<{
    pageSizes: number[];
    pageSize: number;
    totalRecordsCount?: number;
    currentPage?: number;
  }>({
    pageSizes: [10, 20, 50],
    pageSize: 10,
  });
  pageSettings$ = this._pageSettings.asObservable();

  private _dataStateChanged = new BehaviorSubject<{
    skip: number;
    take: number;
  }>({
    skip: 0,
    take: 10,
  });
  dataStateChanged$ = this._dataStateChanged.asObservable().pipe(
    distinctUntilChanged((prev, curr) => {
      return prev.skip === curr.skip && prev.take === curr.take;
    })
  );

  private _refresh = new BehaviorSubject<void>(undefined);
  refresh$ = this._refresh.asObservable();

  constructor(
    private examsService: ExamsService,
    private examSolutionService: ExamSolutionService
  ) {}

  set dataStateChanged(dataStateChanged: {
    pageIndex: number;
    pageSize: number;
  }) {
    this._dataStateChanged.next({
      skip: dataStateChanged.pageIndex * dataStateChanged.pageSize,
      take: dataStateChanged.pageSize,
    });
  }

  refreshData() {
    this._refresh.next(undefined);
  }

  fetchDataExams(id: string) {
    return this.examsService.examsUidGet(id).pipe(map((x) => x.exam));
  }

  fetchExamSolution(uid: string, pageNumber: number, pageSize: number) {
    return this.examSolutionService
      .examSolutionGet(uid)
      .pipe(map((x) => x.solutions));
  }

  // fetchData(uid: string) {
  //   return combineLatest([this.refresh$, this.dataStateChanged$]).pipe(
  //     switchMap(([, dataStateChanges]) => {
  //       return this.fetchExamSolution(
  //         uid,
  //         (dataStateChanges.skip as number) /
  //           (dataStateChanges.take as number) +
  //           1,
  //         dataStateChanges.take as number
  //       );
  //     })
  //   );
  // }

  fetchData(uid: string) {
    return combineLatest([this.refresh$, this.dataStateChanged$]).pipe(
      switchMap(([, dataStateChanges]) => {
        const examSolutions = this.fetchExamSolution(
          uid,
          (dataStateChanges.skip as number) /
            (dataStateChanges.take as number) +
            1,
          dataStateChanges.take as number
        );

        const examData = this.fetchDataExams(uid);

        return combineLatest([examSolutions, examData]).pipe(
          map(([solutions, exam]) => ({ solutions, exam }))
        );
      })
    );
  }

  postGrade(uid: string, value: boolean, isAlreadyGraded: boolean) {
    this.examSolutionService
      .examSolutionGradePost(uid, value, isAlreadyGraded)
      .pipe(tap(() => this.refreshData()))
      .subscribe();
  }

  deleteSolution(uid: string) {
    this.examSolutionService
      .examSolutionUidDelete(uid, {})
      .pipe(tap(() => this.refreshData()))
      .subscribe();
  }
}
