import { useEffect } from 'react';
import { getToken } from '../apis';
import { useRouter } from 'next/navigation'

export default function useSession({
  redirectTo = '',
  redirectIfFound = false,
}) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !token) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && token)
    ) {
      router.push(redirectTo)
    }
  }, [redirectIfFound, redirectTo])

  return false;
}