import { apiGetReceipt } from "../../../apis";
import { useEffect, useState } from "react";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const WordExport = ({ rid }) => {
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

    const handleExport = async () => {
        if (!receipt) return;

        // Tạo tiêu đề dựa trên loại phiếu
        const titleText = receipt.type
        const titleParagraph = new Paragraph({
            children: [
                new TextRun({
                    text: titleText,
                    bold: true,
                    size: 36, // Kích cỡ font lớn hơn để làm tiêu đề nổi bật
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
        });

        // Tạo các đoạn văn bản thông tin phiếu
        const infoParagraphs = [
            new Paragraph({ text: `Mã phiếu: ${receipt._id}`, spacing: { after: 200 } }),
            new Paragraph({ text: `Thể loại phiếu: ${receipt.type}`, spacing: { after: 200 } }),
            new Paragraph({ text: `Người thực hiện: ${receipt.handledBy}`, spacing: { after: 200 } }),
            new Paragraph({ text: `Đơn vị cung cấp: ${receipt.supplier}`, spacing: { after: 200 } }),
            new Paragraph({ text: `Tổng tiền: ${receipt.total}`, spacing: { after: 200 } }),
            new Paragraph({ text: `Ngày tạo: ${new Date(receipt.createdAt).toLocaleDateString()}`, spacing: { after: 400 } }),
            new Paragraph({ text: "Danh sách sản phẩm:", bold: true, spacing: { after: 200 } }),
        ];

        // Tạo bảng chứa danh sách sản phẩm
        const productRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph("Tên sản phẩm")] }),
                    new TableCell({ children: [new Paragraph("Biến thể")] }),
                    new TableCell({ children: [new Paragraph("Giá")] }),
                    new TableCell({ children: [new Paragraph("Số lượng")] }),
                    new TableCell({ children: [new Paragraph("Tổng giá")] }),
                ],
            }),
            ...receipt.products.map((product) =>
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(product.name)] }),
                        new TableCell({ children: [new Paragraph(product.variant)] }),
                        new TableCell({ children: [new Paragraph(product.price.toString())] }),
                        new TableCell({ children: [new Paragraph(product.quantity.toString())] }),
                        new TableCell({ children: [new Paragraph(product.totalPrice.toString())] }),
                    ],
                })
            ),
        ];

        const table = new Table({
            rows: productRows,
            width: { size: 100, type: "pct" },
        });

        // Thêm thông tin người nhận nếu có, căn phải và cách bảng một khoảng lớn
        const recipientInfo = [];
        if (receipt?.exportedTo) {
            recipientInfo.push(
                new Paragraph({ text: "Thông tin người nhận:", bold: true, spacing: { before: 400, after: 200 }, alignment: AlignmentType.RIGHT }),
                new Paragraph({ text: `Tên: ${receipt.exportedTo.name}`, spacing: { after: 200 }, alignment: AlignmentType.RIGHT }),
                new Paragraph({ text: `Email: ${receipt.exportedTo.email}`, spacing: { after: 200 }, alignment: AlignmentType.RIGHT }),
                new Paragraph({ text: `Địa chỉ: ${receipt.exportedTo.address}`, spacing: { after: 200 }, alignment: AlignmentType.RIGHT }),
                new Paragraph({ text: `Số điện thoại: ${receipt.exportedTo.phone}`, spacing: { after: 400 }, alignment: AlignmentType.RIGHT }),
            );
        }

        // Thêm dòng chữ ký xác nhận
        const signatureParagraph = new Paragraph({
            children: [
                new TextRun({
                    text: "Chữ ký xác nhận: ..........................................",
                    italics: true,
                }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400, after: 200 },
        });

        // Tạo Document Word
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        titleParagraph, // Thêm tiêu đề vào đầu tài liệu
                        ...infoParagraphs,
                        table, // Thêm bảng sản phẩm vào trước
                        ...recipientInfo, // Thêm thông tin người nhận sau bảng sản phẩm
                        signatureParagraph, // Thêm đoạn văn chữ ký vào cuối tài liệu
                    ],
                },
            ],
        });

        // Xuất file Word
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${rid}.docx`);
    };

    return (
        <button className="btn btn-primary m-2" onClick={handleExport} disabled={!receipt}>Xuất Word</button>
    );
};

export default WordExport;
