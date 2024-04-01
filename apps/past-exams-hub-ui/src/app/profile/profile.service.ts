import { Injectable } from '@angular/core';
import {
  PastExamsHubCoreDomainEnumsGenderType,
  TeachersService,
  UsersService,
} from '@org/portal/data-access';

@Injectable()
export class ProfileService {
  constructor(
    private usersService: UsersService,
    private teachersService: TeachersService
  ) {}

  fetchDataStudent(uid: string) {
    return this.usersService.usersUidGet(uid);
  }

  fetchDataProfessor(uid: string) {
    return this.teachersService.teachersUidGet(uid);
  }

  editProfile(currentUser: any, data: any) {
    if (currentUser.role === 'Student') {
      this.usersService
        .usersUidPut(currentUser.sub, {
          firstName: data.firstName,
          lastName: data.lastName,
          index: data.index,
          studyYear: data.yearOfStudy,
          gender: data.gender as PastExamsHubCoreDomainEnumsGenderType,
        })
        .subscribe();
    } else {
      this.teachersService
        .teachersUidPut(currentUser.sub, {
          firstName: data.firstName,
          gender: data.gender,
          lastName: data.lastName,
        })
        .subscribe();
    }
  }
}
