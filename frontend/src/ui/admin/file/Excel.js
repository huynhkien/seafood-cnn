import { apiGetReceipt } from "../../../apis";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExcelExport = ({ rid }) => {
    const [receipt, setReceipt] = useState(null);

    const fetchReceipt = async () => {
        const response = await apiGetReceipt(rid);
        if (response.success) setReceipt(response.data);
    };

    useEffect(() => {
        if (rid) {
            fetchReceipt();
        }
    }, [rid]);

    const handleExport = () => {
        if (!receipt) return;

        const formattedData = receipt.products.map((product) => ({
            "Tên sản phẩm": product.name,
            "Biến thể": product.variant,
            "Giá": product.price,
            "Số lượng": product.quantity,
            "Tổng giá": product.totalPrice,
        }));

        const infoData = [{
            "Mã phiếu": receipt._id,
            "Thể loại phiếu": receipt.type,
            "Người thực hiện": receipt.handledBy,
            "Đơn vị cung cấp": receipt.supplier,
            "Tổng tiền": receipt.total,
            "Ngày tạo": new Date(receipt.createdAt).toLocaleDateString(),
        }];

        const recipientInfo = []
        if(receipt?.exportedTo){
            recipientInfo.push(
                {
                    "Người nhận": receipt.exportedTo.name,
                    "Địa chỉ": receipt.exportedTo.address,
                    "Số điện thoại": receipt.exportedTo.phone,
                    "Email": receipt.exportedTo.email,
                }
            )
        }

        // Tạo workbook và worksheet
        const wb = XLSX.utils.book_new();
        const wsInfo = XLSX.utils.json_to_sheet(infoData);
        const wsProducts = XLSX.utils.json_to_sheet(formattedData);
        const wsExport = XLSX.utils.json_to_sheet(recipientInfo);

        // Thêm worksheet vào workbook
        XLSX.utils.book_append_sheet(wb, wsInfo, "Thông tin phiếu");
        XLSX.utils.book_append_sheet(wb, wsProducts, "Sản phẩm");
        XLSX.utils.book_append_sheet(wb, wsExport, "Thông tin khách");

        // Xuất file Excel
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `${rid}.xlsx`);
    };

    return (
        <button className="btn btn-success my-2" onClick={handleExport} disabled={!receipt}>Xuất Excel</button>
    );
};

export default ExcelExport;
