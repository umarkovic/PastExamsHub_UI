import { Injectable } from '@angular/core';
import {
  ExamPeriodsService,
  PastExamsHubCoreDomainEnumsExamPeriodType,
} from '@org/portal/data-access';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { DeadlinesFilter } from './deadlines.component';
import { isEqual } from 'lodash';

@Injectable()
export class DeadlinesService {
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

  private _deadlinesFilter = new BehaviorSubject<DeadlinesFilter>({
    search: null,
    period: null,
  });
  deadlinesFilter$ = this._deadlinesFilter
    .asObservable()
    .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)));

  constructor(private examPeriodsService: ExamPeriodsService) {}

  set deadlinesFilter(deadlinesFilter: DeadlinesFilter) {
    this._deadlinesFilter.next(deadlinesFilter);
  }

  get deadlinesFilter() {
    return this._deadlinesFilter.value;
  }

  set dataStateChanged(dataStateChanged: {
    pageIndex: number;
    pageSize: number;
  }) {
    this._dataStateChanged.next({
      skip: dataStateChanged.pageIndex * dataStateChanged.pageSize,
      take: dataStateChanged.pageSize,
    });
  }

  fetchExamPeriods(
    filters: DeadlinesFilter,
    pageNumber: number,
    pageSize: number
  ) {
    return this.examPeriodsService
      .examPeriodsGet(
        filters.period as PastExamsHubCoreDomainEnumsExamPeriodType,
        pageNumber,
        pageSize,filters.search as string
      )
      .pipe(
        map((res) => ({
          data: {
            result: res.periods,
            count: res.totalCount,
          },
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          pageSize: res.pageSize,
          hasNext: res.hasNext,
          hasPrevious: res.hasPrevious,
        })),
        tap((res) => {
          if ((res.data?.count as number) > 0) {
            this._pageSettings.next({
              ...this._pageSettings.getValue(),
              totalRecordsCount: res.data?.count ?? 0,
              pageSize: res.pageSize as number,
              currentPage: res.currentPage,
            });
          }
        })
      );
  }

  fetchData() {
    return combineLatest([
      this.deadlinesFilter$,
      this.refresh$,
      this.dataStateChanged$,
    ]).pipe(
      switchMap(([deadlinesFilter, , dataStateChanges]) => {
        return this.fetchExamPeriods(
          deadlinesFilter,
          (dataStateChanges.skip as number) /
            (dataStateChanges.take as number) +
            1,
          dataStateChanges.take as number
        );
      })
    );
  }

  refreshData() {
    this._refresh.next(undefined);
  }

  addDeadline(data: {
    name: string;
    type: PastExamsHubCoreDomainEnumsExamPeriodType;
    start: Date;
    end: Date;
    uid?: string;
  }) {
    this.examPeriodsService
      .examPeriodsPost({
        name: data.name,
        periodType: data.type,
        startDate: data.start,
        endDate: data.end,
      })
      .pipe(
        tap(() => {
          this.refreshData();
        })
      )
      .subscribe();
  }
  editDeadline(data: {
    name: string;
    type: PastExamsHubCoreDomainEnumsExamPeriodType;
    start: Date;
    end: Date;
    uid?: string;
  }) {
    this.examPeriodsService
      .examPeriodsUidPut(data.uid as string, {
        name: data.name,
        periodType: data.type,
        startDate: data.start,
        endDate: data.end,
      })
      .pipe(
        tap(() => {
          this.refreshData();
        })
      )
      .subscribe();
  }

  removeDeadline(uid: string) {
    this.examPeriodsService
      .examPeriodsUidDelete(uid, {})
      .pipe(
        tap(() => {
          this.refreshData();
        })
      )
      .subscribe();
  }
}
