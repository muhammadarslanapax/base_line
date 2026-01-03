module.exports.paginate = (req, res, next) => {
  let { page, limit } = req.query;

  // Trim and check for empty string
  const isPageEmpty = !page || page.trim() === "";
  const isLimitEmpty = !limit || limit.trim() === "";

  if (isPageEmpty && isLimitEmpty) {
    req.pagination = {}; // No pagination applied
  } else {
    // Convert to number safely
    page = Number(page);
    limit = Number(limit);

    // Fallback to defaults if invalid
    page = Number.isNaN(page) || page <= 0 ? 1 : page;
    limit = Number.isNaN(limit) || limit <= 0 ? 10 : limit;

    const offset = (page - 1) * limit;
    req.pagination = { limit, offset };
  }

  next();
};
