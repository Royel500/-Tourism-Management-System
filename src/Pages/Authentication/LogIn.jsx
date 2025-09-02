import React from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; 
import GoogleLogIn from './GoogleLogIn';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useUserActivity from '../../hooks/useUserActivity';
import confetti from "canvas-confetti";
import './style.css'

const LogIn = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user,signIn, resetPassword } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
 useUserActivity(user?.email);

const onSubmitt = (data) => {
  signIn(data.email, data.password)
    .then(() => {
      Swal.fire({
        title: 'You are Successfully Logged In!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        willOpen: () => {
          // Flower/confetti animation
          const duration = 1500; // match SweetAlert timer
          const end = Date.now() + duration;

          (function frame() {
            confetti({
              particleCount: 7,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              shapes: ['circle'],
              colors: ['#ff69b4', '#ffb6c1', '#ffd700'],
            });
            confetti({
              particleCount: 7,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              shapes: ['circle'],
              colors: ['#ff69b4', '#ffb6c1', '#ffd700'],
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          })();
        },
      });

      // Optional: voice message
      const message = new SpeechSynthesisUtterance(
        'Welcome back to the website!'
      );
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes('female') 
          
      );
      if (femaleVoice) message.voice = femaleVoice;
      message.rate = 0.7;
      message.pitch = 1;
      message.volume = 0.8;
      window.speechSynthesis.speak(message);

      // Navigate after SweetAlert closes
      setTimeout(() => navigate(from), 1500);
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
     <div className="min-h-screen animated-border-container flex items-center justify-center p-4">
        <div className="animated-border-container card w-full max-w-sm mx-auto">
        <form onSubmit={handleSubmit(onSubmitt)}>
          <div className="card-body">
            <h1 className="text-2xl text-center font-bold mb-4">Please Log In to Your Account</h1>
            <fieldset className="fieldset space-y-2">
              <div className='input-group space-y-3'>

             
            
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input form-input input-has-icon input-bordered w-full"
                placeholder="Email"
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}

              
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="input form-input input-has-icon input-bordered w-full"
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

              <button type="submit" className="btn live-button my-5 btn-neutral mt-4 w-full">
                Login
              </button>
              <p className="text-center">
                Don't have an account?{' '}
                <NavLink to="/register">
                  <span className="text-fuchsia-800 font-bold">Register Now</span>
                </NavLink>
              </p>
               </div>
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
