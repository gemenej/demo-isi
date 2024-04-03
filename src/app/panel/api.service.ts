import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  protected apiUrl: string = this.cs.get('apiUrl');

  constructor(public cs: ConfigService) {
    this.refresh();
  }

  refresh() {
    const apiDemoUcgUrl = `${this.cs.get('apiUrl')}`;
    this.setApiDemoUcgUrl(apiDemoUcgUrl);
  }

  setApiDemoUcgUrl(apiDemoUcgUrl: string) {
    return (this.apiUrl = apiDemoUcgUrl);
  }

  get apiDemoUcgUrl() {
    return this.apiUrl;
  }
}
