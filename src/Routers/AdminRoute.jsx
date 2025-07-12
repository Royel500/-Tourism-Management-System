import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { Navigate } from 'react-router';
import Loading from '../ShearCom/Loading';

const AdminRoute = ({children}) => {
    const {user,loading} = useAuth();
    const {role,roleLoading } =useRole();

    if(loading ||roleLoading ){

        return <Loading></Loading>;
    }

    if(!user || role !== 'admin' ){
        return <Navigate to='/login'></Navigate>
    }

    return children ;
};

export default AdminRoute;