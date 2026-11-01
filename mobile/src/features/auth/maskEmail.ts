/** "nena@example.com" becomes "n•••a@example.com" so the code screens can name the inbox without printing the whole address. */
export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0]}•••@${domain}`;
  return `${name[0]}•••${name[name.length - 1]}@${domain}`;
}
