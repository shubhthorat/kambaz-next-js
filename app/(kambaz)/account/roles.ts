export function isFacultyLike(user: { role?: string } | null | undefined) {
  const r = user?.role;
  return r === "FACULTY" || r === "ADMIN";
}

export function isStudentRole(user: { role?: string } | null | undefined) {
  return user?.role === "STUDENT";
}
