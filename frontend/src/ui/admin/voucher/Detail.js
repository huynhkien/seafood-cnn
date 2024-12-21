import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { apiGetVoucher } from '../../../apis/voucher';
import { MdCancel } from 'react-icons/md';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Detail = ({data, setData}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [voucher, setVoucher] = useState(null);

  const fetchVoucher = async () => {
    const response = await apiGetVoucher(data?.id);
    if(response.success) setVoucher(response.data);
  }

  useEffect(() => {
    fetchVoucher();
  }, [data?.id])

  const header = (
    <div className="p-inputgroup flex-1 my-2">
      <InputText type="text" placeholder="Tìm kiếm" className="p-inputtext p-component p-2" onChange={(e) => setGlobalFilter(e.target.value)} />
    </div>
  );

  return (
    <div className="bottom-data">
      <div className='position-absolute top-0 end-0'>
        <span onClick={() => setData(null)}><MdCancel color='primary' fontSize={25}/></span>
      </div>
      <div className="orders">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Chi tiết</h4>
          </div>
          {voucher?.applicableProducts && voucher?.applicableProducts.length > 0 ?
            (<div className="card-body">
                <DataTable
                    value={voucher?.applicableProducts}
                    paginator
                    rows={10}
                    dataKey="id"
                    emptyMessage="Không tìm thấy sản phẩm."
                    header={header}
                >
                    <Column sortable field="name" header="Sản phẩm" />
                    <Column sortable field="variant" header="Biến thể" />
                </DataTable>
            </div>)
            :
            null
          }
          {voucher?.applicableCategories && voucher?.applicableCategories.length > 0 ?
            (<div className="card-body">
                <DataTable
                    value={voucher?.applicableCategories}
                    paginator
                    rows={10}
                    dataKey="id"
                    emptyMessage="Không tìm thấy sản phẩm."
                    header={header}
                >
                    <Column sortable field="category" header="Mã" />
                    <Column sortable field="name" header="Danh mục" />
                    
                </DataTable>
            </div>)
            :
            null
          }
          {voucher?.applicableUsers && voucher?.applicableUsers.length > 0 ?
            (<div className="card-body">
                <DataTable
                    value={voucher?.applicableUsers}
                    paginator
                    rows={10}
                    dataKey="id"
                    emptyMessage="Không tìm thấy sản phẩm."
                    header={header}
                >
                    <Column sortable field="name" header="Hạng" />
                    
                </DataTable>
            </div>)
            :
            null
          }
          <div className="card-body">
            {voucher && (
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Ngày bắt đầu:</strong> {new Date(voucher.startDate).toLocaleDateString()}
                </li>
                <li className="list-group-item">
                  <strong>Ngày kết thúc:</strong> {new Date(voucher.endDate).toLocaleDateString()}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;