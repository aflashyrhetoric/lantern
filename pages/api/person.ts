import { endpoint } from "../../helpers/api"
import moment from "moment"

export const createPerson = (baseurl, payload, resetForm = () => {}) => {
  fetch(endpoint(baseurl, "/people"), {
    method: "POST",
    body: JSON.stringify(payload) as any,
    credentials: "include",
    mode: "cors",
  }).then(() => resetForm())
}

export const updatePerson = (baseurl, payload, id: number, resetForm) => {
  fetch(endpoint(baseurl, `/people/${id}`), {
    method: "PUT",
    body: JSON.stringify({
      ...payload,
      dob:
        payload.dob === null
          ? null
          : moment.utc(payload.dob).format("YYYY-MM-DD"),
    }) as any,
    credentials: "include",
    mode: "cors",
  }).then(() => resetForm())
}

export const deletePerson = (baseurl, person_id: number, resetForm) => {
  deletePersonRequest(baseurl, person_id).then(() => resetForm())
}

export const deletePersonRequest = (baseurl, person_id) => {
  return fetch(endpoint(baseurl, `/people/${person_id}`), {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
  })
}
