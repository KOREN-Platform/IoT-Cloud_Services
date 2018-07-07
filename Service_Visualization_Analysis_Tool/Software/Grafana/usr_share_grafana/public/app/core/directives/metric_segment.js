define([
  'lodash',
  'jquery',
  '../core_module',
],
function (_, $, coreModule) {
  'use strict';

  coreModule.default.directive('metricSegment', function($compile, $sce) {
    var inputTemplate = '<input type="text" data-provide="typeahead" ' +
      ' class="gf-form-input input-medium"' +
      ' spellcheck="false" style="display:none"></input>';

    var linkTemplate = '<a class="gf-form-label" ng-class="segment.cssClass" ' +
      'tabindex="1" give-focus="segment.focus" ng-bind-html="segment.html"></a>';

    var selectTemplate = '<a class="gf-form-input gf-form-input--dropdown" ng-class="segment.cssClass" ' +
      'tabindex="1" give-focus="segment.focus" ng-bind-html="segment.html"></a>';

    return {
      scope: {
        segment: "=",
        getOptions: "&",
        onChange: "&",
      },
      link: function($scope, elem) {
        var $input = $(inputTemplate);
        var segment = $scope.segment;
        var $button = $(segment.selectMode ? selectTemplate : linkTemplate);
        var options = null;
        var cancelBlur = null;
        var linkMode = true;

        $input.appendTo(elem);
        $button.appendTo(elem);

        $scope.updateVariableValue = function(value) {
          if (value === '' || segment.value === value) {
            return;
          }

          $scope.$apply(function() {
            var selected = _.find($scope.altSegments, {value: value});
            if (selected) {
              segment.value = selected.value;
              segment.html = selected.html || selected.value;
              segment.fake = false;
              segment.expandable = selected.expandable;
            }
            else if (segment.custom !== 'false') {
              segment.value = value;
              segment.html = $sce.trustAsHtml(value);
              segment.expandable = true;
              segment.fake = false;
            }

            $scope.onChange();
          });
        };

        $scope.switchToLink = function(fromClick) {
          if (linkMode && !fromClick) { return; }

          clearTimeout(cancelBlur);
          cancelBlur = null;
          linkMode = true;
          $input.hide();
          $button.show();
          $scope.updateVariableValue($input.val());
        };

        $scope.inputBlur = function() {
          // happens long before the click event on the typeahead options
          // need to have long delay because the blur
          cancelBlur = setTimeout($scope.switchToLink, 200);
        };

        $scope.source = function(query, callback) {
          $scope.$apply(function() {
            $scope.getOptions({ $query: query }).then(function(altSegments) {
              $scope.altSegments = altSegments;
              options = _.map($scope.altSegments, function(alt) {
                return _.escape(alt.value);
              });

              // add custom values
              if (segment.custom !== 'false') {
                if (!segment.fake && _.indexOf(options, segment.value) === -1) {
                  options.unshift(segment.value);
                }
              }

              callback(options);
            });
          });
        };

        $scope.updater = function(value) {
          if (value === segment.value) {
            clearTimeout(cancelBlur);
            $input.focus();
            return value;
          }

          $input.val(value);
          $scope.switchToLink(true);

          return value;
        };

        $scope.matcher = function(item) {
          var str = this.query;
          if (str[0] === '/') { str = str.substring(1); }
          if (str[str.length - 1] === '/') { str = str.substring(0, str.length-1); }
          try {
            return item.toLowerCase().match(str.toLowerCase());
          } catch(e) {
            return false;
          }
        };

        $input.attr('data-provide', 'typeahead');
        $input.typeahead({ source: $scope.source, minLength: 0, items: 10000, updater: $scope.updater, matcher: $scope.matcher });

        var typeahead = $input.data('typeahead');
        typeahead.lookup = function () {
          this.query = this.$element.val() || '';
          var items = this.source(this.query, $.proxy(this.process, this));
          return items ? this.process(items) : items;
        };

        $button.keydown(function(evt) {
          // trigger typeahead on down arrow or enter key
          if (evt.keyCode === 40 || evt.keyCode === 13) {
            $button.click();
          }
        });

        $button.click(function() {
          options = null;
          $input.css('width', (Math.max($button.width(), 80) + 16) + 'px');

          $button.hide();
          $input.show();
          $input.focus();

          linkMode = false;

          var typeahead = $input.data('typeahead');
          if (typeahead) {
            $input.val('');
            typeahead.lookup();
          }
        });

        $input.blur($scope.inputBlur);

        $compile(elem.contents())($scope);
      }
    };
  });

  coreModule.default.directive('metricSegmentModel', function(uiSegmentSrv, $q) {
    return {
      template: '<metric-segment segment="segment" get-options="getOptionsInternal()" on-change="onSegmentChange()"></metric-segment>',
      restrict: 'E',
      scope: {
        property: "=",
        options: "=",
        getOptions: "&",
        onChange: "&",
      },
      link: {
        pre: function postLink($scope, elem, attrs) {
          var cachedOptions;

          $scope.valueToSegment = function(value) {
            var option = _.find($scope.options, {value: value});
            var segment = {
              cssClass: attrs.cssClass,
              custom: attrs.custom,
              value: option ? option.text : value,
              selectMode: attrs.selectMode,
            };

            return uiSegmentSrv.newSegment(segment);
          };

          $scope.getOptionsInternal = function() {
            if ($scope.options) {
              cachedOptions = $scope.options;
              return $q.when(_.map($scope.options, function(option) {
                return {value: option.text};
              }));
            } else {
              return $scope.getOptions().then(function(options) {
                cachedOptions = options;
                return  _.map(options, function(option) {
                  if (option.html) {
                    return option;
                  }
                  return {value: option.text};
                });
              });
            }
          };

          $scope.onSegmentChange = function() {
            if (cachedOptions) {
              var option = _.find(cachedOptions, {text: $scope.segment.value});
              if (option && option.value !== $scope.property) {
                $scope.property = option.value;
              } else if (attrs.custom !== 'false') {
                $scope.property = $scope.segment.value;
              }
            } else {
              $scope.property = $scope.segment.value;
            }

            // needs to call this after digest so
            // property is synced with outerscope
            $scope.$$postDigest(function() {
              $scope.$apply(function() {
                $scope.onChange();
              });
            });
          };

          $scope.segment = $scope.valueToSegment($scope.property);
        }
      }
    };
  });
});
