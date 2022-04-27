import { endpoint } from "@/helpers/api"

export const createRelationship = (baseurl, payload, resetForm = () => {}) => {
  return fetch(endpoint(baseurl, "/relationships"), {
    method: "POST",
    body: JSON.stringify(payload) as any,
    credentials: "include",
    mode: "cors",
  })
}

export const deleteRelationship = (
  baseurl,
  relationship_id: number,
  resetForm = () => {},
) => {
  return deleteRelationshipRequest(baseurl, relationship_id).then(() =>
    resetForm(),
  )
}

export const deleteRelationshipRequest = (baseurl, relationship_id) => {
  return fetch(endpoint(baseurl, `/relationships/${relationship_id}`), {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
  })
}
