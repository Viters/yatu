const ConfigReader = require('./modules/config/config-reader')
const TestRunner = require('./modules/test-runner/test-runner')
const Reporter = require('./modules/reporter/reporter')
const TestSuite = require('./modules/test-suite/test-suite')
const Injector = require('./modules/util/injector')
const ObjectTreeReviver = require('./modules/reviver/object-tree-reviver')
const ObjectProxifier = require('./modules/reviver/object-proxifier/object-proxifier')
const ObjectReviver = require('./modules/reviver/object-reviver')
const DbWrapper = require('./modules/util/db-wrapper')

class Yatu {
  constructor () {
    this._pathToProject = process.argv[2]
    this._reporterRenderer = process.argv[3] || 'console-log'
    this._pathToTestsFile = this._pathToProject + 'tests.json'
    this._config = null
    this._reporter = null
    this._testRunner = null
    this._testSuite = null
  }

  bootstrap () {
    this._createDependencies()
    this._addDependenciesToInjector()

    this._testSuite.prepare(this._config)
    const promises = this._testSuite.execute()

    promises.forEach(p => p.then(r => this._reporter.render(r)))

    Promise.all(promises).then(() => {
      this._dbWrapper.destroy()
      process.exit()
    })
  }

  _createDependencies () {
    this._config = this._readConfig()
    this._reporter = new Reporter(this._reporterRenderer)
    this._testRunner = new TestRunner()
    this._testSuite = new TestSuite(this._testRunner)
    this._dbWrapper = new DbWrapper()
  }

  _readConfig () {
    const configReader = new ConfigReader(this._pathToProject)
    return configReader.readConfigFile(this._pathToTestsFile)
  }

  _addDependenciesToInjector () {
    Injector.perpetuate(this._config)
    Injector.perpetuate(new ObjectProxifier())
    Injector.perpetuate(new ObjectReviver())
    Injector.perpetuate(new ObjectTreeReviver())
    Injector.perpetuate(this._dbWrapper)
  }
}

module.exports = Yatu
