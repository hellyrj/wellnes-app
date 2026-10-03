/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';

export default function VerifyEmail() {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No verification token found in the URL.');
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await axios.get(`${API_BASE_URL}/auth/verify-email?token=${token}`);
        
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The token may be invalid or expired.');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50/50 overflow-hidden"
      >
        <div className="bg-gradient-to-b from-orange-50 to-white p-8 pb-4 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Email Verification</h1>
        </div>

        <div className="p-8">
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Successful!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
              >
                Go to Login
              </motion.button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
              >
                Back to Home
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
