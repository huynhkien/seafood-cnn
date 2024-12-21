export const sorts = [
    {
        id: 1,
        value: '-sold',
        text: 'Bán chạy nhất'
    },
    {
        id: 2,
        value: '-name',
        text: 'Theo bảng chữ cái, A-Z'
    },
    {
        id: 3,
        value: 'name',
        text: 'Theo bảng chữ cái, Z-A'
    },
    {
        id: 4,
        value: '-price',
        text: 'Giá từ cao đến thấp'
    },
    {
        id: 5,
        value: 'price',
        text: 'Giá từ thấp đến cao'
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Ngày, mới đến cũ'
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Ngày, cũ đến mới'
    },
]
export const roles =[
    {
        code: 2002,
        value: 'Quản lý'
    },
    {
        code: 2004,
        value: 'Người dùng'
    },
    {
        code: 2006,
        value: 'Nhân viên'
    }
]
export const accumulate = [
    {
        code: 0,
        value: 'Vô hạng'
    },
    {
        code: 1,
        value: 'Đồng'
    },
    {
        code: 2,
        value: 'Vàng'
    },
    {
        code: 3,
        value: 'Bạc'
    },
    {
        code: 4,
        value: 'Kim cương'
    },
    {
        code: 5,
        value: 'Vip'
    },
    {
        code: 6,
        value: 'Tất cả'
    }
]
export const discountType = [
    {
        code: 'percentage',
        value: 'Giảm theo phần trăm '
    },
    {
        code: 'fixed',
        value: 'Giảm theo giá'
    },
]
export const applyVoucher =[
    {
        code: 'all',
        value: 'Tất cả sản phẩm'
    },
    {
        code: 'products',
        value: 'Nhiều sản phẩm'
    },
    {
        code: 'categories',
        value: 'Danh mục'
    },
    {
        code: 'users',
        value: 'Khách hàng'
    },
]
export const status =[
    {
        code: 'active',
        value: 'Hoạt động'
    },
    {
        code: 'inactive',
        value: 'Không họạt động'
    },
]
export const type =[
    {
        code: 'Phiếu nhập',
        value: 'import'
    },
    {
        code: 'Phiếu xuất',
        value: 'export'
    },
]

export const blockStatus =[
    {
        code: true,
        value: 'Blocked'
    },
    {
        code: false,
        value: 'Active'
    },
]

export const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    },
  };
export const voteOptions = [
    {
        id: 1,
        text: 'Siêu tệ'
    },
    {
        id: 2,
        text: 'Tệ'
    },
    {
        id: 3,
        text: 'Trung bình'
    },
    {
        id: 4,
        text: 'Tốt'
    },
    {
        id: 5,
        text: 'Tuyệt vời'
    },
]
export const payMethod = [
    {
        code: 'Kg',
        value: 'Bán theo Kg'
    },
    {
        code: 'Size',
        value: 'Bán theo Size'
    },
    {
        code: 'Combo',
        value: 'Bán theo Combo'
    },
   
]
export const isShow = [
    {
        code: 'true',
        value: 'Hiển thị'
    },
    {
        code: 'false',
        value: 'Không hiển thị'
    }
]
