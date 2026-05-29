const errorController = {}

errorController.triggerError = (_req, _res, next) => {
  next(new Error("Intentional error process"))
}

module.exports = errorController