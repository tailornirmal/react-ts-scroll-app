import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <header style={styles.header}>
               {children}
               </header>
        </div>
    );
};

const styles = {
    header: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
    },
    main: {
        marginTop: '4rem', // Adjust this value based on the header height
        padding: '1rem',
    },
};

export default Layout;