export async function apiGet(path: string) {
  return fetch(`/api${path}`).then((r) => r.json());
}
