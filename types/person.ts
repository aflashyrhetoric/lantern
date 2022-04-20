import { Note } from "./note"
import { PressurePoint } from "./pressure-point"
import { Relationship } from "./relationship"

export interface Person {
  id: number
  first_name: string
  last_name: string
  career: string
  mobile: string
  email: string
  address: string
  dob: string
  notes: Note[]
  pressure_points: PressurePoint[]
  relationships: Relationship[]
}
