;(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){// Generated by CoffeeScript 1.6.1
(function() {
  var expectArraysEqual;

  require('./efficiency');

  expectArraysEqual = function(a1, a2, accuracy) {
    var diff, i, isItGood, length, _i, _ref, _results;
    if (accuracy == null) {
      accuracy = 0.1;
    }
    expect(a1.length).to.equal(a2.length);
    length = a1.length;
    _results = [];
    for (i = _i = 0, _ref = length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      diff = Math.abs(a1[i] - a2[i]);
      isItGood = diff <= accuracy;
      _results.push(expect(isItGood).to.be.ok());
    }
    return _results;
  };

  describe('efficiency plugin', function() {
    var actual, actualArray, expected, expectedLuma, rgbt;
    it("max & min of array", function() {
      expect(6).to.equal(Math.max.apply(Math, [1, 2, 3, 4, 5, 6]));
      return expect(1).to.equal(Math.min.apply(Math, [1, 2, 3, 4, 5, 6]));
    });
    it("Get gray luma from 4-byte RGBT data. Two values", function() {});
    rgbt = [1, 1, 1, 1, 2, 2, 2, 2];
    expectedLuma = [1.0, 2.0];
    actualArray = window.plugins.efficiency.getGrayLumaFromRGBT(rgbt);
    expected = JSON.stringify(expectedLuma);
    actual = JSON.stringify(actualArray);
    expectArraysEqual(expectedLuma, actualArray);
    it("Get gray luma from 4-byte RGBT data. Three values", function() {});
    rgbt = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
    expectedLuma = [1.0, 2.0, 3.0];
    actualArray = window.plugins.efficiency.getGrayLumaFromRGBT(rgbt);
    expected = JSON.stringify(expectedLuma);
    actual = JSON.stringify(actualArray);
    expectArraysEqual(expectedLuma, actualArray);
    it("calculateStrategy_GrayBinary 50% binary data", function() {
      var lumas, output;
      lumas = [0, 0, 255, 255];
      output = window.plugins.efficiency.calculateStrategy_GrayBinary(lumas);
      return expect('50.0').to.equal(output.toFixed(1));
    });
    it("calculateStrategy_GrayBinary 50% linear data", function() {
      var lumas, output;
      lumas = [1, 2, 3, 4];
      output = window.plugins.efficiency.calculateStrategy_GrayBinary(lumas);
      return expect('50.0').to.equal(output.toFixed(1));
    });
    it("calculateStrategy_GrayBinary 75% binary data", function() {
      var lumas, output;
      lumas = [0, 255, 255, 255];
      output = window.plugins.efficiency.calculateStrategy_GrayBinary(lumas);
      return expect('75.0').to.equal(output.toFixed(1));
    });
    it("calculateStrategy_GrayIterativeClustering 50% binary data", function() {
      var lumas, output;
      lumas = [0, 0, 255, 255];
      output = window.plugins.efficiency.calculateStrategy_GrayIterativeClustering(lumas);
      return expect('50.0').to.equal(output.toFixed(1));
    });
    it("calculateStrategy_GrayIterativeClustering 50% linear data", function() {
      var lumas, output;
      lumas = [1, 2, 3, 4];
      output = window.plugins.efficiency.calculateStrategy_GrayIterativeClustering(lumas);
      return expect('50.0').to.equal(output.toFixed(1));
    });
    return it("calculateStrategy_GrayIterativeClustering 75% binary data", function() {
      var lumas, output;
      lumas = [0, 255, 255, 255];
      output = window.plugins.efficiency.calculateStrategy_GrayIterativeClustering(lumas);
      return expect('75.0').to.equal(output.toFixed(1));
    });
  });

}).call(this);

},{"./efficiency":2}],3:[function(require,module,exports){// Generated by CoffeeScript 1.6.1
(function() {
  var report;

  report = require('./report');

  describe('report plugin', function() {
    describe('parsing', function() {
      it('returns an array', function() {
        var schedule;
        schedule = report.parse("");
        return expect(schedule).to.eql([]);
      });
      it('parses intervals', function() {
        var issue;
        issue = report.parse("DAILY ward@example.com")[0];
        return expect(issue.interval).to.be('DAILY');
      });
      it('parses offsets', function() {
        var issue;
        issue = report.parse("WEEKLY TUESDAY NOON")[0];
        return expect(issue.offsets).to.eql(['TUESDAY', 'NOON']);
      });
      it('parses recipients', function() {
        var issue;
        issue = report.parse("DAILY ward@c2.com root@c2.com")[0];
        return expect(issue.recipients).to.eql(['ward@c2.com', 'root@c2.com']);
      });
      return it('parses multiple issues', function() {
        var schedule;
        schedule = report.parse("WEEKLY MONTHLY YEARLY");
        return expect(schedule).to.have.length(3);
      });
    });
    return describe('advancing', function() {
      it('handles weeks', function() {
        var count, date, issue;
        issue = report.parse("WEEKLY")[0];
        date = new Date(2012, 12 - 1, 25, 3, 4, 5);
        count = function(i) {
          return report.advance(date, issue, i).toString();
        };
        expect(count(-1)).to.contain("Sun Dec 16 2012 00:00:00");
        expect(count(0)).to.contain("Sun Dec 23 2012 00:00:00");
        expect(count(1)).to.contain("Sun Dec 30 2012 00:00:00");
        return expect(count(2)).to.contain("Sun Jan 06 2013 00:00:00");
      });
      it('handles weeks with offsets (noon > now)', function() {
        var count, date, issue;
        issue = report.parse("WEEKLY TUESDAY NOON")[0];
        date = new Date(2012, 12 - 1, 25, 3, 4, 5);
        count = function(i) {
          return report.advance(date, issue, i).toString();
        };
        expect(count(-1)).to.contain("Tue Dec 11 2012 12:00:00");
        expect(count(0)).to.contain("Tue Dec 18 2012 12:00:00");
        expect(count(1)).to.contain("Tue Dec 25 2012 12:00:00");
        return expect(count(2)).to.contain("Tue Jan 01 2013 12:00:00");
      });
      it('handles years with offsets (march < now)', function() {
        var count, date, issue;
        issue = report.parse("YEARLY MARCH FRIDAY EVENING")[0];
        date = new Date(2012, 12 - 1, 25, 3, 4, 5);
        count = function(i) {
          return report.advance(date, issue, i).toString();
        };
        expect(count(-1)).to.contain("Fri Mar 04 2011 18:00:00");
        expect(count(0)).to.contain("Fri Mar 02 2012 18:00:00");
        expect(count(1)).to.contain("Fri Mar 01 2013 18:00:00");
        return expect(count(2)).to.contain("Fri Mar 07 2014 18:00:00");
      });
      return it('handles election day (election > now)', function() {
        var count, date, issue;
        issue = report.parse("YEARLY NOVEMBER MONDAY TUESDAY MORNING")[0];
        date = new Date(2016, 1, 2, 3, 4, 5);
        count = function(i) {
          return report.advance(date, issue, i).toString();
        };
        expect(count(-1)).to.contain("Tue Nov 04 2014 06:00:00");
        expect(count(0)).to.contain("Tue Nov 03 2015 06:00:00");
        expect(count(1)).to.contain("Tue Nov 08 2016 06:00:00");
        return expect(count(2)).to.contain("Tue Nov 07 2017 06:00:00");
      });
    });
  });

}).call(this);

},{"./report":4}],5:[function(require,module,exports){// Generated by CoffeeScript 1.6.1
(function() {

  mocha.setup('bdd');

  window.wiki = require('./lib/wiki.coffee');

  require('./test/util.coffee');

  require('./test/active.coffee');

  require('./test/pageHandler.coffee');

  require('./test/refresh.coffee');

  require('./test/plugin.coffee');

  require('./test/revision.coffee');

  require('./test/neighborhood.coffee');

  require('./test/search.coffee');

  $(function() {
    $('<hr><h2> Testing artifacts:</h2>').appendTo('body');
    return mocha.run();
  });

}).call(this);

},{"./lib/wiki.coffee":6,"./test/util.coffee":7,"./test/active.coffee":8,"./test/pageHandler.coffee":9,"./test/refresh.coffee":10,"./test/plugin.coffee":11,"./test/revision.coffee":12,"./test/neighborhood.coffee":13,"./test/search.coffee":14}],15:[function(require,module,exports){// Generated by CoffeeScript 1.6.1
(function() {
  var txtzyme;

  txtzyme = require('./txtzyme');

  console.log(txtzyme);

  describe('txtzyme plugin', function() {
    describe('parsing', function() {
      it('recognizes definitions', function() {
        return expect(txtzyme.parse("SECOND 1o500m0o")).to.eql({
          SECOND: ['1o500m0o']
        });
      });
      it('handles empty definitions', function() {
        return expect(txtzyme.parse("SECOND")).to.eql({
          SECOND: []
        });
      });
      it('recognizes multiple definitions', function() {
        return expect(txtzyme.parse("SECOND BLINK BLINK\nBLINK 1o500m0o500m")).to.eql({
          SECOND: ['BLINK', 'BLINK'],
          BLINK: ['1o500m0o500m']
        });
      });
      it('ignores blank line separator', function() {
        return expect(txtzyme.parse("SECOND BLINK BLINK\n\nBLINK 1o500m0o500m")).to.eql({
          SECOND: ['BLINK', 'BLINK'],
          BLINK: ['1o500m0o500m']
        });
      });
      return it('treates indented lines as continuations', function() {
        return expect(txtzyme.parse("SECOND BLINK\n BLINK\n\nBLINK\n 1o500m0o500m")).to.eql({
          SECOND: ['BLINK', 'BLINK'],
          BLINK: ['1o500m0o500m']
        });
      });
    });
    return describe('applying', function() {
      var apply;
      apply = function(text, arg) {
        var defn, result;
        result = "";
        defn = txtzyme.parse(text);
        txtzyme.apply(defn, 'TEST', arg, function(message, stack, done) {
          result += message;
          return done();
        });
        return result;
      };
      it('recognizes definitions', function() {
        return expect(apply("TEST 1o")).to.eql("1o\n");
      });
      it('calls definitions', function() {
        return expect(apply("TEST FOO\nFOO 0o")).to.eql("0o\n");
      });
      it('merges results', function() {
        return expect(apply("TEST 1o FOO 0o\nFOO 10m")).to.eql("1o 10m 0o\n");
      });
      it('limits call depth', function() {
        return expect(apply("TEST o TEST")).to.eql("o o o o o o o o o o\n");
      });
      it('handles empty definitions', function() {
        return expect(apply("TEST")).to.eql("");
      });
      it('handles missing definitions', function() {
        return expect(apply("TEST FOO")).to.eql("");
      });
      it('recognizes NL as newline', function() {
        return expect(apply("TEST 100m NL 200m")).to.eql("100m\n200m\n");
      });
      it('recognizes A as argument', function() {
        return expect(apply("TEST A", 123)).to.eql("123\n");
      });
      it('recognizes A0, A1, A2 as accessor', function() {
        return expect(apply("TEST _ A1 A0 _", ['zero', 'one'])).to.eql("_ one zero _\n");
      });
      it('recognizes B0, B1 as accessor', function() {
        return expect(apply("TEST B4 B3 B2 B1 B0", 6)).to.eql("0 0 1 1 0\n");
      });
      it('recognizes C0, C1, C2 as accessor', function() {
        return expect(apply("TEST C0 C1 C2 C3", 'ABC')).to.eql("65 66 67 32\n");
      });
      it('recognizes D0, D1, D2 as accessor', function() {
        return expect(apply("TEST D3 D2 D1 D0", 123)).to.eql("48 49 50 51\n");
      });
      it('recognizes numeric parameter', function() {
        return expect(apply("TEST IT/25\nIT A", 123)).to.eql("25\n");
      });
      return it('recognizes accessor as parameter', function() {
        return expect(apply("TEST IT/A1\nIT A", [123, 456])).to.eql("456\n");
      });
    });
  });

}).call(this);

},{"./txtzyme":16}],17:[function(require,module,exports){// Generated by CoffeeScript 1.6.1
(function() {
  var createFakeLocalStorage, pluginCtor;

  pluginCtor = require('./changes');

  createFakeLocalStorage = function(initialContents) {
    var fake, getStoreSize, keys, store;
    if (initialContents == null) {
      initialContents = {};
    }
    store = initialContents;
    keys = function() {
      var k, _, _results;
      _results = [];
      for (k in store) {
        _ = store[k];
        _results.push(k);
      }
      return _results;
    };
    getStoreSize = function() {
      return keys().length;
    };
    fake = {
      setItem: function(k, v) {
        return store[k] = v;
      },
      getItem: function(k) {
        return store[k];
      },
      key: function(i) {
        return keys()[i];
      },
      removeItem: function(k) {
        return delete store[k];
      }
    };
    Object.defineProperty(fake, 'length', {
      get: getStoreSize
    });
    return fake;
  };

  describe('changes plugin', function() {
    var $div, clickDeleteForPageWithSlug, expectNumberOfPagesToBe, fakeLocalStore, installPlugin, makePlugin;
    fakeLocalStore = void 0;
    $div = void 0;
    beforeEach(function() {
      $div = $('<div/>');
      return fakeLocalStore = createFakeLocalStorage();
    });
    makePlugin = function() {
      return pluginCtor($, {
        localStorage: fakeLocalStore
      });
    };
    installPlugin = function() {
      var plugin;
      plugin = makePlugin();
      plugin.emit($div, {});
      return plugin.bind($div, {});
    };
    expectNumberOfPagesToBe = function(expectedLength) {
      return expect($div.find('li a').length).to.be(expectedLength);
    };
    clickDeleteForPageWithSlug = function(slug) {
      return $div.find("li a[data-page-name='" + slug + "']").siblings('button').trigger('click');
    };
    it("renders 'empty' when there are no local changes", function() {
      installPlugin();
      expect($div.html()).to.contain('empty');
      return expectNumberOfPagesToBe(0);
    });
    return describe('some pages in local store', function() {
      beforeEach(function() {
        return fakeLocalStore = createFakeLocalStorage({
          page1: JSON.stringify({
            title: "A Page"
          }),
          page2: JSON.stringify({
            title: "Another Page"
          }),
          page3: JSON.stringify({
            title: "Page the Third"
          })
        });
      });
      it("doesn't render 'empty'", function() {
        installPlugin();
        return expect($div.html()).not.to.contain('empty');
      });
      it("lists each page found in the local store", function() {
        var allTitles;
        installPlugin();
        expectNumberOfPagesToBe(3);
        allTitles = $div.find('li a').map(function(_, a) {
          return $(a).html();
        }).toArray().join('');
        expect(allTitles).to.contain('A Page');
        expect(allTitles).to.contain('Another Page');
        return expect(allTitles).to.contain('Page the Third');
      });
      it("removes a page from local store", function() {
        installPlugin();
        expect(fakeLocalStore.getItem('page2')).to.be.ok();
        clickDeleteForPageWithSlug('page2');
        return expect(fakeLocalStore.getItem('page2')).not.to.be.ok();
      });
      return it("updates the plugin div when a page is removed", function() {
        installPlugin();
        expectNumberOfPagesToBe(3);
        clickDeleteForPageWithSlug('page2');
        return expectNumberOfPagesToBe(2);
      });
    });
  });

}).call(this);

},{"./changes":18}],19:[function(require,module,exports){// Generated by CoffeeScript 1.6.1
(function() {
  var report;

  report = require('./calendar');

  describe('calendar plugin', function() {
    describe('parsing', function() {
      it('recognizes decades', function() {
        expect(report.parse("1960 DECADE")).to.eql([
          {
            year: 1960,
            span: 'DECADE'
          }
        ]);
        expect(report.parse("DECADE 1960")).to.eql([
          {
            year: 1960,
            span: 'DECADE'
          }
        ]);
        return expect(report.parse("60S")).to.eql([
          {
            year: 1960,
            span: 'DECADE'
          }
        ]);
      });
      it('recognizes half decades', function() {
        expect(report.parse("60S EARLY")).to.eql([
          {
            year: 1960,
            span: 'EARLY'
          }
        ]);
        expect(report.parse("EARLY 60S")).to.eql([
          {
            year: 1960,
            span: 'EARLY'
          }
        ]);
        return expect(report.parse("LATE 60S")).to.eql([
          {
            year: 1960,
            span: 'LATE'
          }
        ]);
      });
      it('recognizes years', function() {
        return expect(report.parse("1960")).to.eql([
          {
            year: 1960,
            span: 'YEAR'
          }
        ]);
      });
      it('recognizes months', function() {
        expect(report.parse("1960 MAR")).to.eql([
          {
            year: 1960,
            month: 3,
            span: 'MONTH'
          }
        ]);
        expect(report.parse("MAR 1960")).to.eql([
          {
            year: 1960,
            month: 3,
            span: 'MONTH'
          }
        ]);
        return expect(report.parse("MARCH 1960")).to.eql([
          {
            year: 1960,
            month: 3,
            span: 'MONTH'
          }
        ]);
      });
      it('recognizes days', function() {
        expect(report.parse("MAR 5 1960")).to.eql([
          {
            year: 1960,
            month: 3,
            day: 5,
            span: 'DAY'
          }
        ]);
        expect(report.parse("1960 MAR 5")).to.eql([
          {
            year: 1960,
            month: 3,
            day: 5,
            span: 'DAY'
          }
        ]);
        return expect(report.parse("5 MAR 1960")).to.eql([
          {
            year: 1960,
            month: 3,
            day: 5,
            span: 'DAY'
          }
        ]);
      });
      return it('recognizes labels', function() {
        expect(report.parse("Ward's CHM Interview")).to.eql([
          {
            label: "Ward's CHM Interview"
          }
        ]);
        expect(report.parse("APRIL 24 2006 Ward's CHM Interview")).to.eql([
          {
            year: 2006,
            month: 4,
            day: 24,
            span: 'DAY',
            label: "Ward's CHM Interview"
          }
        ]);
        return expect(report.parse(" APRIL  24  2006\tWard's  CHM  Interview  ")).to.eql([
          {
            year: 2006,
            month: 4,
            day: 24,
            span: 'DAY',
            label: "Ward's CHM Interview"
          }
        ]);
      });
    });
    return describe('applying', function() {
      var interview, today;
      today = new Date(2013, 2 - 1, 3);
      interview = new Date(2006, 4 - 1, 24);
      it('recalls input', function() {
        var input, output, rows;
        input = {
          interview: {
            date: interview
          }
        };
        output = {};
        rows = report.parse("interview");
        return expect(report.apply(input, output, today, rows)).to.eql([
          {
            date: interview,
            label: 'interview'
          }
        ]);
      });
      return it('extends today', function() {
        var input, output, results, rows;
        input = {};
        output = {};
        rows = report.parse("APRIL 1 April Fools Day");
        results = report.apply(input, output, today, rows);
        expect(results).to.eql([
          {
            date: new Date(2013, 4 - 1),
            month: 4,
            day: 1,
            span: 'DAY',
            label: 'April Fools Day'
          }
        ]);
        return expect(output).to.eql({
          'April Fools Day': {
            date: new Date(2013, 4 - 1),
            span: 'DAY'
          }
        });
      });
    });
  });

}).call(this);

},{"./calendar":20}],2:[function(require,module,exports){
},{}]