export default function generateRandomStr(length: number): string {
  let str = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < (length || 10); i++)
    str += possible.charAt(Math.floor(Math.random() * possible.length));

  return str;
}
