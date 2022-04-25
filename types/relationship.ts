export enum RelationshipType {
  Spouse = "spouse",
  Friend = "friend",
  Partner = "partner",
  Coworker = "coworker",
  Colleague = "colleague",
  Acquaintance = "acquaintance",
  Cousin = "cousin",
  Family = "family",

  // Dramatic
  Rival = "rival",
  Enemy = "enemy",

  Other = "other",

  // Directional relationships
  // Aunt = "aunt",
  // Uncle = "uncle",
}

export type Relationship = {
  id: number
  person_one_id: number
  person_two_id: number
  relationship_type: RelationshipType
}

// X is the spouse of Y and Y is the spouse of X, so "spouse" isBidirectional
const isBidirectional = relationship =>
  [
    RelationshipType.Spouse,
    RelationshipType.Friend,
    RelationshipType.Partner,
    RelationshipType.Coworker,
  ].includes(relationship)

// const isDirectional = (relationship?) => !isBidirectional(relationship)

const getPhrasing = (p1, p2, relationship) => {
  if (isBidirectional(relationship)) {
    return `${p1} is ${p2}'s ${relationship}.`
  }
  return
}
