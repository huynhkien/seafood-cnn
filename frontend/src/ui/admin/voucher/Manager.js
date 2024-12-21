import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaEdit, FaList, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { VoucherDetail, VoucherEdit} from '../../Index';
import { apiDeleteVoucher, apiGetVouchers } from '../../../apis/voucher';
import { BiSolidDetail } from 'react-icons/bi';
import { showModal } from '../../../store/app/appSlice';
import { useDispatch } from 'react-redux';


const Page = () => {
  const [vouchers, setVouchers] = useState(null);
  const [showOption, setShowOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchVouchers = async () => {
    const response = await apiGetVouchers();
    if (response.success) setVouchers(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);
  const filteredVoucher = vouchers?.filter(item => {
    const codeMatch = item.code.toLowerCase().includes(globalFilter.toLowerCase());
    const discountTypeMatch = item.discountType.includes(globalFilter.toLowerCase());
    const minPurchaseAmountMatch = item.minPurchaseAmount.toString().includes(globalFilter);
    const maxDiscountMatch = item.maxDiscount.toString().includes(globalFilter);
    const usageLimitMatch = item.usageLimit.toString().includes(globalFilter);
    const userUsageLimitMatch = item.userUsageLimit.toString().includes(globalFilter);
    const applyType = item.applyType.includes(globalFilter.toLowerCase());

    return codeMatch || discountTypeMatch || minPurchaseAmountMatch || maxDiscountMatch || usageLimitMatch || userUsageLimitMatch || applyType;
  });
  const actionBodyTemplate = (rowData) => {
    return (
      <div className='position-relative'>
        <button 
          className="btn btn-xs btn-primary" 
          onClick={() => setShowOption(prev => prev === rowData._id ? null : rowData._id)} 
        >
          <FaList/>
        </button>
        {
          showOption === rowData._id && 
          <div className='show-list shadow'>
            <button 
              className="show-list-item btn btn-xs btn-primary"
              onClick={() => setDetail({id: rowData?._id, type: rowData?.type})}
            >
              <BiSolidDetail />
            </button>
            <button 
            onClick={() => setData({id: rowData?._id, type: rowData?.applyType})}
              className="show-list-item btn btn-xs btn-success"
            >
              <FaEdit />
            </button>
            <span 
              onClick={() => handleDelete(rowData?._id)}
              className="show-list-item btn btn-xs btn-danger"
            >
              <FaTrash />
            </span>
          </div>
        }
      </div>
    );
  };
  const discountTypeTemplate = (rowData) => {
    return(
      <div>
        {rowData?.discountType === 'percentage' ? 'Theo %' : 'Theo giá'}
      </div>
    )
  }
  const discountValueTemplate = (rowData) => {
    return (
      <div>
        {rowData?.discountType === 'percentage' ? `${rowData.discountValue}%` : `${rowData.discountValue.toLocaleString()} VNĐ`}
      </div>
    );
  };
  const minPurchaseAmountTemplate = (rowData) => {
    return (
      <div>
        {rowData?.minPurchaseAmount?.toLocaleString()} VNĐ
      </div>
    );
  };
  const maxDiscountTemplate = (rowData) => {
    return (
      <div>
        {rowData?.maxDiscount?.toLocaleString()} VNĐ
      </div>
    );
  };
  const applyTypeTemplate = (rowData) => {
    return (
      <div>
        {rowData?.applyType === 'all' ? 'Tất cả sản phẩm' :
         rowData?.applyType === 'products' ? 'Sản phẩm cụ thể' :
         rowData?.applyType === 'categories' ? 'Danh mục sản phẩm' : 
         rowData?.applyType === 'users' ? 'Điểm tích lũy' : '' }
      </div>
    );
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) {
      dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
      const response = await apiDeleteVoucher(id);
      dispatch(showModal({ isShowModal: false, modalType: null }));
      if (response.success) {
        toast.success(response.message);
        setLoading(true); 
        fetchVouchers();
      } else {
        toast.error(response.message);
      }
    }
  };

  const header = (
    <div className="p-inputgroup flex-1 my-2">
        <InputText type="text" placeholder="Tìm kiếm" className="p-inputtext p-component p-2" onChange={(e) => setGlobalFilter(e.target.value)} />
    </div>
  );

  return (
    <div>
      {detail && (
                <div className='show-voucher shadow'>
                    <VoucherDetail
                     data={detail}
                      setData={setDetail}
                    />
                </div>
            )}
            {
              data && 
              <div className='show-add-supplier shadow'>
                <VoucherEdit
                  data={data}
                  setData={setData}
                  fetchVouchers={fetchVouchers}
                />
              </div>
            }
      <div className="header">
        <div className="left">
          <h1>Mã giảm giá</h1>
        </div>
      </div>
      <div className="bottom-data">
        <div className="orders">
          <a href={'/admin/manager-voucher/add-voucher'}  className="btn btn-primary" style={{ marginBottom: '30px' }}>
            <i className="fa fa-plus"></i> Tạo voucher
          </a>
          <DataTable 
            value={filteredVoucher} 
            paginator 
            rows={10} 
            dataKey="id" 
            loading={loading} 
            emptyMessage="No suppliers found."
            header={header}
            globalFilter={globalFilter}
          >
            <Column sortable field="code" header="Mã voucher" />
            <Column body={discountTypeTemplate} header="Loại giảm giá" />
            <Column sortable field="discountValue" body={discountValueTemplate} header='Giảm' />
            {!isSmallScreen && <Column sortable field='minPurchaseAmount' body={minPurchaseAmountTemplate} header="Tối thiểu" />}
            {!isSmallScreen && <Column sortable field='maxDiscount' body={maxDiscountTemplate} header="Tối đa" />}
            {/* <Column sortable field="startDate" header="Ngày bắt đầu" /> */}
            {/* <Column sortable field="endDate" header="Ngày hết hạn" /> */}
            {!isSmallScreen && <Column sortable field="usageLimit" header="Giới hạn" />}
            {!isSmallScreen && <Column sortable field="userUsageLimit" header="Giới hạn người dùng" />}
            {!isSmallScreen && <Column sortable body={applyTypeTemplate} header="Áp dụng" />}
            <Column body={actionBodyTemplate} header="Lựa chọn" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Page;
