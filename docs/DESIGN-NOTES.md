
# Ghi chú thiết kế — phạm vi đã thu gọn

Lý do thu gọn: đề thi thực hành tại chỗ do giảng viên ra dựa trên code của nhóm, và chỉ một bạn ngẫu nhiên vào phòng. Code ít và rõ thì bạn nào cũng sửa được trong 45 phút.

## Đã cắt (không làm)

| Hạng mục                                                                                                                                       | Lý do                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Bình luận ở `/tasks/$taskId`                                                                                                                | Không có trong kịch bản kiểm chứng hay bảng phủ kỹ thuật                                  |
| `labels` của task                                                                                                                             | Chỉ để trang trí bảng; bớt một trường trong schema, mock và `TaskList`                  |
| Nhiều biểu đồ ở `/analytics`                                                                                                              | Giữ **một** biểu đồ recharts để số liệu bundle trước/sau tách chunk có ý nghĩa |
| `Sidebar` và mọi mục ngoài phạm vi Figma (Backlog, Git Activity, Velocity, Rollback Logs, Export CSV, đổi kiểu xem, Ctrl+K, sparkline) | Không chức năng, không điểm                                                                   |
| Công tắc đổi vai ở header                                                                                                                   | Vai trò chỉ chọn ở `/login`, header chỉ hiển thị                                           |
| `completionRate` trong API thống kê                                                                                                          | Suy ra được (`done / total`), tính khi render                                                 |

## Giữ lại (dễ trúng đề)

Lọc, tìm kiếm, phân trang (`queryKey` theo `searchParams`) · mutation đổi trạng thái (optimistic update, rollback) · form tạo task (RHF + Zod) · `useDebouncedValue` · Error Boundary · `React.lazy` cho `/analytics`.

## Endpoint (MSW)

| Method | Đường dẫn                         | Mô tả                                                         | Query key                                    |
| ------ | ------------------------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| GET    | `/api/tasks?q&status&priority&page` | Danh sách đã lọc, `PAGE_SIZE` = 6 → `{ items, total }` | `['tasks', searchParams]`                  |
| GET    | `/api/tasks/stats`                  | `{ total, byStatus, byPriority }`                             | `['task-stats']`                           |
| GET    | `/api/tasks/:id`                    | Chi tiết một task                                             | `['task', taskId]`                         |
| POST   | `/api/tasks`                        | Tạo task (body theo `CreateTaskFormSchema`) → 201           | invalidate `['tasks']`, `['task-stats']` |
| PATCH  | `/api/tasks/:id/status`             | Body `{ status }` → task đã cập nhật                     | optimistic, rollback, invalidate cả ba key  |

Lưu ý khi viết `handlers.ts`:

- Khai báo `/api/tasks/stats` **trước** `/api/tasks/:id`, nếu không `stats` bị hiểu là một `id`.
- Logic lọc đặt trong **một hàm thuần** (ví dụ `filterTasks(tasks, params)`), để thêm tiêu chí mới trong đề thi chỉ sửa một chỗ.
- Công tắc **Simulate Network Error (500)** là client state. `api/client.ts` giữ một biến cờ (có hàm `setSimulateError(bool)` do Navbar gọi) và gắn header `x-simulate-error: 1` vào request. Handler chỉ trả 500 cho **POST và PATCH** khi thấy header này, để danh sách và thống kê vẫn tải được sau khi rollback.

## Số liệu hiển thị (derived state, không lưu)

- Tỉ lệ hoàn thành = `byStatus.done / total` (tính khi render, làm tròn một chữ số).
- Chữ viết tắt avatar = chữ cái đầu của hai từ đầu trong `assignee`.
