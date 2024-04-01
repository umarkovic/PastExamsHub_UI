import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  PastExamsHubCoreApplicationCommonUsersModelsUserModel,
  UsersService,
} from '@org/portal/data-access';
import { MatInputModule } from '@angular/material/input';
import { StudentsService } from './students.service';
import { TableScrollingViewportComponent } from '../shared/components/table-scrolling-viewport';
import { ListRange } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddEditStudentDialogComponent } from './add-edit-student-dialog/add-edit-student-dialog.component';
import { CurrentUserService } from '../shared/services/current-user.service';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { isEqual } from 'lodash';

export interface StudentsFilter {
  search: string | null;
  year: number | string | null;
}

@Component({
  selector: 'pastexamshub-students',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TableScrollingViewportComponent,
  ],
  providers: [StudentsService, UsersService],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsComponent extends FormBaseComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  years = [
    { uid: null, name: 'Sve godine' },
    { uid: 1, name: 1 },
    { uid: 2, name: 2 },
    { uid: 3, name: 3 },
    { uid: 4, name: 4 },
  ];
  items = [];
  itemsSlice = [];
  currentUser = this.currentUserService.currentUser;
  dataSource = new MatTableDataSource();

  readonly DEFAULT_VALUES: StudentsFilter = {
    search: null,
    year: null,
  };

  data$ = this.route.queryParamMap.pipe(
    switchMap(() => {
      return this.form.valueChanges.pipe(
        startWith({
          ...this.DEFAULT_VALUES,
        }),
        debounceTime(300),
        distinctUntilChanged(isEqual),
        tap(
          (changes) =>
            (this.studentsService.studentsFilter = changes as StudentsFilter)
        ),
        switchMap(() => this.studentsService.fetchData()),
        map((data) => ({ students: data }))
      );
    })
  );

  displayedColumns: string[] = ['email', 'fullName', 'index', 'year', 'action'];

  constructor(
    private route: ActivatedRoute,
    private studentsService: StudentsService,
    private dialog: MatDialog,
    private currentUserService: CurrentUserService
  ) {
    super();
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      search: [''],
      year: [null],
    });
  }

  updatePagination(pageIndex: number, pageSize: number) {
    this.studentsService.dataStateChanged = {
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
  }

  updateSlice(range: ListRange) {
    this.itemsSlice = this.items.slice(range.start, range.end);
  }

  addEditStudent(
    data?: PastExamsHubCoreApplicationCommonUsersModelsUserModel,
    isVisibility?: boolean
  ) {
    const dialogRef = this.dialog.open(AddEditStudentDialogComponent, {
      width: '750px',
      data: { data: data, isVisibility: isVisibility },
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          email: string;
          firstName: string;
          lastName: string;
          index: number;
          studyYear: number;
          gender: string;
          uid?: string;
        }) => {
          if (result) {
            if (result.uid) {
              this.studentsService.editStudent(result);
            } else {
              this.studentsService.addStudent(result);
            }
          }
        }
      );
  }
}
