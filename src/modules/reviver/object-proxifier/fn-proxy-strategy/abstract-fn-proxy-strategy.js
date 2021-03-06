class AbstractFnProxyStrategy {
  constructor (settings) {
    if (this.constructor === AbstractFnProxyStrategy) {
      throw new TypeError('Abstract class AbstractFnProxyStrategy cannot be instantiated directly.')
    }

    this._className = settings.className
    this._fnName = settings.fnName
    this._origMethod = settings.origMethod
    this._fnCallTree = settings.fnCallTree
    this._instance = settings.instance
  }

  execute () {
    return new Error('Method not implemented!')
  }

  _measureTime (fn) {
    const startDate = new Date()
    const output = fn()
    return {time: new Date() - startDate.getTime(), output}
  }

  async _asyncMeasureTime (fn) {
    const startDate = new Date()
    const output = await fn()
    return {time: new Date() - startDate.getTime(), output}
  }

  _descend () {
    this._fnCallTree.descend(this._className, this._fnName)
  }

  _ascend (time) {
    this._fnCallTree.ascend(time)
  }

  _ascendWithPromise (time, notes) {
    this._fnCallTree.ascendWithPromises(time, notes)
  }

  _error (error) {
    this._fnCallTree.ascendWithError(error)
  }
}

module.exports = AbstractFnProxyStrategy
