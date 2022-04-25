import { Person } from "../types/person"

export const getName = (person: Person): string => {
  return `${person.first_name} ${person.last_name}`
}
