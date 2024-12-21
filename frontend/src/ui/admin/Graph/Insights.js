import React, { useEffect, useState } from 'react'
import {apiGetProducts, apiGetUsers, apiGetCategory, apiGetCountOrder} from "../../../apis"
import { FaProductHunt } from "react-icons/fa6";
import { TbCategoryFilled } from "react-icons/tb";
import { FaUser, FaCartArrowDown  } from "react-icons/fa";
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');


const Insights = () => {
    const [countProduct, setCountProduct] = useState(null);
    const [countUser, setCountUser] = useState(null);
    const [countCategory, setCountCategory] = useState(null);
    const [countOrder, setCountOrder] = useState(null);
    const [onlineCount, setOnlineCount] = useState(0);

    const fetchCountProduct = async () => {
        const response = await apiGetProducts();
        if(response.success) setCountProduct(response.counts);
    }
    const fetchCountUser = async () => {
        const response = await apiGetUsers();
        if(response.success) setCountUser(response.counts);
        console.log(countUser)
    }
    const fetchCountCategory = async () => {
        const response = await apiGetCategory();
        if(response.success) setCountCategory(response.counts);
    }
    const fetchCountOrder = async () => {
        const response = await apiGetCountOrder();
        if(response.success) setCountOrder(response.data);
    }
    useEffect(() => {
        fetchCountProduct();
        fetchCountUser();
        fetchCountCategory();
        fetchCountOrder();

        socket.on('update_online_count', (data) => {
            setOnlineCount(data.onlineCount);
        });

        // Khi component unmount, ngắt kết nối socket
        return () => {
            socket.off('update_online_count');
        };
    })
  return (
    <div>
        <ul class="insights">
                <a href={'/manager-product'} >
                    <li>
                        <FaProductHunt fontSize={50}  />
                        <span class="info">
                            <h3>
                               {countProduct}
                            </h3>
                            <p>Sản phẩm </p>
                        </span>
                    </li>
                </a>
                <a href={'/manager-category'}  >
                    <li>
                        < TbCategoryFilled  fontSize={50}/>
                        <span class="info">
                            <h3>
                               {countCategory}
                            </h3>
                            <p>Danh mục </p>
                        </span>
                    </li>
                </a>
                <a href={'/manager-user'}  >
                    <li>
                        <FaUser  fontSize={50}/>
                        <span class="info">
                            <h3>
                               {countUser}
                            </h3>
                            <p>Khách hàng </p>
                        </span>
                        <span className='info'>
                            <h3>{onlineCount || 0}</h3>
                            <p>Online</p>
                        </span>
                    </li>
                </a>
                <a href={'/manager-order'} >
                    <li>
                        <FaCartArrowDown  fontSize={50}/>
                        <span class="info">
                            <h3>
                               {countOrder}
                            </h3>
                            <p>Đơn hàng </p>
                        </span>
                    </li>
                </a>
            </ul>
    </div>
  )
}

export default Insights