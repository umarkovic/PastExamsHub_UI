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
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  ExamPeriodsService,
  PastExamsHubCoreApplicationExamPeriodsExamPeriodModel,
  PastExamsHubCoreDomainEnumsExamPeriodType,
} from '@org/portal/data-access';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeadlinesService } from './deadlines.service';
import { MatButtonModule } from '@angular/material/button';
import { TableScrollingViewportComponent } from '../shared/components/table-scrolling-viewport';
import { ListRange } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddEditDeadlineDialogComponent } from './add-edit-deadlines-dialog/add-edit-deadlines-dialog.component';
import { DeleteConfirmationDialogComponent } from '../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CurrentUserService } from '../shared/services/current-user.service';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isEqual } from 'lodash';
import { MatSelectModule } from '@angular/material/select';

export interface DeadlinesFilter {
  search: string | null;
  period: string | null;
}

@Component({
  selector: 'pastexamshub-deadlines',
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
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],

  providers: [DeadlinesService, ExamPeriodsService, provideNativeDateAdapter()],
  templateUrl: './deadlines.component.html',
  styleUrl: './deadlines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeadlinesComponent extends FormBaseComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items = [];
  itemsSlice = [];
  currentUser = this.currentUserService.currentUser;
  private router = inject(Router);

  dataSource = new MatTableDataSource();

  readonly DEFAULT_VALUES: DeadlinesFilter = {
    search: null,
    period: null,
  };

  readonly periods = [
    { uid: null, name: 'Svi periodi' },
    { uid: 'Januar', name: 'Januar' },
    { uid: 'April', name: 'April' },
    { uid: 'Jun', name: 'Jun' },
    { uid: 'Jun2', name: 'Jun2' },
    { uid: 'Septembar', name: 'Septembar' },
    { uid: 'Oktobar', name: 'Oktobar' },
    { uid: 'Oktobar2', name: 'Oktobar2' },
    { uid: 'Decembar', name: 'Decembar' },
  ];

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
            (this.deadlinesService.deadlinesFilter = changes as DeadlinesFilter)
        ),
        switchMap(() => this.deadlinesService.fetchData())
      );
    })
  );

  displayedColumns: string[] = [
    'nameDeadlines',
    'start',
    'end',
    'duration',
    'action',
  ];
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private deadlinesService: DeadlinesService,
    private currentUserService: CurrentUserService
  ) {
    super();
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      search: [''],
      period: [null],
    });
  }

  updatePagination(pageIndex: number, pageSize: number) {
    this.deadlinesService.dataStateChanged = {
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
  }

  updateSlice(range: ListRange) {
    this.itemsSlice = this.items.slice(range.start, range.end);
  }

  onRowClick(data: any) {
    this.router.navigate(['/blanketi'], {
      queryParams: { uid: data.uid, lastPage: 'rokovi' },
    });
  }

  addEditDeadline(
    data?: PastExamsHubCoreApplicationExamPeriodsExamPeriodModel
  ) {
    const dialogRef = this.dialog.open(AddEditDeadlineDialogComponent, {
      width: '750px',
      data: data,
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          name: string;
          type: PastExamsHubCoreDomainEnumsExamPeriodType;
          start: Date;
          end: Date;
          uid?: string;
        }) => {
          if (result) {
            if (result.uid) {
              this.deadlinesService.editDeadline(result);
            } else {
              this.deadlinesService.addDeadline(result);
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
        this.deadlinesService.removeDeadline(uid);
      }
    });
  }
}
