import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export default function LeadImportModal({ isOpen, onClose, onImportLeads, activeProfileId }) {
  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleDownloadSample = () => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
      "Họ Và Tên,Số Điện Thoại,Email,Nguồn Khách Hàng,Chiến Dịch Ads,Tiền Nạp,Độ Ưu Tiên,Ghi Chú\n" +
      "Lê Văn Nam,0901234567,nam.le@gmail.com,Facebook Ads / Form,VN_LeadGen_Campaign1,500,hot,Quan tâm copy trade vàng\n" +
      "Hoàng Mai Phương,0987654321,phuong.hoang@yahoo.com,Website / Funnel,Ind_Webinar_Promo,0,warm,Cần gửi tài liệu hướng dẫn";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_crm_leads.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (!selectedFile) return;
    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split(/\r\n|\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) {
          setError("Tệp CSV không có dữ liệu hoặc chỉ có dòng tiêu đề.");
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
          // simple csv row split respecting quotes
          const rawRow = lines[i];
          const cols = rawRow.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length >= 1 && cols[0]) {
            rows.push({
              id: `imported_${Date.now()}_${i}`,
              name: cols[0] || `Khách hàng #${i}`,
              phone: cols[1] || '',
              email: cols[2] || '',
              source: cols[3] || 'File Import CSV',
              campaign: cols[4] || '',
              deposit: parseFloat(cols[5]) || 0,
              priority: (cols[6] || 'warm').toLowerCase(),
              status: 'new',
              assignedTo: activeProfileId || 'prof_admin',
              notes: cols[7] || 'Nhập từ file CSV',
              tags: ['Imported'],
              createdAt: new Date().toISOString().slice(0, 10),
              updatedAt: new Date().toISOString().slice(0, 10)
            });
          }
        }

        if (rows.length === 0) {
          setError("Không tìm thấy dòng dữ liệu hợp lệ trong file.");
        } else {
          setParsedRows(rows);
        }
      } catch (err) {
        setError("Lỗi đọc file: " + err.message);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) return;
    onImportLeads(parsedRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f1c] border border-white/15 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#33CCFF]/15 border border-[#33CCFF]/30 flex items-center justify-center text-[#33CCFF]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nhập Khách Hàng Từ File CSV</h2>
              <p className="text-xs text-gray-400">Tải lên danh sách khách hàng tiềm năng để đưa nhanh vào CRM</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg p-1">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Sample CSV Download Banner */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-white">Chưa có định dạng chuẩn?</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Tải tệp CSV mẫu chuẩn để điền thông tin khách hàng chính xác nhất.</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Tải File Mẫu (.csv)
            </button>
          </div>

          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-[#33CCFF]/50 transition-all bg-[#070b14]/50">
            <input
              type="file"
              accept=".csv"
              id="csvFileInput"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="csvFileInput" className="cursor-pointer block">
              <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-white">
                {file ? file.name : "Nhấp để chọn tệp CSV từ máy tính"}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">Hỗ trợ định dạng .CSV (mã hóa UTF-8)</p>
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">
                  Xem trước {Math.min(parsedRows.length, 5)} / {parsedRows.length} dòng dữ liệu:
                </span>
                <span className="text-emerald-400 font-bold">✓ Đã nhận dạng {parsedRows.length} leads</span>
              </div>
              <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="p-2">Họ & Tên</th>
                      <th className="p-2">SĐT</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Nguồn</th>
                      <th className="p-2 text-right">Tiền nạp ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {parsedRows.slice(0, 5).map(r => (
                      <tr key={r.id}>
                        <td className="p-2 font-medium text-white">{r.name}</td>
                        <td className="p-2 font-mono">{r.phone || '-'}</td>
                        <td className="p-2">{r.email || '-'}</td>
                        <td className="p-2 truncate max-w-[120px]">{r.source}</td>
                        <td className="p-2 text-right font-mono text-emerald-400">${r.deposit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={parsedRows.length === 0}
            onClick={handleExecuteImport}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0AE5D5] text-[#070b14] font-bold shadow-lg shadow-[#33CCFF]/20 hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Xác Nhận Nhập ({parsedRows.length} Leads)
          </button>
        </div>
      </div>
    </div>
  );
}
