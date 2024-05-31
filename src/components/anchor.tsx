import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface AnchorProps {
    id: string;
}

export default function Anchor(props: AnchorProps) {
    const { id } = props;
    const ref = useRef<any>(null);
    const location = useLocation();

    const handleHashChange = useCallback(() => {
        if (location.hash.substring(1) === id && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [id, location, ref]);

    useEffect(() => {
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [handleHashChange]);

    return <div id={id} ref={ref} />;
}
