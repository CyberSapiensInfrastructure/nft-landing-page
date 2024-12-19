import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';

export function withAdminAuth<T extends object>(WrappedComponent: ComponentType<T>) {
  return function WithAdminAuthComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
      if (!isAuthenticated) {
        router.push('/');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
} 