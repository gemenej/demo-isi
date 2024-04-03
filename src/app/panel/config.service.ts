import { Inject, Injectable } from '@angular/core';
import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken('Application config');

export interface Config {
  production: boolean;
  apiUrl: string;
  projectName: 'demo-isi';
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    @Inject(APP_CONFIG)
    protected readonly config: Config,
  ) {}

  get<ConfigKeyType extends keyof Config>(key: ConfigKeyType) {
    return this.config[key];
  }
}
