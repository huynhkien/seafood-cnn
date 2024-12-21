import { useEffect, useState } from 'react';
import { apiDeleteReceipt, apiDeleteSupplier, apiGetReceipts } from "../../../../apis";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaEdit, FaTrash } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { toast } from 'react-toastify';
import moment from 'moment';
import {Detail, ImportEdit } from '../../../Index'
const ManagerImport = () => {
  const [receipt, setReceipt] = useState(null);
  const [editReceipt, setEditReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailReceipt, setDetailReceipt] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchReceipt = async () => {
    const response = await apiGetReceipts();
    if (response.success) {
      setReceipt(response.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchReceipt();
  }, []);

  // Lọc dữ liệu dựa trên một bộ lọc duy nhất
  const filteredReceipt = receipt?.filter(item => {
    const receiptIdMatch = item._id.toLowerCase().includes(globalFilter.toLowerCase());
    const typeMatch = item.type.toLowerCase().includes(globalFilter.toLowerCase());
    const handledByMatch = item.handledBy.toLowerCase().includes(globalFilter.toLowerCase());
    const totalMatch = item.total.toString().includes(globalFilter);
    const dateMatch = item.updatedAt.includes(globalFilter);

    return receiptIdMatch || typeMatch || handledByMatch || totalMatch || dateMatch;
  });
  // Xử lý chi tiết phiếu xuất nhập
  const detailTemplate = (rowData) => {
    return (
      <div>
        <button className="btn btn-xs btn-primary" onClick={() => setDetailReceipt(rowData._id)}>
          <CgDetailsMore />
        </button>
      </div>
    );
  };
  

  // Xử lý định dạng ngày nhập (sử dụng moment)
  const dateBodyTemplate = (rowData) => {
    return moment(rowData.updatedAt).format('DD/MM/YYYY HH:mm'); 
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button className="btn btn-xs btn-primary" onClick={() => setEditReceipt(rowData?._id)}>
          <FaEdit />
        </button>
        <span className='mx-2'></span>
        <button 
          onClick={() => handleDelete(rowData._id)} 
          className="btn btn-xs btn-danger"
        >
          <FaTrash />
        </button>
      </div>
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) {
      const response = await apiDeleteReceipt(id);
      if (response.success) {
        toast.success(response.message);
        fetchReceipt();
      } else {
        toast.error(response.message);
      }
    }
  };

  const header = (
    <div className='p-inputgroup flex-1 my-2'>
        <InputText type='text' placeholder='Tìm kiếm' className='p-inputtext p-component p-2' onChange={(e) => setGlobalFilter(e.target.value)} />
    </div>
  );

  return (
    <div>
      <div className="header">
        <div className="left">
          <h1>Phiếu nhập & xuất</h1>
        </div>
      </div>
      {detailReceipt &&
      <div className='show-option shadow'>
        <Detail
          id={detailReceipt}
          setShow={setDetailReceipt}
        />
      </div>
      }
      {
        editReceipt && 
        <div className='show-option shadow'>
          <ImportEdit
            editReceipt={editReceipt}
            setEditReceipt={setEditReceipt}
            fetchReceiptManager={fetchReceipt}
          />
        </div>
      }
      <div className="bottom-data">
        <div className="orders">
          <a href={'manager-import/add-receipt'} className="btn btn-primary" style={{ marginBottom: '30px' }}>
            <i className="fa fa-plus"></i> Tạo phiếu nhập & xuất
          </a>
          <DataTable 
            value={filteredReceipt} 
            paginator 
            rows={10} 
            dataKey="id" 
            loading={loading} 
            emptyMessage="No receipts found."
            header={header}
          >
            <Column sortable field="_id" header="Mã phiếu nhập" />
            {/* <Column sortable field="handledBy" header="Nhân viên" />
            <Column sortable field="total" header="Tổng tiền" /> */}
            <Column body={detailTemplate} header="Chi tiết" />
            <Column  sortable field="type" header="Loại" />
            {!isSmallScreen && <Column  sortable field="supplier" header="Đơn vị" />}
            {!isSmallScreen && <Column field="updatedAt" header="Ngày nhập" body={dateBodyTemplate} />}
            <Column body={actionBodyTemplate} header="Action" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ManagerImport;
