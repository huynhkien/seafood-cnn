import React, { useEffect, useState } from 'react';

const PlacesSearchComponent = ({ onLocationSelect }) => {
    const defaultLocation = {
        lat: 9.175524697206873, // Vĩ độ
        lng: 105.10476926072694 // Kinh độ
    };

    const [selectLocation, setSelectLocation] = useState(defaultLocation); // Khởi tạo với defaultLocation

    useEffect(() => {
        if (selectLocation) {
            // Có thể thêm logic tại đây nếu cần xử lý gì khi selectLocation thay đổi
            onLocationSelect(selectLocation); // Gọi hàm khi có lựa chọn mới
        }
    }, [selectLocation]); // Chạy khi selectLocation thay đổi

    // Xây dựng URL cho iframe
    const iframeSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126040.5276503115!2d${selectLocation.lng}!3d${selectLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a1499e262d02a9%3A0xefe0b01bb69d636d!2zVHAuIEPDoCBNYXUsIEPDoCBNYXUsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1728800179063!5m2!1svi!2s`;

    return (
        <div>
            <iframe 
                src={iframeSrc} 
                width="600" 
                height="450"
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    );
};

export default PlacesSearchComponent;
