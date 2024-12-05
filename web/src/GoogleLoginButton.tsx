import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { googleLogin } from './api'; // Import fungsi googleLogin

const GoogleLoginButton: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const clientId = typeof process !== 'undefined' ? import.meta.env.GOOGLE_CLIENT_ID : '';

  if (!clientId) {
    return null; // Do not render the component if clientId is null or process is undefined
  }

  const handleSuccess = async (response: any) => {
    try {
      const res = await googleLogin(response.credential);
      const { token, message } = res.data;

      if (token) {
        localStorage.setItem('jwtToken', token);
        toast.success(message, { duration: 1000 });
        onSuccess();
      } else {
        toast.error('Login gagal', { duration: 1000 });
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      toast.error('Login gagal', { duration: 1000 });
    }
  };

  const handleError = () => {
    toast.error('Login gagal', { duration: 1000 });
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;