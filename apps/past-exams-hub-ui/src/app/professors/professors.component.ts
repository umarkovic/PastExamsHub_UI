import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { ProfessorsService } from './professors.service';
import { ListRange } from '@angular/cdk/collections';
import { TableScrollingViewportComponent } from '../shared/components/table-scrolling-viewport';
import { MatDialog } from '@angular/material/dialog';
import { AddEditProfessorsDialogComponent } from './add-edit-professors-dialog/add-edit-professors-dialog.component';
import { TeachersService } from 'libs/portal/src/api/api';
import { CurrentUserService } from '../shared/services/current-user.service';
@Component({
  selector: 'pastexamshub-professors',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    TableScrollingViewportComponent,
    AddEditProfessorsDialogComponent,
  ],
  providers: [ProfessorsService, TeachersService],
  templateUrl: './professors.component.html',
  styleUrl: './professors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessorsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items = [];
  itemsSlice = [];
  currentUser = this.currentUserService.currentUser;
  dataSource = new MatTableDataSource();
  data$ = this.route.queryParams.pipe(
    switchMap(() => {
      return this.professorsService.fetchData();
    })
  );
  displayedColumns: string[] = ['email', 'fullName', 'subjects', 'action'];

  constructor(
    private route: ActivatedRoute,
    private professorsService: ProfessorsService,
    private dialog: MatDialog,
    private currentUserService: CurrentUserService
  ) {}
  updatePagination(pageIndex: number, pageSize: number) {
    this.professorsService.dataStateChanged = {
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
  }

  updateSlice(range: ListRange) {
    this.itemsSlice = this.items.slice(range.start, range.end);
  }

  addEditProfessor(professorsUid: string) {
    const dialogRef = this.dialog.open(AddEditProfessorsDialogComponent, {
      width: '750px',
      data: professorsUid,
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          email: string;
          firstName: string;
          lastName: string;
          courses: [{ name: string; uid: string }];
          uid?: string;
        }) => {
          if (result) {
            if (result.uid) {
              this.professorsService.editProfessor(result);
            } else {
              this.professorsService.addProfessor(result);
            }
          }
        }
      );
  }
}
