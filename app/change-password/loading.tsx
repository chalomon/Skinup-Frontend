import React from 'react';
import Spinner from '@/components/Spinner';
export default function loadingPage()  {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="spinner"></div>
           <Spinner/>
        </div>
    );
};
