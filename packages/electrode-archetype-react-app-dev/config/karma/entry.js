"use strict";

/* eslint-disable no-var */

require("core-js");
require("regenerator-runtime/runtime");

/**
 * Test setup for client-side tests.
 *
 * Intended for:
 * - Karma tests: `npm run test-client`
 * - Browser tests: `http://localhost:3000/test/client/test.html`
 */
/*globals window:false*/
var chai = require("chai");
try {
  var sinonChai = require("sinon-chai");
} catch (error) {
  console.warn("could not load sinon-chai - archetype config sinon set to false ");
}
var chaiShallowly = require("chai-shallowly");

/**
 * Install enzyme along with an Adapter corresponding to React 16
 * Configure enzyme to use the adapter using the top level configure(...) API
 */
var enzyme = require("enzyme");
var Adapter = require("enzyme-adapter-react-16");
enzyme.configure({ adapter: new Adapter() });

/*
 * We need a global sinon to maintain compatibility
 * with existing test suites. However, this will be
 * removed in the future and is being tracked by
 * https://gecgithub01.walmart.com/electrode/electrode-archetype-react-component/issues/10
 */
try {
  window.sinon = require("sinon");
} catch (error) {
  console.warn("could not load sinon - archetype config sinon set to false ");
}

// --------------------------------------------------------------------------
// Chai / Sinon / Mocha configuration.
// --------------------------------------------------------------------------
// Exports
window.expect = chai.expect;

// Plugins
if (sinonChai) {
  chai.use(sinonChai);
}
chai.use(chaiShallowly);

// Mocha (part of static include).
window.mocha.setup({
  ui: "bdd",
  bail: false
});

// --------------------------------------------------------------------------
// Bootstrap
// --------------------------------------------------------------------------
// Use webpack to include all app code _except_ the entry point so we can get
// code coverage in the bundle, whether tested or not.
// NOTE: No need to specify src even in src mode since webpack should handle that already
var srcReq = require.context("client", true, /^((?!app).)(!(spec|test))*\.(jsx|js)?$/);
srcReq.keys().map(srcReq);

// Use webpack to infer and `require` tests automatically only for test/client
var testsReq = require.context("test/client", true, /\.spec.jsx?$/);
testsReq.keys().map(testsReq);

// Only start mocha in browser.
if (!window.__karma__) {
  window.mocha.run();
}
