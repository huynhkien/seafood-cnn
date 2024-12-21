import React, { useState } from 'react'
import { BiCategory, BiSolidDiscount } from 'react-icons/bi'
import { CiShop } from 'react-icons/ci'
import { FaCartArrowDown, FaComment, FaFileInvoice, FaList, FaProductHunt, FaTruck, FaUser, FaWarehouse } from 'react-icons/fa'
import { FaUsersLine } from 'react-icons/fa6'
import { FcStatistics } from 'react-icons/fc'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useSelector } from 'react-redux'

const HeaderList = () => {
  const [showList, setShowList] = useState(false);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const {current} = useSelector(state => state.user);


  const toggleWarehouse = () => {
    setIsWarehouseOpen(!isWarehouseOpen);
  };
  return (
    <div className='header__list'>
        <div onClick={() => setShowList(prev => !prev)}><FaList fontSize={25}/></div>
        {showList && (
            <div className='list__side-menu shadow'>
                <ul className="side-menu">
                    <li><a href={`/admin/graph`}><FcStatistics/><span>Thống kê</span></a></li>
                    <li><a href='/'><CiShop /><span>Shop</span></a></li>
                    <li><a href={`/admin/manager-product`}><FaProductHunt/><span>Sản phẩm</span></a></li>
                    <li><a href={`/admin/manager-category`}><BiCategory /><span>Danh Mục</span></a></li>
                    <li><a href={`/admin/manager-user`}><FaUser/><span>Khách hàng</span></a></li>
                    <li><a href={`/admin/manager-order`}><FaCartArrowDown/><span>Đơn hàng</span></a></li>
                    <li>
                    <span onClick={toggleWarehouse} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <FaWarehouse/><span>Kho</span>
                        <MdKeyboardArrowDown style={{ marginLeft: 'auto', transform: isWarehouseOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                    </span>
                    </li>
                    <li><a href={`/admin/manager-voucher`}><BiSolidDiscount /><span>Mã giảm giá</span></a></li>
                    <li><a href={`/admin/manager-comment`}><FaComment/><span>Bình luận</span></a></li>
                    {current?.role === '2002' &&
                    <li><a href={`/admin/manager-role`}><FaUsersLine/><span>Phân quyền</span></a></li>
                    }
                </ul>
                {isWarehouseOpen && (
                        <ul className="side-menu-warehouse shadow" >
                        <li><a href={`/admin/manager-supplier`}><FaTruck /><span>Nhà cung cấp</span></a></li>
                        <li><a href={`/admin/manager-import`}><FaFileInvoice /><span>Phiếu nhập & nhập</span></a></li>
                        </ul>
                    )}
                        </div>
        )}
    </div>
  )
}

export default HeaderList