import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService } from './subjects.service';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  CoursesService,
  PastExamsHubCoreApplicationCoursesModelsCourseModel,
  PastExamsHubCoreApplicationTeachersModelsTeacherListModel,
  TeachersService,
} from '@org/portal/data-access';
import { MatButtonModule } from '@angular/material/button';
import { TableScrollingViewportComponent } from '../shared/components/table-scrolling-viewport';
import { ListRange } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddEditSubjectsDialogComponent } from './add-edit-subjects-dialog/add-edit-subjects-dialog.component';
import { DeleteConfirmationDialogComponent } from '../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CurrentUserService } from '../shared/services/current-user.service';
import { isEqual } from 'lodash';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface SubjectsFilter {
  search: string | null;
  professor: string | null;
  type: string | null;
}

@Component({
  selector: 'pastexamshub-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TableScrollingViewportComponent,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SubjectsService, CoursesService, TeachersService],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsComponent extends FormBaseComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items = [];
  itemsSlice = [];
  private router = inject(Router);
  dataSource = new MatTableDataSource();
  currentUser = this.currentUserService.currentUser;
  readonly types = [
    { uid: null, name: 'Svi tipovi' },
    { uid: 'Obavezni', name: 'Obavezni' },
    { uid: 'Izborni', name: 'Izborni' },
  ];
  readonly DEFAULT_VALUES: SubjectsFilter = {
    search: null,
    professor: null,
    type: null,
  };

  data$ = this.route.queryParamMap.pipe(
    switchMap((res: any) => {
      const godinaStudija = res.get('godinaStudija');
      return this.form.valueChanges.pipe(
        startWith(this.DEFAULT_VALUES),
        debounceTime(300),
        distinctUntilChanged(isEqual),
        tap(
          (changes) =>
            (this.subjectsService.subjectsFilter = changes as SubjectsFilter)
        ),
        switchMap(() =>
          combineLatest([
            this.subjectsService.fetchProfessorsData().pipe(
              map((professorsData) => [
                {
                  id: undefined,
                  uid: undefined,
                  email: undefined,
                  fullName: 'Svi profesori',
                  courses: undefined,
                  numberOfCourses: undefined,
                } as PastExamsHubCoreApplicationTeachersModelsTeacherListModel,
                ...professorsData!,
              ])
            ),
            this.subjectsService.fetchData(godinaStudija),
          ]).pipe(
            map(([professorsData, subjectData]) => ({
              professorsData,
              subjectData,
            }))
          )
        )
      );
    })
  );

  displayedColumns: string[] = [
    'nameSubject',
    'type',
    'professors',
    'studies',
    'year',
    'espb',
    'action',
  ];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private subjectsService: SubjectsService,
    private currentUserService: CurrentUserService
  ) {
    super();
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      search: [''],
      professor: [null],
      type: [null],
    });
  }

  updatePagination(pageIndex: number, pageSize: number) {
    this.subjectsService.dataStateChanged = {
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
  }

  updateSlice(range: ListRange) {
    this.itemsSlice = this.items.slice(range.start, range.end);
  }

  onRowClick(data: any) {
    this.router.navigate(['/blanketi'], {
      queryParams: { uid: data.uid, lastPage: 'predmeti' },
    });
  }

  addEditSubject(
    proffesorsData: PastExamsHubCoreApplicationTeachersModelsTeacherListModel[],
    dataSubject?: PastExamsHubCoreApplicationCoursesModelsCourseModel
  ) {
    const dialogRef = this.dialog.open(AddEditSubjectsDialogComponent, {
      width: '750px',
      data: { dataSubject: dataSubject, proffesorsData: proffesorsData },
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          name: string;
          type: string;
          professorUid: string;
          year: number;
          semester: number;
          points: number;
          uid?: string;
        }) => {
          if (result) {
            if (result.uid) {
              this.subjectsService.editSubjects(result);
            } else {
              this.subjectsService.addSubjects(result);
            }
          }
        }
      );
  }

  remove(uid: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '450px',
      data: 'Da li ste sigurni da zelite da obrisete?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subjectsService.removeSubject(uid);
      }
    });
  }
}
