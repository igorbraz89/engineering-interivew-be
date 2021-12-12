function asyncHandler(route) {
  return async (req, res, next) => Promise.resolve(route(req, res, next)).catch(next);
}
export default asyncHandler;
