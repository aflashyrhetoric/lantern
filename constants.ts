export const baseurl =
  process.env.LANTERN_ENV === "development"
    ? "http://localhost:8080"
    : process.env.API_URL
