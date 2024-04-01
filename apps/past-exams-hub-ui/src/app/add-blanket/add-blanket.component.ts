import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AddBlanketService } from './add-blanket.service';
import {
  CoursesService,
  ExamPeriodsService,
  ExamsService,
} from 'libs/portal/src/api/api';
import {
  NgxFileDropModule,
  NgxFileDropEntry,
  FileSystemFileEntry,
} from 'ngx-file-drop';
import { SafeResourceUrl } from '@angular/platform-browser';

export type PastExamsHubCoreDomainEnumsExamType =
  | 'Unkwnon'
  | 'Pismeni'
  | 'Usmeni'
  | 'PismenoUsmeni';
export const PastExamsHubCoreDomainEnumsExamType = {
  Unkwnon: 'Unkwnon' as PastExamsHubCoreDomainEnumsExamType,
  Pismeni: 'Pismeni' as PastExamsHubCoreDomainEnumsExamType,
  Usmeni: 'Usmeni' as PastExamsHubCoreDomainEnumsExamType,
  PismenoUsmeni: 'PismenoUsmeni' as PastExamsHubCoreDomainEnumsExamType,
};

@Component({
  selector: 'pastexamshub-blanket',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    NgxFileDropModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    AddBlanketService,
    ExamsService,
    ExamPeriodsService,
    CoursesService,
  ],
  templateUrl: './add-blanket.component.html',
  styleUrl: './add-blanket.component.scss',
})
export class AddBlanketComponent extends FormBaseComponent {
  data$ = this.blanketService.fetchData();
  examTypes: { label: string; value: PastExamsHubCoreDomainEnumsExamType }[] =
    [];
  message = '';
  urlFile!: string;
  safeUrl!: SafeResourceUrl;
  public files: NgxFileDropEntry[] = [];
  public imageUrl: string | null = null;
  public showFile!: boolean;

  constructor(private blanketService: AddBlanketService) {
    super();
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      deadline: ['', Validators.required],
      subject: ['', Validators.required],
      type: [''],
      numberTask: [1],
      date: ['', Validators.required],
      fileSource: ['', Validators.required],
      note: [''],
    });
  }

  override ngOnInit() {
    this.examTypes = Object.entries(PastExamsHubCoreDomainEnumsExamType)
      .filter(([, value]) => value !== 'Unkwnon')
      .map(([, value]) => ({
        label: value,
        value: value as PastExamsHubCoreDomainEnumsExamType,
      }));
  }

  transformLabel(label: string): string {
    return label
      .split('')
      .map((char, index) => {
        return char.toUpperCase() === char && index !== 0 ? ` ${char}` : char;
      })
      .join('');
  }

  // uploadFile(files: any) {
  //   if (files.length === 0) {
  //     return;
  //   }
  //   const fileToUpload = files[0] as File;
  //   this.form.patchValue({
  //     fileSource: fileToUpload,
  //   });
  // }

  public dropped(files: NgxFileDropEntry[]) {
    console.log(files);
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

  getFirstErrorMessage(obj: any) {
    const keys = Object.keys(obj);
    if (keys.length > 0) {
      const firstKey = keys[0];
      if (obj[firstKey].length > 0) {
        return obj[firstKey][0];
      }
    }
    return null;
  }

  save() {
    if (this.checkFormValidity()) return;

    this.blanketService.addBlanket(
      this.form.getRawValue(),
      () => {
        this.message = 'Blanket je uspesno dodat!';
      },
      (error) => {
        this.message = 'Greska: ' + this.getFirstErrorMessage(error);
      }
    );
  }
}
