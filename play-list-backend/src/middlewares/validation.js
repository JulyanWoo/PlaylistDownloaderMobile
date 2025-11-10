import { body, query, validationResult } from "express-validator";

const validateUrlBody = [body("url").isURL({ require_protocol: true })];
const validateUrlQuery = [query("url").isURL({ require_protocol: true })];

const handleValidation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ error: "url inválida" });
  next();
};

export { validateUrlBody, validateUrlQuery, handleValidation };