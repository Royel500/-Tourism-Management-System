import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../FireBase/FireBase_Auth';

const AuthProvider = ({children}) => {
const [user,setUser] = useState(null);
const [loading , setLoading] =useState(true);


const provider = new GoogleAuthProvider();


    // -----create user-----

    const createUser = (email , password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password);
    }
//  ----logIn user-----
    const signIn =(email ,password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password);
    }

    // -----forget password--------

    
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };


    // ---goole login----

const googleMama = () =>{
    setLoading(true);
    return signInWithPopup(auth,provider);
}

    // --logOut----

    const logOut = () =>{
        setLoading(true);
      return signOut(auth);
    }

useEffect( ()=>{
    const unsubscribe = onAuthStateChanged(auth,currentUser =>{
        
        setUser(currentUser);
        console.log('user is here on authProvider' , currentUser)
        setLoading(false);
    });
    return () =>{
        unsubscribe();
    }
},[])

    const authInfo = {
           user,
       loading,
       resetPassword,
       createUser,
       signIn,
       logOut,
       googleMama,
    
    }
    return (
       <AuthContext value={authInfo}>
      {children}
       </AuthContext>
    );
};

export default AuthProvider;