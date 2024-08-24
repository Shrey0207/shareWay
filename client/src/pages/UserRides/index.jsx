import React from 'react';
import MyRides from '../MyRides';
import jwt_decode from 'jwt-decode';
import { useState, useEffect } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;
const UserRides = () => {
  const [S_UID, setUID] = useState('');

  useEffect(() => {
    const x = localStorage.getItem('tokenID');
    const user = jwt_decode(x);
    setUID(user.UID);

    try {
      fetch(`${apiUrl}/user/dashboard/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${x}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            setUID(data.UID);
          });
        } else {
          console.log('Unauthorized');
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div>
      <MyRides uid={S_UID} />
    </div>
  );
};
export default UserRides;
