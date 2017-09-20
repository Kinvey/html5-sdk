export function randomString() {
  let string = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i += 1) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return string;
}
