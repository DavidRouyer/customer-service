export async function signIn() {
  const { callbackUrl = window.location.href, redirect = true } = {};

  // TODO: Handle custom base path
  // TODO: Remove this since SvelteKit offers the CSRF protection via origin check
  const response = await fetch('/api/auth/csrf');
  const { csrfToken } = await (response.json() as Promise<{
    csrfToken: string;
  }>);

  const res = await fetch('/api/auth/signin', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    body: new URLSearchParams({
      csrfToken,
      callbackUrl,
    }),
  });

  const data = await res.clone().json();
  const error = new URL(data.url).searchParams.get('error');

  if (redirect || !error) {
    // TODO: Do not redirect for Credentials and Email providers by default in next major
    window.location.href = data.url ?? callbackUrl;
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (data.url.includes('#')) window.location.reload();
    return;
  }

  return res;
}
