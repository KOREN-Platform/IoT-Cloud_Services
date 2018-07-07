import System from 'systemjs/dist/system.js';
import _ from 'lodash';
import * as sdk from 'app/plugins/sdk';
import kbn from 'app/core/utils/kbn';
import moment from 'moment';
import angular from 'angular';
import jquery from 'jquery';
import config from 'app/core/config';
import TimeSeries from 'app/core/time_series2';
import TableModel from 'app/core/table_model';
import {coreModule, appEvents, contextSrv} from 'app/core/core';
import * as datemath from 'app/core/utils/datemath';
import * as fileExport from 'app/core/utils/file_export';
import * as flatten from 'app/core/utils/flatten';
import * as ticks from 'app/core/utils/ticks';
import builtInPlugins from './buit_in_plugins';
import d3 from 'vendor/d3/d3';

// rxjs
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

// these imports add functions to Observable
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineAll';

System.config({
  baseURL: 'public',
  defaultExtension: 'js',
  packages: {
    'plugins': {
      defaultExtension: 'js'
    }
  },
  map: {
    text: 'vendor/plugin-text/text.js',
    css: 'vendor/plugin-css/css.js'
  },
});

// add cache busting
var systemLocate = System.locate;
System.cacheBust = '?bust=' + Date.now();
System.locate = function(load) {
  var System = this;
  return Promise.resolve(systemLocate.call(this, load)).then(function(address) {
    return address + System.cacheBust;
  });
};

function exposeToPlugin(name: string, component: any) {
  System.registerDynamic(name, [], true, function(require, exports, module) {
    module.exports = component;
  });
}

exposeToPlugin('lodash', _);
exposeToPlugin('moment', moment);
exposeToPlugin('jquery', jquery);
exposeToPlugin('angular', angular);
exposeToPlugin('rxjs/Subject', Subject);
exposeToPlugin('rxjs/Observable', Observable);
exposeToPlugin('d3', d3);

exposeToPlugin('app/plugins/sdk', sdk);
exposeToPlugin('app/core/utils/datemath', datemath);
exposeToPlugin('app/core/utils/file_export', fileExport);
exposeToPlugin('app/core/utils/flatten', flatten);
exposeToPlugin('app/core/utils/kbn', kbn);
exposeToPlugin('app/core/utils/ticks', ticks);

exposeToPlugin('app/core/config', config);
exposeToPlugin('app/core/time_series', TimeSeries);
exposeToPlugin('app/core/time_series2', TimeSeries);
exposeToPlugin('app/core/table_model', TableModel);
exposeToPlugin('app/core/app_events', appEvents);
exposeToPlugin('app/core/core_module', coreModule);
exposeToPlugin('app/core/core', {
  coreModule: coreModule,
  appEvents: appEvents,
  contextSrv: contextSrv,
  __esModule: true
});

import 'vendor/flot/jquery.flot';
import 'vendor/flot/jquery.flot.selection';
import 'vendor/flot/jquery.flot.time';
import 'vendor/flot/jquery.flot.stack';
import 'vendor/flot/jquery.flot.pie';
import 'vendor/flot/jquery.flot.stackpercent';
import 'vendor/flot/jquery.flot.fillbelow';
import 'vendor/flot/jquery.flot.crosshair';
import 'vendor/flot/jquery.flot.dashes';

const flotDeps = [
  'jquery.flot', 'jquery.flot.pie', 'jquery.flot.time', 'jquery.flot.fillbelow', 'jquery.flot.crosshair',
  'jquery.flot.stack', 'jquery.flot.selection', 'jquery.flot.stackpercent', 'jquery.flot.events'
];
for (let flotDep of flotDeps) {
  exposeToPlugin(flotDep, {fakeDep: 1});
}

export function importPluginModule(path: string): Promise<any> {
  let builtIn = builtInPlugins[path];
  if (builtIn) {
    return Promise.resolve(builtIn);
  }
  return System.import(path);
}

export function loadPluginCss(options) {
  if (config.bootData.user.lightTheme) {
    System.import(options.light + '!css');
  } else {
    System.import(options.dark + '!css');
  }
}

