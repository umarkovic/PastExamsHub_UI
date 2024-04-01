import { Injectable } from '@angular/core';
import {
  PastExamsHubCoreDomainEnumsGenderType,
  UsersService,
} from '@org/portal/data-access';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { StudentsFilter } from './students.component';
import { isEqual } from 'lodash';

@Injectable()
export class StudentsService {
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
  dataStateChanged$ = this._dataStateChanged
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => prev.skip === curr.skip && prev.take === curr.take
      )
    );

  private _refresh = new BehaviorSubject<void>(undefined);
  refresh$ = this._refresh.asObservable();

  private _studentsFilter = new BehaviorSubject<StudentsFilter>({
    search: null,
    year: null,
  });
  studentsFilter$ = this._studentsFilter
    .asObservable()
    .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)));

  constructor(private usersService: UsersService) {}

  set dataStateChanged(dataStateChanged: {
    pageIndex: number;
    pageSize: number;
  }) {
    this._dataStateChanged.next({
      skip: dataStateChanged.pageIndex * dataStateChanged.pageSize,
      take: dataStateChanged.pageSize,
    });
  }

  set studentsFilter(studentsFilter: StudentsFilter) {
    this._studentsFilter.next(studentsFilter);
  }

  get studentsFilter() {
    return this._studentsFilter.value;
  }

  fetchUsers(filters: StudentsFilter, pageNumber: number, pageSize: number) {
    return this.usersService
      .usersGet(
        filters.year as number,
        pageNumber,
        pageSize,
        filters.search as string
      )
      .pipe(
        map((res) => ({
          data: {
            result: res.users,
            count: res.totalCount,
          },
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          pageSize: res.pageSize,
          hasNext: res.hasNext,
          hasPrevious: res.hasPrevious,
        })),
        tap((res) => {
          if (res.data && res.data.count! > 0) {
            this._pageSettings.next({
              ...this._pageSettings.getValue(),
              totalRecordsCount: res.data.count,
              pageSize: res.pageSize as number,
              currentPage: res.currentPage,
            });
          }
        })
      );
  }

  fetchData() {
    return combineLatest([
      this.studentsFilter$,
      this.dataStateChanged$,
      this.refresh$,
    ]).pipe(
      switchMap(([studentsFilter, dataStateChanges]) => {
        const pageNumber = dataStateChanges.skip / dataStateChanges.take + 1;
        return this.fetchUsers(
          studentsFilter,
          pageNumber,
          dataStateChanges.take
        );
      })
    );
  }

  refreshData() {
    this._refresh.next(undefined);
  }

  editStudent(data: {
    email: string;
    firstName: string;
    lastName: string;
    index: number;
    studyYear: number;
    gender: string;
    uid?: string;
  }) {
    this.usersService
      .usersUidPut(data.uid as string, {
        firstName: data.firstName,
        gender: data.gender as PastExamsHubCoreDomainEnumsGenderType,
        index: data.index,
        lastName: data.lastName,
        studyYear: data.studyYear,
      })
      .pipe(
        tap(() => {
          this.refreshData();
        })
      )
      .subscribe();
  }
  addStudent(data: {
    email: string;
    firstName: string;
    lastName: string;
    index: number;
    studyYear: number;
    gender: string;
    uid?: string;
  }) {
    console.log(data);
  }
}
