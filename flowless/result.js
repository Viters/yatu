const TestFlow = require('./test-flow');

module.exports = class Result {
  constructor() {
    this._id = 1;
    this._history = [];
  }

  get history() {
    return this._history;
  }

  createCase() {
    const testCase = {
      id: this._id++,
      flow: new TestFlow(),
    };

    this._history.push(testCase);
    return testCase;
  }
};