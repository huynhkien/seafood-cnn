import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import { apiUpdateStatus } from '../../../apis';

const MapComponent = ({selectedStatus, updateStatus, setUpdateStatus, fetchAllOrder}) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const updateOrderStatus = async () => {
    const response = await apiUpdateStatus(updateStatus, { status: selectedStatus, location: markerPosition });
    if (response.success) {
        toast.success(response.message);
        setUpdateStatus(null);
        fetchAllOrder();
    } else {
        toast.error(response.message);
    }
};
  const customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png', 
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });
  

  // Component xử lý sự kiện click trên bản đồ
  const LocationMarker = () => {
    useMapEvents({
      click: (e) => {
        setMarkerPosition(e.latlng); 
      },
    });

    return markerPosition ? (
      <Marker position={markerPosition} icon={customIcon}>
        <Popup>
          Đơn hàng đang được vận chuyển tới đây: <br />
          Vĩ độ: {markerPosition.lat.toFixed(4)}, Kinh độ: {markerPosition.lng.toFixed(4)}
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <div>
        <MapContainer center={[10.0452, 105.7469]} zoom={6} style={{ height: '300px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
        </MapContainer>
        <div className="text-center mt-3">
            <button
                className="update-button"
                disabled={!selectedStatus}
                onClick={updateOrderStatus}
            >
                Cập nhật
            </button>
        </div>
    </div>
  );
};

export default MapComponent;
