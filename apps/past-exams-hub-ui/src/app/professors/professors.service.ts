import { Injectable } from '@angular/core';
import { TeachersService } from '@org/portal/data-access';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class ProfessorsService {
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

  constructor(private teachersService: TeachersService) {}

  set dataStateChanged(dataStateChanged: {
    pageIndex: number;
    pageSize: number;
  }) {
    this._dataStateChanged.next({
      skip: dataStateChanged.pageIndex * dataStateChanged.pageSize,
      take: dataStateChanged.pageSize,
    });
  }

  fetchTeachers(pageNumber: number, pageSize: number) {
    return this.teachersService.teachersGet(pageNumber, pageSize).pipe(
      map((res) => ({
        data: {
          result: res.teachers,
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
    return combineLatest([this.dataStateChanged$, this.refresh$]).pipe(
      switchMap(([dataStateChanges]) => {
        return this.fetchTeachers(
          (dataStateChanges.skip as number) /
            (dataStateChanges.take as number) +
            1,
          dataStateChanges.take as number
        );
      })
    );
  }

  updatePageSettings(currentPage: number, pageSize?: number) {
    this._pageSettings.next({
      ...this._pageSettings.getValue(),
      currentPage,
      pageSize: pageSize ?? this._pageSettings.getValue().pageSize,
    });
  }

  refreshData() {
    this._refresh.next(undefined);
  }

  editProfessor(data: {
    email: string;
    firstName: string;
    lastName: string;
    courses: [{ name: string; uid: string }];
    uid?: string;
  }) {
    this.teachersService
      .teachersUidPut(data.uid as string, {
        firstName: data.firstName,
        courses: data.courses,
        lastName: data.lastName,
      })
      .pipe(
        tap(() => {
          this.refreshData();
        })
      )
      .subscribe();
  }

  addProfessor(data: {
    email: string;
    firstName: string;
    lastName: string;
    courses: [{ name: string; uid: string }];
    uid?: string;
  }) {
    console.log(data);
  }

  getProfessorSingle(dataUid: string) {
    return this.teachersService
      .teachersUidGet(dataUid)
      .pipe(map((x) => x.user));
  }
}
