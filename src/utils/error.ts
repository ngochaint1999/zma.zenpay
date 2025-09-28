export function getErrorMessageZalo(errorCode: number): string {
  const errorMessages: Record<number, string> = {
    [-201]: "Bạn đã từ chối cấp quyền",
    [-202]: "Bạn đã từ chối cấp quyền và không muốn hỏi lại",
    [-203]: "Quá giới hạn được gọi của api",
    [-1400]: "Do param truyền vào api không hợp lệ",
    [-1401]: "Người dùng chưa cấp thông tin xác thực",
    [-1403]: "Cần xin cấp quyền tại trang Quản lý ứng dụng",
    [-1404]: "Cần cập nhật zalo để sử dụng các api mới",
    [-1408]: "Hết thời gian chờ. Vui lòng thử lại sau.",
    [-2000]: "Lỗi không xác định. Vui lòng thử lại sau.",
    [-2001]: "Id truyền vào api không hợp lệ",
    [-2002]: "Bạn đã từ chối cấp quyền trước đó và không muốn hỏi lại."
  };

  return errorMessages[errorCode] || "Lỗi không xác định. Vui lòng thử lại sau.";
}