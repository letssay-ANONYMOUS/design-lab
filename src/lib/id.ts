/** Short, collision-safe enough for a local design tool. */
export function uid(prefix = 'x'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}
