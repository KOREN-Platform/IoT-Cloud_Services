///<reference path="../../../headers/common.d.ts" />

export class GraphiteConfigCtrl {
  static templateUrl = 'public/app/plugins/datasource/graphite/partials/config.html';
  current: any;

  /** @ngInject */
  constructor($scope) {
    this.current.jsonData = this.current.jsonData || {};
    this.current.jsonData.graphiteVersion = this.current.jsonData.graphiteVersion || '0.9';
  }

  graphiteVersions = [
    {name: '0.9.x', value: '0.9'},
    {name: '1.0.x', value: '1.0'},
    {name: '1.1.x', value: '1.1'},
  ];
}

