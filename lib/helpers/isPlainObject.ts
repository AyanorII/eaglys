// Reference: https://stackoverflow.com/questions/65787971/ways-to-determine-if-something-is-a-plain-object-in-javascript
export const isPlainObject = (value: unknown) => value?.constructor === Object;
