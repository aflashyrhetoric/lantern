export enum Relationship {
  Spouse = "spouse",
  Friend = "friend",
  Partner = "partner",
  Coworker = "coworker",
  // Girlfriend = "girlfriend",
  // Boyfriend = "boyfriend",
}

// X is the spouse of Y and Y is the spouse of X, so "spouse" isBidirectional
const isBidirectional = relationship =>
  [
    Relationship.Spouse,
    Relationship.Friend,
    Relationship.Partner,
    Relationship.Coworker,
  ].includes(relationship)

const isDirectional = (relationship?) => !isBidirectional(relationship)

const getPhrasing = (p1, p2, relationship) => {
  if (isBidirectional(relationship)) {
    return `${p1} is ${p2}'s ${relationship}.`
  }
  return
}
