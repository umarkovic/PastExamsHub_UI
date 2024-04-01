import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { AddSolutionService } from './add-solution.service';
import { ExamSolutionService } from 'libs/portal/src/api/api';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pastexamshub-add-solution',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxFileDropModule,
  ],
  providers: [AddSolutionService, ExamSolutionService],
  templateUrl: './add-solution.component.html',
  styleUrl: './add-solution.component.scss',
})
export class AddSolutionComponent extends FormBaseComponent {
  id!: string;
  data$ = this.route.paramMap.pipe(
    tap((x) => {
      this.id = x.get('id') as string;
    })
  );

  isShowNumberTask = true;
  public files: NgxFileDropEntry[] = [];
  public showFile!: boolean;
  urlFile!: string;
  constructor(
    private addSolutionService: AddSolutionService,
    private route: ActivatedRoute
  ) {
    super();

    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      numberTask: [undefined],
      commentSolution: ['', Validators.required],
      fileSource: ['', Validators.required],
    });
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.form.patchValue({
            fileSource: file,
          });
          if (
            file.type === 'application/pdf' ||
            file.type.startsWith('image/')
          ) {
            this.displayFile(file);
            this.showFile = true;
          } else {
            this.showFile = false;
          }
        });
      }
    }
  }
  displayFile(file?: File) {
    if (file) {
      this.urlFile = URL.createObjectURL(file);
    }

    if (this.showFile) {
      window.open(this.urlFile, '_blank');
      this.showFile = false;
    }
  }
  cancel() {}
  save() {
    if (this.checkFormValidity()) {
      return;
    }

    this.addSolutionService.addSolution(this.id, this.form.getRawValue());
  }
}
