
export function withMatchingPasswords(schema, passwordField, confirmField, message = "Passwords do not match") {
  return schema.refine((data) => data[passwordField] === data[confirmField], {
    message,
    path: [confirmField],
  });
}
