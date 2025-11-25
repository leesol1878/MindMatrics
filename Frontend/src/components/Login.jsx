import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginStyles } from '../assets/dummyStyles';
import { ArrowLeft, Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // REPLACE THE ENTIRE handleSubmit FUNCTION WITH THIS:
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('authChange'));
        setIsSubmitting(false);
        navigate('/');
      } else {
        setSubmitError(data.message || 'Login failed');
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={loginStyles.pageContainer}>
      {/* Background bubbles */}
      <div className={loginStyles.bubble1}></div>
      <div className={loginStyles.bubble2}></div>

      {/* Back button */}
      <Link to="/" className={loginStyles.backButton}>
        <ArrowLeft className={loginStyles.backButtonIcon} />
        <span className={loginStyles.backButtonText}>Back to Home</span>
      </Link>

      {/* Form container */}
      <div className={loginStyles.formContainer}>
        <form onSubmit={handleSubmit} className={loginStyles.form}>
          <div className={loginStyles.animatedBorder}>
            <div className={loginStyles.formContent}>
              {/* Heading */}
              <div className={loginStyles.heading} id="login-heading">
                <div className={loginStyles.headingIcon}>
                  <LogIn className={loginStyles.headingIconInner} />
                </div>
                <h1 className={loginStyles.headingText}>Welcome Back</h1>
              </div>

              {/* Subtitle */}
              <p className={loginStyles.subtitle}>
                Sign in to your account to continue your learning journey
              </p>

              {/* Submit error */}
              {submitError && (
                <div className={loginStyles.submitError}>
                  {submitError}
                </div>
              )}

              {/* Email field */}
              <div className={loginStyles.label}>
                <label className={loginStyles.labelText}>
                  Email Address
                </label>
                <div className={loginStyles.inputContainer}>
                  <div className={loginStyles.inputIcon}>
                    <User className={loginStyles.inputIconInner} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${loginStyles.input} ${
                      errors.email ? loginStyles.inputError : loginStyles.inputNormal
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className={loginStyles.errorText}>{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div className={loginStyles.label}>
                <label className={loginStyles.labelText}>
                  Password
                </label>
                <div className={loginStyles.inputContainer}>
                  <div className={loginStyles.inputIcon}>
                    <Lock className={loginStyles.inputIconInner} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${loginStyles.input} ${loginStyles.passwordInput} ${
                      errors.password ? loginStyles.inputError : loginStyles.inputNormal
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={loginStyles.passwordToggle}
                  >
                    {showPassword ? (
                      <EyeOff className={loginStyles.passwordToggleIcon} />
                    ) : (
                      <Eye className={loginStyles.passwordToggleIcon} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className={loginStyles.errorText}>{errors.password}</p>
                )}
              </div>

              {/* Submit button */}
              <div className={loginStyles.buttonsContainer}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={loginStyles.submitButton}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className={loginStyles.submitButtonText}>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className={loginStyles.submitButtonIcon} />
                      <span className={loginStyles.submitButtonText}>Sign In</span>
                    </>
                  )}
                </button>
              </div>

              {/* Signup link */}
              <div className={loginStyles.signupContainer}>
                <div className={loginStyles.signupContent}>
                  <p className={loginStyles.signupText}>
                    Don't have an account?
                  </p>
                  <Link to="/signup" className={loginStyles.signupLink}>
                    Sign up now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Inject animations */}
      <style>{loginStyles.animations}</style>
    </div>
  );
};

export default Login;