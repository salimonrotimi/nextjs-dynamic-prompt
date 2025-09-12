// function to mask the email since it is very important
export function maskEmail(email) {
  const [userpart, domainName] = email.split("@");
  if (userpart.length <= 2) {
    return `${userpart[0]}***@${domainName}`;
  }
  return `${userpart.slice(0, 2)}${"*".repeat(
    userpart.length - 2
  )}${userpart.slice(-1)}@${domainName}`;
}
