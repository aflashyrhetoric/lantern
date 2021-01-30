import { baseurl } from "../../constants"

// General endpoint helper
export const endpoint = (s: string): string => `${baseurl}${s}`
