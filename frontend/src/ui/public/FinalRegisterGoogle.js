import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import path from '../../utils/path';
import Swal from 'sweetalert2';

const FinalRegister = () => {
  const { status } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'failed') {
      Swal.fire('Opp!', 'Đăng kí không thành công!', 'error').then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
    if (status === 'success') {
      Swal.fire('Congratulation!', 'Đăng kí thành công!', 'success').then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
  }, [status, navigate]);

  return (
    <div className='bg-light'>

    </div>
  );
}

export default FinalRegister;
