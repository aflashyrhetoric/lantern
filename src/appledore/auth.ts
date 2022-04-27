import { endpoint } from "@/helpers/api"
import Cookies from "js-cookie"
import { LoginForm } from "../../types"

export const login = (baseurl: string, formData: LoginForm) => {
  return fetch(endpoint(baseurl, "/auth/login"), {
    method: "POST",
    body: JSON.stringify(formData),
    credentials: "include",
    mode: "cors",
  })
    .then((r: any) => {
      if (!r.ok) {
        throw new Error("Invalid username or password")
      }
      return r
    })
    .then((r: any) => r.json())
    .then((r: any) => {
      Cookies.set("logged_in", true)

      window.location.reload()
    })
}

export const logout = (baseurl: string) => {
  return fetch(endpoint(baseurl, "/auth/logout"), {
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
}

export const signup = (baseurl: string, formData: LoginForm) => {
  return fetch(endpoint(baseurl, "/auth/signup"), {
    method: "POST",
    body: JSON.stringify(formData),
    mode: "cors",
  })
}
