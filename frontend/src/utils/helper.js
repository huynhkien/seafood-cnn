import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";



export const formatMoney = (number) => {
  if (typeof number !== 'number') {
    return '';
  }
  return number.toFixed(2).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
};
//create raitings
export const renderStartFromNumber = (number) => {
    number = Math.round(number);
    if (!Number.isInteger(number) || number < 0 || number > 5) return null; // Kiểm tra nếu không phải là số nguyên hoặc nằm ngoài khoảng từ 0 đến 5 thì trả về null
    const stars = []; 
    for (let i = 0; i < number; i++) stars.push(<FaStar key={i} color="yellow" />); // Thêm key
    for (let i = number; i < 5; i++) stars.push(<CiStar key={i} />); // Thêm key và sử dụng FaRegStar cho số sao trắng
    return stars; // Trả về mảng các sao
  }

// validate
export const validate = (payload, setInvalidFields) => {
  let invalids = 0;
  const newInvalidFields = [];

  Object.entries(payload).forEach(([fieldName, fieldValue]) => {
    if (typeof fieldValue === 'string' && fieldValue.trim() === '') {
      newInvalidFields.push({ name: fieldName, message: 'Thiếu thông tin' });
      invalids++;
    } else {
      switch (fieldName) {
        case 'email':
          const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          if (!fieldValue.match(emailRegex)) {
            newInvalidFields.push({ name: fieldName, message: 'Email không hợp lệ' });
            invalids++;
          }
          break;
        case 'password':
          if(fieldValue.length < 6){
            newInvalidFields.push({ name: fieldName, message: 'Mật khẩu chứ ít nhất 6 ký tự' });
            invalids++;
          }

        break;
        
        default:
          break;
      }
    }
  });

  // Update the invalidFields state only once with all invalid fields
  setInvalidFields(newInvalidFields);

  return invalids;
};
export const generateRange = (start, end) => {
  const length = end - start + 1; // Thay đổi tính toán độ dài mảng
  return Array.from({ length }, (_, index) => start + index);
};

export function getBase64(file) {
  if(!file) return '';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}