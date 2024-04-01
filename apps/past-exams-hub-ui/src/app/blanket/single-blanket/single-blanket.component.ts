import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, switchMap, tap } from 'rxjs';
import { SingleBlanketService } from './single-blanket.service';
import { ExamSolutionService, ExamsService } from 'libs/portal/src/api/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBaseComponent } from '../../shared/components/form-base.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PastExamsHubCoreApplicationExamsModelsExamModel } from 'libs/portal/src/model/models';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { TableScrollingViewportComponent } from '../../shared/components/table-scrolling-viewport';
import { ListRange } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pastexamshub-single-blanket',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    TableScrollingViewportComponent,
  ],
  providers: [SingleBlanketService, ExamsService, ExamSolutionService],
  templateUrl: './single-blanket.component.html',
  styleUrl: './single-blanket.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleBlanketComponent extends FormBaseComponent {
  currentUser = this.currentUserService.currentUser;
  fileData!: any;
  itemsSlice = [];
  items = [];
  isPdfFile = false;
  data$ = this.route.paramMap.pipe(
    switchMap((x) => {
      const id = x.get('id');
      return combineLatest({
        userData: this.singleBlanketService.fetchData(id as string),
      }).pipe(
        tap((data) => {
          this.fileData = `data:${
            (
              data.userData
                .exam as PastExamsHubCoreApplicationExamsModelsExamModel
            ).contentType
          };base64,${
            (
              data.userData
                .exam as PastExamsHubCoreApplicationExamsModelsExamModel
            ).file
          }`;

          this.isPdfFile =
            data.userData.exam?.fileType === 'Document' ? true : false;
          this.form = this.fb.group({
            note: [
              data.userData.exam!.notes ?? '',
              [Validators.required, Validators.minLength(1)],
            ],
          });
        })
      );
    })
  );
  private router = inject(Router);

  dataSource = new MatTableDataSource();

  displayedColumns: string[] = [
    'date',
    'owner',
    'file',
    'taskNumber',
    'rating',
    'action',
  ];
  constructor(
    private route: ActivatedRoute,
    private singleBlanketService: SingleBlanketService,
    private sanitizer: DomSanitizer,
    private currentUserService: CurrentUserService,
    private location: Location,
    private dialog: MatDialog
  ) {
    super();
  }

  goBack(): void {
    this.location.back();
  }

  transformLabel(label: string): string {
    return label
      .split('')
      .map((char, index) => {
        return char.toUpperCase() === char && index !== 0 ? ` ${char}` : char;
      })
      .join('');
  }

  bypassAndSanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  updatePagination(pageIndex: number, pageSize: number) {
    this.singleBlanketService.dataStateChanged = {
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
  }

  addSolutions(uid: string | undefined) {
    this.router.navigate(['/dodaj_resenje', uid]);
  }

  minusRating(uid: string, isAlreadyGraded: boolean) {
    this.singleBlanketService.postGrade(uid, false, isAlreadyGraded);
  }

  plusRating(uid: string, isAlreadyGraded: boolean) {
    this.singleBlanketService.postGrade(uid, true, isAlreadyGraded);
  }

  updateSlice(range: ListRange) {
    this.itemsSlice = this.items.slice(range.start, range.end);
  }
  redirectTo(uid: string) {
    this.router.navigate(['/resenje', uid]);
  }

  deleteSolution(uid: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '450px',
      data: 'Da li ste sigurni da zelite da obrisete?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.singleBlanketService.deleteSolution(uid);
      }
    });
  }
}
