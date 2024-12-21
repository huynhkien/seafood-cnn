import { useState } from 'react';
import { FaCamera, FaCloudUploadAlt } from "react-icons/fa";
import { Breadcrumb, Loading } from '../../../components/Index';
import { identify } from '../../../apis/chatbox';
import {showModal} from '../../../store/app/appSlice'
import { useDispatch } from 'react-redux';


const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const handleFileSelect = (event) => {
    setError(null);
    const file = event.target.files[0];
    
    if (file) {
      // Kiểm tra file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      // Tạo preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const data = await identify(selectedFile);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));

      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb category='Định giá hải sản' />
      <div className='identify-container'>
        <div className="identify-container__wrapper">
          <div className="identify__file-upload">
            <input
              type="file"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              accept="image/*"
            />
            <label 
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className='identify-image-upload'
                />
              ) : (
                <FaCamera className="file-upload-icon" />
              )}
              <span>Nhấp để tải lên hoặc kéo và thả</span>
            </label>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
            className="identify__button"
          >
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <FaCloudUploadAlt />
            )}
            {loading ? 'Xử lý...' : 'Dự đoán hình ảnh'}
          </button>

          {error && (
            <div className="error-message">{error}</div>
          )}
        </div>
        <div className='identify-container__result'>
          <div className='result--title text-center'>
            <h3 className='tpsection__title py-2'>Kết quả</h3>
          </div>
          <div className='result--body'>
            {prediction ? (
              <>
                <p><strong>Dự đoán tên cá:</strong> {prediction?.predicted_class}</p>
                <p><strong>Giá tiền:</strong> {prediction?.predicted_price_range?.min.toLocaleString()} VNĐ - {prediction?.predicted_price_range?.max.toLocaleString()} VNĐ </p>
                <p><strong>Định dạng ảnh:</strong> {prediction?.image_info?.format}</p>
                <p><strong>Kích thước ảnh:</strong> {prediction?.image_info?.size[0]} - {prediction?.image_info?.size[1]}</p>
              </>
            ) : (
              <p>Chưa có kết quả dự đoán</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
