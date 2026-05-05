import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import '@neondatabase/neon-js/ui/css';
import { useParams } from 'react-router-dom';

export function Auth() {

    const { pathname } = useParams();

    return (
        <div className="flex items-center justify-center h-screen">
            <AuthView pathname={pathname} />
        </div>
    );
}