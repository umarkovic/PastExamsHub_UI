import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ExamSolutionService } from '@org/portal/data-access';

@Injectable()
export class AddSolutionService {
  private router = inject(Router);
  constructor(private examSolutionService: ExamSolutionService) {}

  addSolution(
    examUid: string,
    data: {
      numberTask: number | undefined;
      commentSolution: string;
      fileSource: File;
    }
  ) {
    this.examSolutionService
      .examSolutionUploadPostForm(
        data.fileSource,
        examUid,
        data.commentSolution,
        data.numberTask
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/blanket', examUid]);
        },
      });
  }
}
