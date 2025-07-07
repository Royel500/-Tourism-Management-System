import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { Navigate, useNavigate } from 'react-router';

const AdminRoute = ({children}) => {
    const {user,loading} = useAuth();
    const {role,roleLoading } =useRole();

    if(loading ||roleLoading ){

        return <span>Loading......... </span>
    }

    if(!user || role !== 'admin' ){
        return <Navigate to='/login'></Navigate>
    }

    return children ;
};

export default AdminRoute;