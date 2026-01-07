'use client';

import { ToastContainer } from 'react-toastify';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      style={{ 
        zIndex: 9999,
        fontFamily: 'var(--font-montserrat), system-ui, -apple-system, sans-serif'
      }}
      toastClassName="font-sans"
    />
  );
}

