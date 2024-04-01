import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { StatisticsService } from 'libs/portal/src/api/statistics.service';
import { ExamsService } from 'libs/portal/src/api/api';
import { TableScrollingViewportComponent } from '../shared/components/table-scrolling-viewport';
import { ListRange } from '@angular/cdk/collections';

@Component({
  selector: 'pastexamshub-home',
  standalone: true,

  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    TableScrollingViewportComponent,
  ],
  providers: [HomeService, StatisticsService, ExamsService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  data$ = this.homeService.fetchData();
  items = [];
  itemsSlice = [];
  private router = inject(Router);

  readonly studyYears = [
    {
      year: 1,
      name: 'I',
    },
    {
      year: 2,
      name: 'II',
    },
    {
      year: 3,
      name: 'III',
    },
    {
      year: 4,
      name: 'IV',
    },
  ];

  constructor(private homeService: HomeService) {}

  navigateToStudyYearCourses(studyYear: number) {
    this.router.navigate(['/predmeti'], {
      queryParams: { godinaStudija: studyYear },
    });
  }

  updateSlice(range: ListRange) {
    this.itemsSlice = this.items.slice(range.start, range.end);
  }

  redirectTo(uid: string) {
    this.router.navigate(['/blanket', uid]);
  }
  redirectToPage(page: string) {
    this.router.navigate([page]);
  }
  


}
