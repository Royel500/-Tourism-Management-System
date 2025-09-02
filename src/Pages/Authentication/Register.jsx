import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { updateProfile } from 'firebase/auth';
import GoogleLogIn from './GoogleLogIn';
import axios from 'axios';
import Loading from '../../ShearCom/Loading';
import confetti from 'canvas-confetti';
import './style.css'
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const Register = () => {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const { createUser, loading } = useAuth();
  const navigate = useNavigate();
  const [photoURL, setPhotoURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const axiosIns = useAxios(); // axios instance with token

  // Upload image to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_PHOTO_KEY}`,
        formData
      );
      const url = res.data.data.url;
      setPhotoURL(url); 
     
    } catch (err) {
      console.error("Image upload error:", err);
      
    } finally {
      setUploading(false); 
    }
  };

  // Form submit handler
  const onSubmit = async (data) => {
    const { email, password, displayName } = data;

    try {
      const res = await createUser(email, password);
      const loggedUser = res.user;

      // Update Firebase profile
      await updateProfile(loggedUser, {
        displayName,
        photoURL: photoURL || '',
      });

      // Save user to MongoDB backend
      const userInfo = {
        uid: loggedUser.uid,
        name: displayName,
        email,
        photoURL: photoURL || '',
        role: 'tourist',
        createdAt: new Date().toISOString(),
        isActive: true, // added active status
      };

      await axiosIns.post('/api/users', userInfo);

      // SweetAlert with confetti animation
      Swal.fire({
        title: "Account Created!",
        text: "Welcome to the platform!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        willOpen: () => {
          const duration = 1500;
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
            if (Date.now() < end) requestAnimationFrame(frame);
          })();
        },
      });

      // Voice message
      const message = new SpeechSynthesisUtterance("Congratulations! Welcome to the website.");
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("zira")
      );
      if (femaleVoice) message.voice = femaleVoice;
      message.rate = 0.9;
      message.pitch = 1.2;
      message.volume = 0.9;
      window.speechSynthesis.speak(message);

      navigate('/');
    } catch (err) {
      console.error(err);
      Swal.fire("Registration Failed", err.message || "Something went wrong", "error");
    }
  };

  if (loading) return <Loading />;

return (
  <div className="min-h-screen animated-border-container flex items-center justify-center p-4">
    {/* animated border wrapper */}
    <div className="animated-border-container card w-full max-w-sm mx-auto">
      <div >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <h1 className="text-2xl text-center font-bold mb-6"  >
              Create An Account
            </h1>

            <fieldset className="fieldset space-y-4">

              {/* Name */}
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  {...register('displayName', { required: true })}
                  className="form-input input-has-icon"
                  placeholder="Your full name"
                />
                {errors.displayName && <p className="text-red-600 text-sm mt-1">Name is required</p>}
              </div>

              {/* Email */}
              <div className="input-group">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="form-input input-has-icon"
                  placeholder="Your email"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">Email is required</p>}
              </div>

              {/* Password */}
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  {...register('password', { required: true, minLength: 6 })}
                  className="form-input input-has-icon"
                  placeholder="Password"
                />
                {errors.password?.type === 'required' && <p className='text-red-600 text-sm mt-1'>Password is required</p>}
                {errors.password?.type === 'minLength' && <p className='text-red-600 text-sm mt-1'>Password must be at least 6 characters</p>}
              </div>

              {/* Photo Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-input"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="live-button mt-6"
                disabled={loading || uploading}
              >
                {uploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>

              <p className="text-sm text-center mt-4" style={{ color: 'rgba(143,247,255,0.8)' }}>
                Already have an account?{" "}
                <NavLink className="text-primary font-bold hover:underline" to="/login">
                  Log In
                </NavLink>
              </p>
            </fieldset>
          </div>
        </form>


        <GoogleLogIn />
      </div>
    </div>
  </div>
);

};

export default Register;
