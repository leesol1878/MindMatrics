import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupStyles } from '../assets/dummyStyles';
import { ArrowLeft, Eye, EyeOff, UserPlus, User, Lock, Mail } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
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
        setSubmitError(data.message || 'Signup failed');
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      {/* Back button */}
      <Link to="/" className={signupStyles.backButton}>
        <ArrowLeft className={signupStyles.backButtonIcon} />
        <span className={signupStyles.backButtonText}>Back to Home</span>
      </Link>

      {/* Form container */}
      <div className={signupStyles.formContainer}>
        <div className={signupStyles.animatedBorder}>
          <div className={signupStyles.formContent}>
            {/* Heading */}
            <div className={signupStyles.heading} id="signup-heading">
              <div className={signupStyles.headingIcon}>
                <UserPlus className={signupStyles.headingIconInner} />
              </div>
              <h1 className={signupStyles.headingText}>Create Account</h1>
            </div>

            {/* Subtitle */}
            <p className={signupStyles.subtitle}>
              Join us to start your learning journey
            </p>

            {/* Submit error */}
            {submitError && (
              <div className={signupStyles.submitError}>
                {submitError}
              </div>
            )}

            {/* Name field */}
            <div className={signupStyles.label}>
              <label className={signupStyles.labelText}>
                Full Name
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <User className={signupStyles.inputIconInner} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${signupStyles.input} ${
                    errors.name ? signupStyles.inputError : signupStyles.inputNormal
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className={signupStyles.errorText}>{errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div className={signupStyles.label}>
              <label className={signupStyles.labelText}>
                Email Address
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Mail className={signupStyles.inputIconInner} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${signupStyles.input} ${
                    errors.email ? signupStyles.inputError : signupStyles.inputNormal
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className={signupStyles.errorText}>{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className={signupStyles.label}>
              <label className={signupStyles.labelText}>
                Password
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Lock className={signupStyles.inputIconInner} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${signupStyles.input} ${signupStyles.passwordInput} ${
                    errors.password ? signupStyles.inputError : signupStyles.inputNormal
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={signupStyles.passwordToggle}
                >
                  {showPassword ? (
                    <EyeOff className={signupStyles.passwordToggleIcon} />
                  ) : (
                    <Eye className={signupStyles.passwordToggleIcon} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className={signupStyles.errorText}>{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className={signupStyles.label}>
              <label className={signupStyles.labelText}>
                Confirm Password
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Lock className={signupStyles.inputIconInner} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${signupStyles.input} ${signupStyles.passwordInput} ${
                    errors.confirmPassword ? signupStyles.inputError : signupStyles.inputNormal
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={signupStyles.passwordToggle}
                >
                  {showConfirmPassword ? (
                    <EyeOff className={signupStyles.passwordToggleIcon} />
                  ) : (
                    <Eye className={signupStyles.passwordToggleIcon} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className={signupStyles.errorText}>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit button */}
            <div className={signupStyles.buttonsContainer}>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={signupStyles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>

            {/* Login prompt */}
            <div className={signupStyles.loginPromptContainer}>
              <div className={signupStyles.loginPromptContent}>
                <p className={signupStyles.loginPromptText}>
                  Already have an account?
                </p>
                <Link to="/login" className={signupStyles.loginPromptLink}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inject animations */}
      <style>{signupStyles.animations}</style>
    </div>
  );
};

export default Signup;