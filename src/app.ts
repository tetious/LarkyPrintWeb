import { RouterConfiguration, Router } from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'LarkyPrint';
    config.map([
      { route: '', name: 'home', moduleId: 'home/index' },
      { route: 'configuration/wifi', name: 'wifi', moduleId: 'configuration/wifi' },
    ]);
  }
}
