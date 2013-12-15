/*!
 * Casper is a navigation utility for PhantomJS.
 *
 * Documentation: http://casperjs.org/
 * Repository:    http://github.com/n1k0/casperjs
 *
 * Copyright (c) 2011-2012 Nicolas Perriault
 *
 * Part of source code is Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*global CasperError, console, exports, phantom, patchRequire, require:true*/

var require = patchRequire(require);
var utils = require('utils');
var fs = require('fs');
var TestSuiteResult = require('tester').TestSuiteResult;



/**
 * Creates a HtmlExporter instance
 *
 * @return HtmlExporter
 */
exports.create = function create() {
    "use strict";
    return new HTMLExporter();
};

/**
 * HTML exporter for test results.
 *
 */
function HTMLExporter() {
    "use strict";
    var startHTML = '<html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8"/><title>CasperJs Test Suite</title><style><style type="text/css"> body{margin:0;padding:0;position:relative;padding-top:75px}#tester{float:left;font-family:Georgia,serif;line-height:26px;width:100%}#tester .statistics{float:left;width:100%;margin-bottom:15px}#tester .statistics p{text-align:right;padding:5px 15px;margin:0;border-right:10px solid #000}#tester .statistics.failed p{border-color:#C20000}#tester .statistics.passed p{border-color:#3D7700}#tester .feature{margin:15px}#tester h2,#tester h3,#tester h4{margin:0 0 5px;padding:0;font-family:Georgia}#tester h2 .title,#tester h3 .title,#tester h4 .title{font-weight:400}#tester .path{font-size:10px;font-weight:400;font-family:"Bitstream Vera Sans Mono","DejaVu Sans Mono",Monaco,Courier,monospace!important;color:#999;padding:0 5px;float:right}#tester .path a:link,#tester .path a:visited{color:#999}#tester .path a:active,#tester .path a:hover{background-color:#000;color:#fff}#tester h3 .path{margin-right:4%}#tester ul.tags{font-size:14px;font-weight:700;color:#246AC1;list-style:none;margin:0;padding:0}#tester ul.tags li{display:inline}#tester ul.tags li:after{content:" "}#tester ul.tags li:last-child:after{content:""}#tester .feature>p{margin-top:0;margin-left:20px}#tester .scenario{margin-left:20px;margin-bottom:20px}#tester .scenario .examples>ol,#tester .scenario>ol{margin:0;list-style:none;padding:0}#tester .scenario>ol{margin-left:20px}#tester .scenario .examples>ol:after,#tester .scenario>ol:after{content:"";display:block;clear:both}#tester .scenario .examples>ol li,#tester .scenario>ol li{float:left;width:95%;padding-left:5px;margin-bottom:4px}#tester .scenario .examples>ol li .argument,#tester .scenario>ol li .argument{margin:10px 20px;font-size:16px;overflow:hidden}#tester .scenario .examples>ol li table.argument,#tester .scenario>ol li table.argument{border:1px solid #d2d2d2}#tester .scenario .examples>ol li table.argument thead td,#tester .scenario>ol li table.argument thead td{font-weight:700}#tester .scenario .examples>ol li table.argument td,#tester .scenario>ol li table.argument td{padding:5px 10px;background:#f3f3f3}#tester .scenario .examples>ol li .keyword,#tester .scenario>ol li .keyword{font-weight:700}#tester .scenario .examples>ol li .path,#tester .scenario>ol li .path{float:right}#tester .scenario .examples{margin-top:20px;margin-left:40px}#tester .scenario .examples h4 span{font-weight:400;background:#f3f3f3;color:#999;padding:0 5px;margin-left:10px}#tester .scenario .examples table{margin-left:20px}#tester .scenario .examples table thead td{font-weight:700;text-align:center}#tester .scenario .examples table td{padding:2px 10px;font-size:16px}#tester .scenario .examples table .failed.exception td{border-left:5px solid #000;border-color:#C20000!important;padding-left:0}pre{font-family:monospace}.snippet{font-size:14px;color:#000;margin-left:20px}.backtrace{font-size:12px;line-height:18px;color:#000;overflow:hidden;margin-left:20px;padding:15px;border-left:2px solid #C20000;background:#fff;margin-right:15px}#tester .passed{background:#DBFFB4;border-color:#65C400!important;color:#3D7700}#tester .failed{background:#FFFBD3;border-color:#C20000!important;color:#C20000}#tester .pending,#tester .undefined{border-color:#FAF834!important;background:#FCFB98;color:#000}#tester .skipped{background:#e0ffff;border-color:#0ff!important;color:#000}#tester .summary{top:0;left:0;width:100%;font-family:Arial,sans-serif;font-size:14px;line-height:18px}#tester .summary .counters{padding:10px;height:52px;overflow:hidden}#tester .summary .switchers{position:absolute;right:15px;top:25px}#tester .summary .switcher{text-decoration:underline;cursor:pointer}#tester .summary .switchers a{margin-left:10px;color:#000}#tester .summary .switchers a:hover{text-decoration:none}#tester .summary p{margin:0}#tester .jq-toggle>.examples,#tester .jq-toggle>.scenario,#tester .jq-toggle>ol{display:none}#tester .jq-toggle-opened>.examples,#tester .jq-toggle-opened>.scenario,#tester .jq-toggle-opened>ol{display:block}#tester .jq-toggle>h2,#tester .jq-toggle>h3{cursor:pointer}#tester .step{padding-left:5px;border-left:5px solid;}#tester ol{padding-left:30px;border-left:5px solid;}</style> <style type="text/css" media="print"> body{padding:0}#tester{font-size:11px}#tester .jq-toggle>.scenario,#tester .jq-toggle>.scenario .examples,#tester .jq-toggle>ol{display:block}#tester .summary{position:relative}#tester .summary .counters{border:0}#tester .step .path,#tester .summary .switchers{display:none}#tester .jq-toggle-opened>h2:after,#tester .jq-toggle-opened>h3:after,#tester .jq-toggle>h2:after,#tester .jq-toggle>h3:after{content:"";font-weight:700}#tester li {padding-left: 5px;border-left:5px solid;}#tester .scenario .examples>ol li,#tester .scenario>ol li{border-left:0}</style></head><body><div id="tester">';
    this.results = undefined;
    this._html = utils.node('div');
    this._html.toString = function toString() {
        var serializer = new XMLSerializer();
        return startHTML + serializer.serializeToString(this) + '</div></body></html>';
        //return '<html encoding="UTF-8"><head><style>.success{ background-color: green;} .failure{ background-color: red;}</style></head><body><div id="tester">' + serializer.serializeToString(this) + '</div></body></html>';
    };
}
exports.HTMLExporter = HTMLExporter;

/**
 * Retrieves generated XML object - actually an HTMLElement.
 *
 * @return HTMLElement
 */
HTMLExporter.prototype.render = function render() {
    "use strict";
    if (!(this.results instanceof TestSuiteResult)) {
        throw new CasperError('Results not set, cannot get HTML.');
    }

    /* start of generating statistics */
    var statusClass = this.results.countFailed() == 0 ? 'passed' : 'failed';
    var cssClass = 'summary '+ statusClass;
    var summaryNode = utils.node('div', {
        class: cssClass
    });

    var reportNode = utils.node('div', {
        class: 'counters'
    });

    var scenariosNode = utils.node('p', { class: 'scenarios' }, + this.results.length + ' scenarios');
    var stepsNode = utils.node('p', { class: 'steps' }, + this.results.countExecuted() + ' steps (' + this.results.countFailed() + ' failed )');
    var timeNode = utils.node('p', { class: 'time' }, + utils.ms2seconds(this.results.calculateDuration()) + ' s');


    reportNode.appendChild(scenariosNode)
              .appendChild(stepsNode)
              .appendChild(timeNode);
    summaryNode.appendChild(reportNode);

    /* end of statistics generation */

    this._html.appendChild(summaryNode);
    this.results.forEach(function(result) {

        var scenarioNode = utils.node('div', {});

        var suiteNode = utils.node('ol', {
            class: parseInt(result.failed) == 0 ? 'passed' : 'failed'
        }, result.name );

        // succesful test cases
        result.passes.forEach(function(success) {
            var testCase = utils.node('li', {
                class: 'step passed'
            }, '✓ ' + (success.message || success.standard));
            suiteNode.appendChild(testCase);
        });
        // failed test cases
        result.failures.forEach(function(failure) {
            var testCase = utils.node('li', {
                class: 'step failed'
            }, 'X ' + (failure.message || failure.standard));
            suiteNode.appendChild(testCase);
        });
        // skipped test cases
        result.skips.forEach(function(skip) {
            var testCase = utils.node('li', {
                class: 'step skipped'
            }, '? ' + (skip.message || skip.standard));
            suiteNode.appendChild(testCase);
        });

        // errors
        result.errors.forEach(function(error) {
            var errorNode = utils.node('li', {
                type: error.name,
                class: 'error'
            }, error.name);
            errorNode.appendChild(document.createTextNode(error.stack ? error.stack : error.message));
            suiteNode.appendChild(errorNode);
        });
        // warnings
        if (result.warnings.length > 0) {
            var warningNode = utils.node('li');
            warningNode.appendChild(document.createTextNode(result.warnings.join('\n')));
            suiteNode.appendChild(warningNode);   
        }
        
        scenarioNode.appendChild(suiteNode);
        this._html.appendChild(scenarioNode);

    }.bind(this));

    this._html.setAttribute('time', utils.ms2seconds(this.results.calculateDuration()));
    return this._html;
};

/**
 * Sets test results.
 *
 * @param TestSuite  results
 */
HTMLExporter.prototype.setResults = function setResults(results) {
    "use strict";
    if (!(results instanceof TestSuiteResult)) {
        throw new CasperError('Invalid results type.');
    }
    this.results = results;
    return results;
};
