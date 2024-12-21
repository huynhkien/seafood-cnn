import { useNavigate } from 'react-router-dom'; 
import { memo, useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { FaSearch } from "react-icons/fa";
import { identify } from '../../../apis/chatbox';


const Search = ({ name, setName}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pastedImage, setPastedImage] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate(); 
  const handleResult = async(file) => {
    const response = await identify(file);
    setResult(response?.predicted_class);
  }
  useEffect(() => {
    if(pastedImage){
      handleResult(pastedImage.file);
    }
    console.log(result)
  },[pastedImage])
  
  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        
        reader.onload = () => {
          setPastedImage({
            preview: reader.result,
            file: blob
          });
        };
        
        reader.readAsDataURL(blob);
        break;
      }
    }
  };
  const handleRemoveImage = () => {
    setPastedImage(null);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if(pastedImage){
      navigate(`product/${result}`);
      setName(null)
    }else{
      if (searchQuery.trim() !== '') {
        navigate(`product/${encodeURIComponent(searchQuery)}`);
        setName(null)
      }
    }
  };

  return (
    <div className="tpsearchbar tp-sidebar-area">
      <button
        onClick={() => setName(false)}
        className="tpsearchbar__close"
      >
        <i>
          <MdCancel />
        </i>
      </button>
      <div className="search-wrap text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-6 pt-100 pb-100">
              <h2 className="tpsearchbar__title">Nhập thông tin mà bạn muốn tìm kiếm?</h2>
              <div className="tpsearchbar__form">
                <form onSubmit={handleSearch} className='position-relative'>
                  {pastedImage && (
                      <div className="image-search-container">
                        <img 
                          src={pastedImage.preview} 
                          alt="Preview" 
                          className="image-search"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="remove-search-button"
                        >
                          <MdCancel/>
                        </button>
                      </div>
                    )}
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="text"
                      name="search"
                      onPaste={handlePaste}
                      placeholder="Search Product..."
                    />
                    <button className="tpsearchbar__search-btn">
                      <i><FaSearch/></i>
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Search);
