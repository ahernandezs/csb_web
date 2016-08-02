// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    'plugins' : [
        'karma-mocha',
        'karma-chai',
        'karma-sinon',
        'karma-phantomjs-launcher',
        'karma-coverage'
    ],
    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha','chai','sinon'],

    // list of files / patterns to load in the browser
    files: [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/jquery/jquery.js',
        'app/bower_components/angular-cookies/angular-cookies.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/bower_components/angular-sanitize/angular-sanitize.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
        'app/bower_components/ng-table/ng-table.js',
        'app/bower_components/angular-ui-router/release/angular-ui-router.js',
        'http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false',
        'app/bower_components/lodash/dist/lodash.compat.js',
        'app/bower_components/angular-google-maps/dist/angular-google-maps.js',
        'app/bower_components/ng-scrollbars/src/scrollbars.js',
        'app/bower_components/ng-dialog/js/ngDialog.js',
        'app/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
        'app/scripts/*.js',
        'app/scripts/controllers/**/*.js',
        'app/scripts/directives/**/*.js',
        'app/scripts/filters/**/*.js',
        'app/scripts/services/**/*.js',
        'app/scripts/infrastructure/**/*.js',
        'app/scripts/scroller/**/*.js',
        'app/scripts/controllers/mainController.js',
        'app/scripts/controllers/dashboard.js',
        'app/scripts/controllers/portfolio.js',
        'app/scripts/controllers/investmentControllers/investmentCedePrlvController.js',
        'app/scripts/controllers/investmentControllers/purchaseRetireVistaController.js',
        'test/mock/**/*.js',
        'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/scripts/*.js': ['coverage'],
      'app/scripts/controllers/**/*.js': ['coverage'],
      'app/scripts/directives/**/*.js': ['coverage'],
      'app/scripts/services/**/*.js': ['coverage']

    },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
