// export const baseurl =
//   process.env.LANTERN_ENV === "development"
//     ? "http://localhost:8080"
//     : process.env.API_URL

export const getBaseURL = (env: string) => {
  if (env === "development") {
    return "http://localhost:8080/api"
  }
  if (env === "production") {
    return process.env.API_URL
  }

  throw new Error("LANTERN_ENV was invalid")
}
