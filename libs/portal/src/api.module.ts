import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
} from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { CoursesService } from './api/courses.service';
import { ExamPeriodsService } from './api/examPeriods.service';
import { ExamSolutionService } from './api/examSolution.service';
import { ExamsService } from './api/exams.service';
import { StatisticsService } from './api/statistics.service';
import { TeachersService } from './api/teachers.service';
import { UsersService } from './api/users.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    CoursesService,
    ExamPeriodsService,
    ExamSolutionService,
    ExamsService,
    StatisticsService,
    TeachersService,
    UsersService,
  ],
})
export class ApiModule {
  public static forRoot(
    configurationFactory: () => Configuration
  ): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  constructor(
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error(
        'ApiModule is already loaded. Import in your base AppModule only.'
      );
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' +
          'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }
}
