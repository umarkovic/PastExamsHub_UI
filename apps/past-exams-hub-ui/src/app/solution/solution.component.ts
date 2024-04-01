import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SolutionService } from './solution.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { ExamSolutionService } from 'libs/portal/src/api/api';
import { CurrentUserService } from '../shared/services/current-user.service';
import { Location } from '@angular/common';
import { PastExamsHubCoreApplicationExamsModelsExamModel } from 'libs/portal/src/model/models';

@Component({
  selector: 'pastexamshub-solution',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  providers: [SolutionService, ExamSolutionService],
  templateUrl: './solution.component.html',
  styleUrl: './solution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionComponent extends FormBaseComponent {
  fileData!: any;
  isPdfFile = false;
  currentUser = this.currentUserService.currentUser;

  data$ = this.route.paramMap.pipe(
    switchMap((x) => {
      const uid = x.get('id');

      return this.solutionService.fetchData(uid as string).pipe(
        tap((data) => {
          this.fileData = `data:${
            (data.solution as PastExamsHubCoreApplicationExamsModelsExamModel)
              .contentType
          };base64,${
            (data.solution as PastExamsHubCoreApplicationExamsModelsExamModel)
              .file
          }`;

          this.isPdfFile =
            data.solution?.fileType === 'Document' ? true : false;
          this.form = this.fb.group({
            comment: [
              data.solution?.soulutionComment ?? '',
              [Validators.required, Validators.minLength(1)],
            ],
          });
        })
      );
    })
  );

  constructor(
    private route: ActivatedRoute,
    private solutionService: SolutionService,
    private sanitizer: DomSanitizer,
    private currentUserService: CurrentUserService,
    private location: Location
  ) {
    super();
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      comment: [''],
    });
  }

  goBack(): void {
    this.location.back();
  }

  bypassAndSanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  minusRating(uid: string, isAlreadyGraded: boolean) {
    this.solutionService.postGrade(uid, false, isAlreadyGraded);
  }

  plusRating(uid: string, isAlreadyGraded: boolean) {
    this.solutionService.postGrade(uid, true, isAlreadyGraded);
  }
}
