import React from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // fixed from 'react-router'
import GoogleLogIn from './GoogleLogIn';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn, resetPassword } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const onSubmitt = (data) => {
    signIn(data.email, data.password)
      .then(() => {
        Swal.fire({
          title: 'You are Successfully Logged In!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from);
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error',
          text: err.message,
          icon: 'error',
        });
      });
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Enter your email',
      input: 'email',
      inputLabel: 'We will send a reset link',
      inputPlaceholder: 'Enter your email address',
      showCancelButton: true,
    });

    if (email) {
      resetPassword(email)
        .then(() => {
          Swal.fire('Success!', 'Check your email for reset instructions.', 'success');
        })
        .catch((err) => {
          Swal.fire('Error!', err.message, 'error');
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <form onSubmit={handleSubmit(onSubmitt)}>
          <div className="card-body">
            <h1 className="text-2xl text-center font-bold mb-4">Please Log In to Your Account</h1>
            <fieldset className="fieldset space-y-2">
              <label className="label">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input input-bordered w-full"
                placeholder="Email"
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}

              <label className="label">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="input input-bordered w-full"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}

              <div>
                <button
                  type="button"
                  className="link link-hover text-blue-600"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-neutral mt-4 w-full">
                Login
              </button>
              <p className="text-center">
                Don't have an account?{' '}
                <NavLink to="/register">
                  <span className="text-fuchsia-800 font-bold">Register Now</span>
                </NavLink>
              </p>
            </fieldset>
          </div>
        </form>
        <div className="px-6 pb-4">
          <GoogleLogIn />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
