export async function signIn<
  P extends RedirectableProviderType | undefined = undefined,
>(
  providerId?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
) {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {};

  // TODO: Support custom providers
  const isCredentials = providerId === 'credentials';
  const isEmail = providerId === 'email';
  const isSupportingReturn = isCredentials || isEmail;

  // TODO: Handle custom base path
  const signInUrl = `/api/auth/${
    isCredentials ? 'callback' : 'signin'
  }/${providerId}`;

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`;

  // TODO: Handle custom base path
  // TODO: Remove this since SvelteKit offers the CSRF protection via origin check
  const response = await fetch('/api/auth/csrf');
  const { csrfToken } = await (response.json() as Promise<{
    csrfToken: string;
  }>);

  console.log(_signInUrl);

  const res = await fetch(_signInUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    body: new URLSearchParams({
      ...options,
      csrfToken,
      callbackUrl,
    }),
  });

  const data = await res.clone().json();
  const error = new URL(data.url).searchParams.get('error');

  if (redirect || !isSupportingReturn || !error) {
    // TODO: Do not redirect for Credentials and Email providers by default in next major
    window.location.href = data.url ?? callbackUrl;
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (data.url.includes('#')) window.location.reload();
    return;
  }

  return res;
}
