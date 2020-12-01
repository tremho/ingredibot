
enum QualifierType {
    Small ="Small",
    Medium = "Medium",
    Large = "Large"
}
export type QualifierMatch = [string, string] // text, QualifierType

/**
 * Qualifiers describe a single unit (e.g. an apple) in a generically quantifiable way
 */
const matchableQualifiers = [
    ["small sized", QualifierType.Small],
    ["small size", QualifierType.Small],
    ["small", QualifierType.Small],
    ["petite", QualifierType.Small],
    ["medium sized", QualifierType.Medium],
    ["medium size", QualifierType.Medium],
    ["medium", QualifierType.Medium],
    ["average sized", QualifierType.Medium],
    ["average size", QualifierType.Medium],
    ["average", QualifierType.Medium],
    ["normal sized", QualifierType.Large],
    ["normal size", QualifierType.Large],
    ["normal", QualifierType.Medium],
    ["large sized", QualifierType.Large],
    ["large size", QualifierType.Large],
    ["large", QualifierType.Large]
]

export default matchableQualifiers