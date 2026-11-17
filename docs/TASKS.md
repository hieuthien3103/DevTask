# Giao việc — DevTask (nhóm 4 người)

Công nghệ: **React 19 + Vite + TanStack**. Trọng tâm chấm điểm: phân biệt client state và server state, hiểu cache của TanStack Query. Xem thêm `CLAUDE.md` và `README.md`[cite: 7].

Giao diện lấy từ Figma: https://www.figma.com/design/pSoVkaqFSnIIB0KtDXDIOM (5 frame: `/tasks`, `/analytics`, modal tạo task, `/tasks/$taskId`, `/login`). Token màu và font nằm trong `src/index.css`[cite: 7].

## 1. Phân công

|           | Thành viên      | Vai trò                                      | Nhánh làm việc                    |
| --------- | ----------------- | --------------------------------------------- | ------------------------------------ |
| Người 1 | _(điền tên)_ | Dữ liệu, mock API, kiểm thử               | `feat/data-mock-tests`[cite: 7]    |
| Người 2 | _(điền tên)_ | Server state và cache                        | `feat/server-state`[cite: 7]       |
| Người 3 | _(điền tên)_ | Router, URL state, auth, khung điều hướng | `feat/routing-auth-shell`[cite: 7] |
| Người 4 | _(điền tên)_ | Thành phần giao diện, form, tối ưu       | `feat/ui-form-perf`[cite: 7]       |

## 2. Nguyên tắc dựng giao diện (đọc trước khi code)

Để giao diện không đụng vào phần của người khác, mọi thành phần chia làm hai loại[cite: 7]:

- **Thuần hiển thị** (`components/ui/*`): chỉ nhận props, không gọi hook dữ liệu, không dùng router. Người 4 làm. Dùng dữ liệu cứng để dựng và kiểm tra[cite: 7].
- **Nối dữ liệu và hành vi**: người sở hữu file gọi hook (Người 2), router/URL (Người 3) rồi truyền props xuống thành phần thuần hiển thị[cite: 7].

Các quyết định tạm thời cho giao diện (đổi được nếu cả nhóm đồng ý):

- Các mục ngoài phạm vi trong thiết kế (Backlog, Git Activity, Velocity & Metrics, Rollback Logs, Configuration, Export CSV, nút đổi kiểu xem, Ctrl+K, Assignee Presence, sparkline) chỉ **làm tĩnh, không chức năng**, hoặc bỏ. Không thêm tính năng ngoài danh sách trong `CLAUDE.md`[cite: 7].
- Dùng **font Inter** cho toàn bộ (thiết kế gốc có chỗ rơi về font có chân do thiếu font)[cite: 7].
- Icon: **SVG nội tuyến**, không thêm thư viện icon khi nhóm chưa đồng ý[cite: 7].
- Vai trò người dùng (`Developer` / `Tech Lead`): chỉ chọn cố định một chỗ tại màn hình `/login` và lưu trong `AuthContext` (`localStorage`); bỏ công tắc đổi vai trò trên header[cite: 7].

## 3. Thứ tự làm việc

1. **Giai đoạn 1 — Hợp đồng dữ liệu (Người 1 làm trước):** đẩy `schemas/task.schema.ts`, `types/task.ts` và danh sách endpoint lên `main`. Schema phải có đủ trường mà giao diện hiển thị (xem Người 1). Ba người còn lại không chờ không: Người 3 dựng khung header, sidebar và route, Người 4 dựng thành phần thuần hiển thị với dữ liệu cứng, Người 2 phác hàm tạo `queryKey`[cite: 7].
2. **Giai đoạn 2 — Làm song song** theo checklist từng người ở mục 4[cite: 7].
3. **Giai đoạn 3 — Ghép:** nối thành phần thuần hiển thị (Người 4) với hook (Người 2) và route (Người 3). Cả nhóm chạy các kịch bản ở `README.md` mục 6[cite: 7].
4. **Giai đoạn 4 — Hoàn thiện:** chụp minh chứng, đo bundle, chạy test, viết báo cáo, đối chiếu danh sách kiểm trước khi nộp trong `CLAUDE.md` mục 13[cite: 7].

## 4. Nhiệm vụ chi tiết

### Người 1 — Dữ liệu, mock API, kiểm thử

File sở hữu: `src/schemas/task.schema.ts`, `src/types/task.ts`, `src/api/*`, `src/mocks/*`, `src/utils/taskFilters.ts`, `src/tests/*`, phần Vitest trong `vite.config.ts`[cite: 7].

- [ ] Zod schema `Task` có **đủ trường mà giao diện hiển thị**: mã (ví dụ `DEV-101`), tiêu đề, mô tả, nhãn (`labels`), người được giao (tên và chữ viết tắt/màu avatar), trạng thái, độ ưu tiên, hạn chót[cite: 7]
- [ ] Zod schema `CreateTaskForm`, `TaskSearchParams`; kiểu TypeScript suy ra từ Zod[cite: 7]
- [ ] Chốt danh sách endpoint và ghi vào `docs/DESIGN-NOTES.md`, **gồm endpoint thống kê** (số task theo trạng thái, theo độ ưu tiên, tổng, % hoàn thành) để cấp số cho panel Filters, thẻ KPI và biểu đồ `/analytics`[cite: 7]
- [ ] `mocks/db.ts`: dữ liệu mẫu đủ các trường trên, đồng bộ `sessionStorage` (F5 không mất dữ liệu)[cite: 7]
- [ ] Tách hàm thuần `filterTasks(tasks, params)` trong `src/utils/taskFilters.ts` (hoặc export từ `src/mocks/handlers.ts`) để dùng chung logic tìm kiếm, lọc và phân trang, giúp cả nhóm dễ đọc và dễ mở rộng tiêu chí lọc khi thi thực hành tại chỗ
- [ ] `mocks/handlers.ts`: REST endpoint (danh sách có lọc, tìm kiếm, phân trang; chi tiết; tạo; đổi trạng thái; thống kê), độ trễ mạng, trả lỗi 500 cho các request ghi (`POST`, `PATCH`) khi công tắc **Simulate Network Error (500)** bật[cite: 7]
- [ ] `mocks/browser.ts` và `mocks/server.ts`; `main.tsx` bật MSW trước khi mount[cite: 7]
- [ ] `api/client.ts` (fetch wrapper, `VITE_API_BASE_URL`, xử lý lỗi HTTP) và `api/tasks.api.ts`[cite: 7]
- [ ] Test: `useDebouncedValue.test.ts` (phối hợp Người 3), `tasks.integration.test.tsx` (tải danh sách, tạo task)[cite: 7]
- [ ] Minh chứng: kết quả `npm run test`, log MSW ca 200 và ca 500[cite: 7]

### Người 2 — Server state và cache

File sở hữu: `src/App.tsx` (QueryClient), `src/hooks/useTaskQueries.ts`, `src/components/tasks/TaskStatsSummary.tsx`[cite: 7].

- [ ] `QueryClient` với `staleTime: 30_000`, `gcTime: 300_000`[cite: 7]
- [ ] Hàm/đối tượng `queryKey` tập trung: `['tasks', searchParams]`, `['task', taskId]`, `['task-stats']`[cite: 7]
- [ ] `useTasksQuery`, `useTaskQuery`, `useTaskStatsQuery`, `useCreateTaskMutation`, `useUpdateTaskStatusMutation`[cite: 7]
- [ ] Mutation đổi trạng thái: `onMutate` (cancelQueries, lưu bản chụp, `setQueryData`), `onError` (rollback), `onSettled` (invalidate `['tasks']`, `['task', taskId]`, và `['task-stats']` vì số đếm đổi theo trạng thái)[cite: 7]
- [ ] Mỗi lần `invalidateQueries`/`setQueryData` có một dòng chú thích nêu lý do[cite: 7]
- [ ] `TaskStatsSummary`: 4 thẻ KPI (Total Tasks, Completion Rate, In Progress, Simulated Errors) dùng `KpiCard` của Người 4. Ba thẻ đầu lấy từ `useTaskStatsQuery` và tính trực tiếp khi render (derived state, không `useState`). Thẻ Simulated Errors đọc công tắc lỗi 500 từ client state, **không** từ server[cite: 7]
- [ ] Minh chứng: ảnh Network và React Query Devtools (tươi, cũ, bị xóa); mutation ca thành công và ca lỗi 500 với rollback; ảnh số đếm cập nhật sau mutation[cite: 7]

### Người 3 — Router, URL state, auth, khung điều hướng

File sở hữu: `src/routes/*` (trừ `analytics.tsx`), `src/context/AuthContext.tsx`, `src/hooks/useDebouncedValue.ts`, `src/components/tasks/TaskFilterBar.tsx`, `src/components/common/Navbar.tsx` (header), `src/components/common/Sidebar.tsx`[cite: 7].

- [ ] `AuthContext`: lưu phiên đăng nhập và vai trò (`Developer` / `Tech Lead`) chọn tại `/login` vào `localStorage`; quản lý state công tắc giả lập lỗi 500
- [ ] `__root.tsx`, `index.tsx` (chuyển hướng), `login.tsx` (chọn Developer hoặc Tech Lead, theo frame `/login`)[cite: 7]
- [ ] `_authenticated.tsx`: kiểm tra đăng nhập trong `beforeLoad`; bố cục có header cố định và sidebar trái 240px[cite: 7]
- [ ] `Navbar` (header): logo, Tasks/Analytics, công tắc **Simulate Network Error (500)**, thông tin người dùng và vai trò hiện tại, Sign Out[cite: 7]
- [ ] `Sidebar`: mục điều hướng tĩnh theo thiết kế (không chức năng nếu ngoài phạm vi)[cite: 7]
- [ ] `tasks.index.tsx`: `validateSearch` bằng Zod cho `q`, `status`, `priority`, `page`[cite: 7]
- [ ] `tasks.$taskId.tsx`: route chi tiết và đổi trạng thái, nối hook của Người 2[cite: 7]
- [ ] `useDebouncedValue`: `useEffect` + `clearTimeout`; giải thích vì sao StrictMode chạy effect hai lần[cite: 7]
- [ ] `TaskFilterBar`: ô tìm kiếm có debounce và panel lọc Status/Priority đồng bộ URL (không lưu vào `useState`); hiển thị số đếm lấy từ hook của Người 2[cite: 7]
- [ ] Minh chứng: F5 giữ nguyên bộ lọc; truy cập `/tasks` khi chưa đăng nhập bị chặn; ảnh URL đổi theo bộ lọc[cite: 7]

### Người 4 — Thành phần giao diện, form, tối ưu

File sở hữu: `src/index.css` (token), `src/components/ui/*` (Avatar, StatusPill, PriorityBadge, KpiCard, Pagination), `src/components/tasks/TaskList.tsx`, `CreateTaskModal.tsx`, `src/components/common/ErrorBoundary.tsx`, `LoadingSkeleton.tsx`, `src/routes/_authenticated/analytics.tsx`[cite: 7].

- [ ] `index.css`: token màu, bo góc, bóng, font Inter theo Figma[cite: 7]
- [ ] Thành phần thuần hiển thị trong `components/ui/`: `Avatar`, `StatusPill`, `PriorityBadge`, `KpiCard`, `Pagination` (chỉ nhận props, có dữ liệu cứng để xem trước)[cite: 7]
- [ ] `TaskList`: bảng theo thiết kế (mã, tiêu đề và nhãn, người được giao, trạng thái, độ ưu tiên, hạn chót, hành động); props một chiều, `key={task.id}` (có thể dùng chung hàm thuần `filterTasks` nếu cần xử lý hiển thị cục bộ)[cite: 7]
- [ ] `CreateTaskModal`: React Hook Form + Zod, báo lỗi từng ô (theo frame modal)[cite: 7]
- [ ] `LoadingSkeleton` cho trạng thái đang tải; trạng thái rỗng và lỗi[cite: 7]
- [ ] `ErrorBoundary` bọc vùng nội dung chính, có nút khôi phục và nút gây lỗi render để kiểm thử[cite: 7]
- [ ] `analytics.tsx`: `React.lazy` cho trang và thư viện biểu đồ, bọc `Suspense`; hiển thị **một biểu đồ Recharts** duy nhất (ví dụ số task theo trạng thái) dùng lại dữ liệu từ query `['task-stats']`
- [ ] `rollup-plugin-visualizer`: đo kích thước bundle trước và sau khi tách[cite: 7]
- [ ] Dùng Profiler tìm một re-render không cần thiết và sửa, hoặc ghi rõ vì sao không cần `useMemo`/`useCallback`[cite: 7]
- [ ] Minh chứng: ảnh Error Boundary cô lập lỗi (header vẫn hoạt động); số liệu bundle trước và sau; ảnh Profiler[cite: 7]

### Ranh giới chồng lấn (tránh sửa file của nhau)

| Phần trong thiết kế          | Làm phần nhìn                 | Nối dữ liệu/hành vi                                                 |
| ------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| Header, Sidebar                 | Người 3[cite: 7]               | Người 3[cite: 7]                                                      |
| Panel Filters và ô tìm kiếm | Người 3[cite: 7]               | Người 3 (số đếm: hook của Người 2)[cite: 7]                     |
| Thẻ KPI                        | Người 4 (`KpiCard`)[cite: 7] | Người 2 (`TaskStatsSummary`)[cite: 7]                               |
| Bảng task, phân trang, pill   | Người 4[cite: 7]               | Route của Người 3 truyền dữ liệu từ hook của Người 2[cite: 7] |
| Modal tạo task                 | Người 4[cite: 7]               | Người 4 gọi mutation của Người 2[cite: 7]                         |

Cần sửa file của người khác thì nhắn người đó hoặc mở PR cho họ duyệt[cite: 7].

## 5. Phần chung của cả nhóm

- [ ] Cập nhật bảng phủ kỹ thuật trong `README.md`: mỗi người sửa dòng của mình, trỏ tới file hoặc commit thật[cite: 7]
- [ ] `docs/EVIDENCE.md`: mỗi người một mục minh chứng của mình[cite: 7]
- [ ] `npm run build` và `npm run preview` chạy được; ghi `README.md` phiên bản đúng với `package.json`[cite: 7]
- [ ] Báo cáo, phân công người viết:
  - Người 1: MSW và kiểm thử[cite: 7]
  - Người 2: cache, mutation, so sánh TanStack Query với Redux Toolkit/RTK Query[cite: 7]
  - Người 3: Router, URL state, client state, vòng đời effect[cite: 7]
  - Người 4: Vite dev so với build và preview, so sánh với Next.js, **ít nhất 2 trường hợp không nên dùng React** (rút ra từ trải nghiệm làm DevTask, không viết chung chung)[cite: 7]
- [ ] Mọi người trả lời được các câu hỏi tự kiểm trong `CLAUDE.md` mục 10, kể cả phần không phải của mình[cite: 7]

## 6. Quy tắc làm việc

- Mỗi tính năng một nhánh `feat/<tên>`, merge vào `main` bằng Pull Request. **Người khác review**, không tự duyệt PR của mình[cite: 7].
- Commit theo `feat:`, `fix:`, `test:`, `docs:`, `chore:`. Mỗi dòng bảng phủ kỹ thuật có ít nhất một commit tương ứng[cite: 7].
- `routeTree.gen.ts` là file tự sinh. Khi xung đột, không sửa tay: lấy bản của `main`, rồi chạy `npm run dev` để sinh lại[cite: 7].
- Không thêm thư viện mới (kể cả thư viện icon) khi chưa báo nhóm. Không tự gọi `fetch` trong component hay `useEffect`; mọi lời gọi API nằm ở `src/api/`, component chỉ dùng hook[cite: 7].
- Thành phần trong `components/ui/` không được import hook dữ liệu hay router[cite: 7].
- Trước khi nhờ AI viết code, dán `CLAUDE.md` vào cuộc trò chuyện. Không nộp đoạn code mà bản thân không giải thích được[cite: 7].
- Gặp xung đột hoặc bị kẹt quá nửa buổi thì báo nhóm, đừng tự chịu[cite: 7].

## 7. Mốc kiểm tra

| Mốc                           | Điều kiện đạt                                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hợp đồng dữ liệu xong     | Schema (đủ trường giao diện cần), types, danh sách endpoint gồm endpoint thống kê đã ở `main`[cite: 7]                                 |
| Mỗi lớp chạy riêng được | Mock chạy, hook chạy với MSW, route và khung header/sidebar chuyển được, thành phần `ui/` hiển thị đúng với dữ liệu cứng[cite: 7] |
| Ghép xong                     | Cả 5 kịch bản kiểm chứng trong `README.md` mục 6 đều chạy đúng                                                                           |
| Sẵn sàng nộp                | Mọi mục trong danh sách kiểm ở `CLAUDE.md` mục 13 đã đánh dấu[cite: 7]                                                                   |

## Phụ lục — tạo thêm file cho phần giao diện

Chạy trong thư mục gốc dự án:

```bash
mkdir -p src/components/ui src/utils
touch src/components/ui/{Avatar,StatusPill,PriorityBadge,KpiCard,Pagination}.tsx \
      src/components/common/Sidebar.tsx \
      src/utils/taskFilters.ts
```

# Giao việc — DevTask (nhóm 4 người)

Công nghệ: **React 19 + Vite + TanStack**. Trọng tâm chấm điểm: phân biệt client state và server state, hiểu cache của TanStack Query. Xem thêm `CLAUDE.md` và `README.md`[cite: 7].

Giao diện lấy từ Figma: https://www.figma.com/design/pSoVkaqFSnIIB0KtDXDIOM (5 frame: `/tasks`, `/analytics`, modal tạo task, `/tasks/$taskId`, `/login`). Token màu và font nằm trong `src/index.css`[cite: 7].

## 1. Phân công

|           | Thành viên      | Vai trò                                      | Nhánh làm việc                    |
| --------- | ----------------- | --------------------------------------------- | ------------------------------------ |
| Người 1 | _(điền tên)_ | Dữ liệu, mock API, kiểm thử               | `feat/data-mock-tests`[cite: 7]    |
| Người 2 | _(điền tên)_ | Server state và cache                        | `feat/server-state`[cite: 7]       |
| Người 3 | _(điền tên)_ | Router, URL state, auth, khung điều hướng | `feat/routing-auth-shell`[cite: 7] |
| Người 4 | _(điền tên)_ | Thành phần giao diện, form, tối ưu       | `feat/ui-form-perf`[cite: 7]       |

## 2. Nguyên tắc dựng giao diện (đọc trước khi code)

Để giao diện không đụng vào phần của người khác, mọi thành phần chia làm hai loại[cite: 7]:

- **Thuần hiển thị** (`components/ui/*`): chỉ nhận props, không gọi hook dữ liệu, không dùng router. Người 4 làm. Dùng dữ liệu cứng để dựng và kiểm tra[cite: 7].
- **Nối dữ liệu và hành vi**: người sở hữu file gọi hook (Người 2), router/URL (Người 3) rồi truyền props xuống thành phần thuần hiển thị[cite: 7].

Các quyết định tạm thời cho giao diện (đổi được nếu cả nhóm đồng ý):

- Các mục ngoài phạm vi trong thiết kế (Backlog, Git Activity, Velocity & Metrics, Rollback Logs, Configuration, Export CSV, nút đổi kiểu xem, Ctrl+K, Assignee Presence, sparkline) chỉ **làm tĩnh, không chức năng**, hoặc bỏ. Không thêm tính năng ngoài danh sách trong `CLAUDE.md`[cite: 7].
- Dùng **font Inter** cho toàn bộ (thiết kế gốc có chỗ rơi về font có chân do thiếu font)[cite: 7].
- Icon: **SVG nội tuyến**, không thêm thư viện icon khi nhóm chưa đồng ý[cite: 7].
- Vai trò người dùng (`Developer` / `Tech Lead`): chỉ chọn cố định một chỗ tại màn hình `/login` và lưu trong `AuthContext` (`localStorage`); bỏ công tắc đổi vai trò trên header[cite: 7].

## 3. Thứ tự làm việc

1. **Giai đoạn 1 — Hợp đồng dữ liệu (Người 1 làm trước):** đẩy `schemas/task.schema.ts`, `types/task.ts` và danh sách endpoint lên `main`. Schema phải có đủ trường mà giao diện hiển thị (xem Người 1). Ba người còn lại không chờ không: Người 3 dựng khung header, sidebar và route, Người 4 dựng thành phần thuần hiển thị với dữ liệu cứng, Người 2 phác hàm tạo `queryKey`[cite: 7].
2. **Giai đoạn 2 — Làm song song** theo checklist từng người ở mục 4[cite: 7].
3. **Giai đoạn 3 — Ghép:** nối thành phần thuần hiển thị (Người 4) với hook (Người 2) và route (Người 3). Cả nhóm chạy các kịch bản ở `README.md` mục 6[cite: 7].
4. **Giai đoạn 4 — Hoàn thiện:** chụp minh chứng, đo bundle, chạy test, viết báo cáo, đối chiếu danh sách kiểm trước khi nộp trong `CLAUDE.md` mục 13[cite: 7].

## 4. Nhiệm vụ chi tiết

### Người 1 — Dữ liệu, mock API, kiểm thử

File sở hữu: `src/schemas/task.schema.ts`, `src/types/task.ts`, `src/api/*`, `src/mocks/*`, `src/utils/taskFilters.ts`, `src/tests/*`, phần Vitest trong `vite.config.ts`[cite: 7].

- [ ] Zod schema `Task` có **đủ trường mà giao diện hiển thị**: mã (ví dụ `DEV-101`), tiêu đề, mô tả, nhãn (`labels`), người được giao (tên và chữ viết tắt/màu avatar), trạng thái, độ ưu tiên, hạn chót[cite: 7]
- [ ] Zod schema `CreateTaskForm`, `TaskSearchParams`; kiểu TypeScript suy ra từ Zod[cite: 7]
- [ ] Chốt danh sách endpoint và ghi vào `docs/DESIGN-NOTES.md`, **gồm endpoint thống kê** (số task theo trạng thái, theo độ ưu tiên, tổng, % hoàn thành) để cấp số cho panel Filters, thẻ KPI và biểu đồ `/analytics`[cite: 7]
- [ ] `mocks/db.ts`: dữ liệu mẫu đủ các trường trên, đồng bộ `sessionStorage` (F5 không mất dữ liệu)[cite: 7]
- [ ] Tách hàm thuần `filterTasks(tasks, params)` trong `src/utils/taskFilters.ts` (hoặc export từ `src/mocks/handlers.ts`) để dùng chung logic tìm kiếm, lọc và phân trang, giúp cả nhóm dễ đọc và dễ mở rộng tiêu chí lọc khi thi thực hành tại chỗ
- [ ] `mocks/handlers.ts`: REST endpoint (danh sách có lọc, tìm kiếm, phân trang; chi tiết; tạo; đổi trạng thái; thống kê), độ trễ mạng, trả lỗi 500 cho các request ghi (`POST`, `PATCH`) khi công tắc **Simulate Network Error (500)** bật[cite: 7]
- [ ] `mocks/browser.ts` và `mocks/server.ts`; `main.tsx` bật MSW trước khi mount[cite: 7]
- [ ] `api/client.ts` (fetch wrapper, `VITE_API_BASE_URL`, xử lý lỗi HTTP) và `api/tasks.api.ts`[cite: 7]
- [ ] Test: `useDebouncedValue.test.ts` (phối hợp Người 3), `tasks.integration.test.tsx` (tải danh sách, tạo task)[cite: 7]
- [ ] Minh chứng: kết quả `npm run test`, log MSW ca 200 và ca 500[cite: 7]

### Người 2 — Server state và cache

File sở hữu: `src/App.tsx` (QueryClient), `src/hooks/useTaskQueries.ts`, `src/components/tasks/TaskStatsSummary.tsx`[cite: 7].

- [ ] `QueryClient` với `staleTime: 30_000`, `gcTime: 300_000`[cite: 7]
- [ ] Hàm/đối tượng `queryKey` tập trung: `['tasks', searchParams]`, `['task', taskId]`, `['task-stats']`[cite: 7]
- [ ] `useTasksQuery`, `useTaskQuery`, `useTaskStatsQuery`, `useCreateTaskMutation`, `useUpdateTaskStatusMutation`[cite: 7]
- [ ] Mutation đổi trạng thái: `onMutate` (cancelQueries, lưu bản chụp, `setQueryData`), `onError` (rollback), `onSettled` (invalidate `['tasks']`, `['task', taskId]`, và `['task-stats']` vì số đếm đổi theo trạng thái)[cite: 7]
- [ ] Mỗi lần `invalidateQueries`/`setQueryData` có một dòng chú thích nêu lý do[cite: 7]
- [ ] `TaskStatsSummary`: 4 thẻ KPI (Total Tasks, Completion Rate, In Progress, Simulated Errors) dùng `KpiCard` của Người 4. Ba thẻ đầu lấy từ `useTaskStatsQuery` và tính trực tiếp khi render (derived state, không `useState`). Thẻ Simulated Errors đọc công tắc lỗi 500 từ client state, **không** từ server[cite: 7]
- [ ] Minh chứng: ảnh Network và React Query Devtools (tươi, cũ, bị xóa); mutation ca thành công và ca lỗi 500 với rollback; ảnh số đếm cập nhật sau mutation[cite: 7]

### Người 3 — Router, URL state, auth, khung điều hướng

File sở hữu: `src/routes/*` (trừ `analytics.tsx`), `src/context/AuthContext.tsx`, `src/hooks/useDebouncedValue.ts`, `src/components/tasks/TaskFilterBar.tsx`, `src/components/common/Navbar.tsx` (header), `src/components/common/Sidebar.tsx`[cite: 7].

- [ ] `AuthContext`: lưu phiên đăng nhập và vai trò (`Developer` / `Tech Lead`) chọn tại `/login` vào `localStorage`; quản lý state công tắc giả lập lỗi 500
- [ ] `__root.tsx`, `index.tsx` (chuyển hướng), `login.tsx` (chọn Developer hoặc Tech Lead, theo frame `/login`)[cite: 7]
- [ ] `_authenticated.tsx`: kiểm tra đăng nhập trong `beforeLoad`; bố cục có header cố định và sidebar trái 240px[cite: 7]
- [ ] `Navbar` (header): logo, Tasks/Analytics, công tắc **Simulate Network Error (500)**, thông tin người dùng và vai trò hiện tại, Sign Out[cite: 7]
- [ ] `Sidebar`: mục điều hướng tĩnh theo thiết kế (không chức năng nếu ngoài phạm vi)[cite: 7]
- [ ] `tasks.index.tsx`: `validateSearch` bằng Zod cho `q`, `status`, `priority`, `page`[cite: 7]
- [ ] `tasks.$taskId.tsx`: route chi tiết và đổi trạng thái, nối hook của Người 2[cite: 7]
- [ ] `useDebouncedValue`: `useEffect` + `clearTimeout`; giải thích vì sao StrictMode chạy effect hai lần[cite: 7]
- [ ] `TaskFilterBar`: ô tìm kiếm có debounce và panel lọc Status/Priority đồng bộ URL (không lưu vào `useState`); hiển thị số đếm lấy từ hook của Người 2[cite: 7]
- [ ] Minh chứng: F5 giữ nguyên bộ lọc; truy cập `/tasks` khi chưa đăng nhập bị chặn; ảnh URL đổi theo bộ lọc[cite: 7]

### Người 4 — Thành phần giao diện, form, tối ưu

File sở hữu: `src/index.css` (token), `src/components/ui/*` (Avatar, StatusPill, PriorityBadge, KpiCard, Pagination), `src/components/tasks/TaskList.tsx`, `CreateTaskModal.tsx`, `src/components/common/ErrorBoundary.tsx`, `LoadingSkeleton.tsx`, `src/routes/_authenticated/analytics.tsx`[cite: 7].

- [ ] `index.css`: token màu, bo góc, bóng, font Inter theo Figma[cite: 7]
- [ ] Thành phần thuần hiển thị trong `components/ui/`: `Avatar`, `StatusPill`, `PriorityBadge`, `KpiCard`, `Pagination` (chỉ nhận props, có dữ liệu cứng để xem trước)[cite: 7]
- [ ] `TaskList`: bảng theo thiết kế (mã, tiêu đề và nhãn, người được giao, trạng thái, độ ưu tiên, hạn chót, hành động); props một chiều, `key={task.id}` (có thể dùng chung hàm thuần `filterTasks` nếu cần xử lý hiển thị cục bộ)[cite: 7]
- [ ] `CreateTaskModal`: React Hook Form + Zod, báo lỗi từng ô (theo frame modal)[cite: 7]
- [ ] `LoadingSkeleton` cho trạng thái đang tải; trạng thái rỗng và lỗi[cite: 7]
- [ ] `ErrorBoundary` bọc vùng nội dung chính, có nút khôi phục và nút gây lỗi render để kiểm thử[cite: 7]
- [ ] `analytics.tsx`: `React.lazy` cho trang và thư viện biểu đồ, bọc `Suspense`; hiển thị **một biểu đồ Recharts** duy nhất (ví dụ số task theo trạng thái) dùng lại dữ liệu từ query `['task-stats']`
- [ ] `rollup-plugin-visualizer`: đo kích thước bundle trước và sau khi tách[cite: 7]
- [ ] Dùng Profiler tìm một re-render không cần thiết và sửa, hoặc ghi rõ vì sao không cần `useMemo`/`useCallback`[cite: 7]
- [ ] Minh chứng: ảnh Error Boundary cô lập lỗi (header vẫn hoạt động); số liệu bundle trước và sau; ảnh Profiler[cite: 7]

### Ranh giới chồng lấn (tránh sửa file của nhau)

| Phần trong thiết kế          | Làm phần nhìn                 | Nối dữ liệu/hành vi                                                 |
| ------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| Header, Sidebar                 | Người 3[cite: 7]               | Người 3[cite: 7]                                                      |
| Panel Filters và ô tìm kiếm | Người 3[cite: 7]               | Người 3 (số đếm: hook của Người 2)[cite: 7]                     |
| Thẻ KPI                        | Người 4 (`KpiCard`)[cite: 7] | Người 2 (`TaskStatsSummary`)[cite: 7]                               |
| Bảng task, phân trang, pill   | Người 4[cite: 7]               | Route của Người 3 truyền dữ liệu từ hook của Người 2[cite: 7] |
| Modal tạo task                 | Người 4[cite: 7]               | Người 4 gọi mutation của Người 2[cite: 7]                         |

Cần sửa file của người khác thì nhắn người đó hoặc mở PR cho họ duyệt[cite: 7].

## 5. Phần chung của cả nhóm

- [ ] Cập nhật bảng phủ kỹ thuật trong `README.md`: mỗi người sửa dòng của mình, trỏ tới file hoặc commit thật[cite: 7]
- [ ] `docs/EVIDENCE.md`: mỗi người một mục minh chứng của mình[cite: 7]
- [ ] `npm run build` và `npm run preview` chạy được; ghi `README.md` phiên bản đúng với `package.json`[cite: 7]
- [ ] Báo cáo, phân công người viết:
  - Người 1: MSW và kiểm thử[cite: 7]
  - Người 2: cache, mutation, so sánh TanStack Query với Redux Toolkit/RTK Query[cite: 7]
  - Người 3: Router, URL state, client state, vòng đời effect[cite: 7]
  - Người 4: Vite dev so với build và preview, so sánh với Next.js, **ít nhất 2 trường hợp không nên dùng React** (rút ra từ trải nghiệm làm DevTask, không viết chung chung)[cite: 7]
- [ ] Mọi người trả lời được các câu hỏi tự kiểm trong `CLAUDE.md` mục 10, kể cả phần không phải của mình[cite: 7]

## 6. Quy tắc làm việc

- Mỗi tính năng một nhánh `feat/<tên>`, merge vào `main` bằng Pull Request. **Người khác review**, không tự duyệt PR của mình[cite: 7].
- Commit theo `feat:`, `fix:`, `test:`, `docs:`, `chore:`. Mỗi dòng bảng phủ kỹ thuật có ít nhất một commit tương ứng[cite: 7].
- `routeTree.gen.ts` là file tự sinh. Khi xung đột, không sửa tay: lấy bản của `main`, rồi chạy `npm run dev` để sinh lại[cite: 7].
- Không thêm thư viện mới (kể cả thư viện icon) khi chưa báo nhóm. Không tự gọi `fetch` trong component hay `useEffect`; mọi lời gọi API nằm ở `src/api/`, component chỉ dùng hook[cite: 7].
- Thành phần trong `components/ui/` không được import hook dữ liệu hay router[cite: 7].
- Trước khi nhờ AI viết code, dán `CLAUDE.md` vào cuộc trò chuyện. Không nộp đoạn code mà bản thân không giải thích được[cite: 7].
- Gặp xung đột hoặc bị kẹt quá nửa buổi thì báo nhóm, đừng tự chịu[cite: 7].

## 7. Mốc kiểm tra

| Mốc                           | Điều kiện đạt                                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hợp đồng dữ liệu xong     | Schema (đủ trường giao diện cần), types, danh sách endpoint gồm endpoint thống kê đã ở `main`[cite: 7]                                 |
| Mỗi lớp chạy riêng được | Mock chạy, hook chạy với MSW, route và khung header/sidebar chuyển được, thành phần `ui/` hiển thị đúng với dữ liệu cứng[cite: 7] |
| Ghép xong                     | Cả 5 kịch bản kiểm chứng trong `README.md` mục 6 đều chạy đúng                                                                           |
| Sẵn sàng nộp                | Mọi mục trong danh sách kiểm ở `CLAUDE.md` mục 13 đã đánh dấu[cite: 7]                                                                   |

## Phụ lục — tạo thêm file cho phần giao diện

Chạy trong thư mục gốc dự án:

```bash
mkdir -p src/components/ui src/utils
touch src/components/ui/{Avatar,StatusPill,PriorityBadge,KpiCard,Pagination}.tsx \
      src/components/common/Sidebar.tsx \
      src/utils/taskFilters.ts
```

# Giao việc — DevTask (nhóm 4 người)

Công nghệ: **React 19 + Vite + TanStack**. Trọng tâm chấm điểm: phân biệt client state và server state, hiểu cache của TanStack Query. Xem thêm `CLAUDE.md` và `README.md`[cite: 7].

Giao diện lấy từ Figma: https://www.figma.com/design/pSoVkaqFSnIIB0KtDXDIOM (5 frame: `/tasks`, `/analytics`, modal tạo task, `/tasks/$taskId`, `/login`). Token màu và font nằm trong `src/index.css`[cite: 7].

## 1. Phân công

|           | Thành viên      | Vai trò                                      | Nhánh làm việc                    |
| --------- | ----------------- | --------------------------------------------- | ------------------------------------ |
| Người 1 | _(điền tên)_ | Dữ liệu, mock API, kiểm thử               | `feat/data-mock-tests`[cite: 7]    |
| Người 2 | _(điền tên)_ | Server state và cache                        | `feat/server-state`[cite: 7]       |
| Người 3 | _(điền tên)_ | Router, URL state, auth, khung điều hướng | `feat/routing-auth-shell`[cite: 7] |
| Người 4 | _(điền tên)_ | Thành phần giao diện, form, tối ưu       | `feat/ui-form-perf`[cite: 7]       |

## 2. Nguyên tắc dựng giao diện (đọc trước khi code)

Để giao diện không đụng vào phần của người khác, mọi thành phần chia làm hai loại[cite: 7]:

- **Thuần hiển thị** (`components/ui/*`): chỉ nhận props, không gọi hook dữ liệu, không dùng router. Người 4 làm. Dùng dữ liệu cứng để dựng và kiểm tra[cite: 7].
- **Nối dữ liệu và hành vi**: người sở hữu file gọi hook (Người 2), router/URL (Người 3) rồi truyền props xuống thành phần thuần hiển thị[cite: 7].

Các quyết định tạm thời cho giao diện (đổi được nếu cả nhóm đồng ý):

- Các mục ngoài phạm vi trong thiết kế (Backlog, Git Activity, Velocity & Metrics, Rollback Logs, Configuration, Export CSV, nút đổi kiểu xem, Ctrl+K, Assignee Presence, sparkline) chỉ **làm tĩnh, không chức năng**, hoặc bỏ. Không thêm tính năng ngoài danh sách trong `CLAUDE.md`[cite: 7].
- Dùng **font Inter** cho toàn bộ (thiết kế gốc có chỗ rơi về font có chân do thiếu font)[cite: 7].
- Icon: **SVG nội tuyến**, không thêm thư viện icon khi nhóm chưa đồng ý[cite: 7].
- Vai trò người dùng (`Developer` / `Tech Lead`): chỉ chọn cố định một chỗ tại màn hình `/login` và lưu trong `AuthContext` (`localStorage`); bỏ công tắc đổi vai trò trên header[cite: 7].

## 3. Thứ tự làm việc

1. **Giai đoạn 1 — Hợp đồng dữ liệu (Người 1 làm trước):** đẩy `schemas/task.schema.ts`, `types/task.ts` và danh sách endpoint lên `main`. Schema phải có đủ trường mà giao diện hiển thị (xem Người 1). Ba người còn lại không chờ không: Người 3 dựng khung header, sidebar và route, Người 4 dựng thành phần thuần hiển thị với dữ liệu cứng, Người 2 phác hàm tạo `queryKey`[cite: 7].
2. **Giai đoạn 2 — Làm song song** theo checklist từng người ở mục 4[cite: 7].
3. **Giai đoạn 3 — Ghép:** nối thành phần thuần hiển thị (Người 4) với hook (Người 2) và route (Người 3). Cả nhóm chạy các kịch bản ở `README.md` mục 6[cite: 7].
4. **Giai đoạn 4 — Hoàn thiện:** chụp minh chứng, đo bundle, chạy test, viết báo cáo, đối chiếu danh sách kiểm trước khi nộp trong `CLAUDE.md` mục 13[cite: 7].

## 4. Nhiệm vụ chi tiết

### Người 1 — Dữ liệu, mock API, kiểm thử

File sở hữu: `src/schemas/task.schema.ts`, `src/types/task.ts`, `src/api/*`, `src/mocks/*`, `src/utils/taskFilters.ts`, `src/tests/*`, phần Vitest trong `vite.config.ts`[cite: 7].

- [ ] Zod schema `Task` có **đủ trường mà giao diện hiển thị**: mã (ví dụ `DEV-101`), tiêu đề, mô tả, nhãn (`labels`), người được giao (tên và chữ viết tắt/màu avatar), trạng thái, độ ưu tiên, hạn chót[cite: 7]
- [ ] Zod schema `CreateTaskForm`, `TaskSearchParams`; kiểu TypeScript suy ra từ Zod[cite: 7]
- [ ] Chốt danh sách endpoint và ghi vào `docs/DESIGN-NOTES.md`, **gồm endpoint thống kê** (số task theo trạng thái, theo độ ưu tiên, tổng, % hoàn thành) để cấp số cho panel Filters, thẻ KPI và biểu đồ `/analytics`[cite: 7]
- [ ] `mocks/db.ts`: dữ liệu mẫu đủ các trường trên, đồng bộ `sessionStorage` (F5 không mất dữ liệu)[cite: 7]
- [ ] Tách hàm thuần `filterTasks(tasks, params)` trong `src/utils/taskFilters.ts` (hoặc export từ `src/mocks/handlers.ts`) để dùng chung logic tìm kiếm, lọc và phân trang, giúp cả nhóm dễ đọc và dễ mở rộng tiêu chí lọc khi thi thực hành tại chỗ
- [ ] `mocks/handlers.ts`: REST endpoint (danh sách có lọc, tìm kiếm, phân trang; chi tiết; tạo; đổi trạng thái; thống kê), độ trễ mạng, trả lỗi 500 cho các request ghi (`POST`, `PATCH`) khi công tắc **Simulate Network Error (500)** bật[cite: 7]
- [ ] `mocks/browser.ts` và `mocks/server.ts`; `main.tsx` bật MSW trước khi mount[cite: 7]
- [ ] `api/client.ts` (fetch wrapper, `VITE_API_BASE_URL`, xử lý lỗi HTTP) và `api/tasks.api.ts`[cite: 7]
- [ ] Test: `useDebouncedValue.test.ts` (phối hợp Người 3), `tasks.integration.test.tsx` (tải danh sách, tạo task)[cite: 7]
- [ ] Minh chứng: kết quả `npm run test`, log MSW ca 200 và ca 500[cite: 7]

### Người 2 — Server state và cache

File sở hữu: `src/App.tsx` (QueryClient), `src/hooks/useTaskQueries.ts`, `src/components/tasks/TaskStatsSummary.tsx`[cite: 7].

- [ ] `QueryClient` với `staleTime: 30_000`, `gcTime: 300_000`[cite: 7]
- [ ] Hàm/đối tượng `queryKey` tập trung: `['tasks', searchParams]`, `['task', taskId]`, `['task-stats']`[cite: 7]
- [ ] `useTasksQuery`, `useTaskQuery`, `useTaskStatsQuery`, `useCreateTaskMutation`, `useUpdateTaskStatusMutation`[cite: 7]
- [ ] Mutation đổi trạng thái: `onMutate` (cancelQueries, lưu bản chụp, `setQueryData`), `onError` (rollback), `onSettled` (invalidate `['tasks']`, `['task', taskId]`, và `['task-stats']` vì số đếm đổi theo trạng thái)[cite: 7]
- [ ] Mỗi lần `invalidateQueries`/`setQueryData` có một dòng chú thích nêu lý do[cite: 7]
- [ ] `TaskStatsSummary`: 4 thẻ KPI (Total Tasks, Completion Rate, In Progress, Simulated Errors) dùng `KpiCard` của Người 4. Ba thẻ đầu lấy từ `useTaskStatsQuery` và tính trực tiếp khi render (derived state, không `useState`). Thẻ Simulated Errors đọc công tắc lỗi 500 từ client state, **không** từ server[cite: 7]
- [ ] Minh chứng: ảnh Network và React Query Devtools (tươi, cũ, bị xóa); mutation ca thành công và ca lỗi 500 với rollback; ảnh số đếm cập nhật sau mutation[cite: 7]

### Người 3 — Router, URL state, auth, khung điều hướng

File sở hữu: `src/routes/*` (trừ `analytics.tsx`), `src/context/AuthContext.tsx`, `src/hooks/useDebouncedValue.ts`, `src/components/tasks/TaskFilterBar.tsx`, `src/components/common/Navbar.tsx` (header), `src/components/common/Sidebar.tsx`[cite: 7].

- [ ] `AuthContext`: lưu phiên đăng nhập và vai trò (`Developer` / `Tech Lead`) chọn tại `/login` vào `localStorage`; quản lý state công tắc giả lập lỗi 500
- [ ] `__root.tsx`, `index.tsx` (chuyển hướng), `login.tsx` (chọn Developer hoặc Tech Lead, theo frame `/login`)[cite: 7]
- [ ] `_authenticated.tsx`: kiểm tra đăng nhập trong `beforeLoad`; bố cục có header cố định và sidebar trái 240px[cite: 7]
- [ ] `Navbar` (header): logo, Tasks/Analytics, công tắc **Simulate Network Error (500)**, thông tin người dùng và vai trò hiện tại, Sign Out[cite: 7]
- [ ] `Sidebar`: mục điều hướng tĩnh theo thiết kế (không chức năng nếu ngoài phạm vi)[cite: 7]
- [ ] `tasks.index.tsx`: `validateSearch` bằng Zod cho `q`, `status`, `priority`, `page`[cite: 7]
- [ ] `tasks.$taskId.tsx`: route chi tiết và đổi trạng thái, nối hook của Người 2[cite: 7]
- [ ] `useDebouncedValue`: `useEffect` + `clearTimeout`; giải thích vì sao StrictMode chạy effect hai lần[cite: 7]
- [ ] `TaskFilterBar`: ô tìm kiếm có debounce và panel lọc Status/Priority đồng bộ URL (không lưu vào `useState`); hiển thị số đếm lấy từ hook của Người 2[cite: 7]
- [ ] Minh chứng: F5 giữ nguyên bộ lọc; truy cập `/tasks` khi chưa đăng nhập bị chặn; ảnh URL đổi theo bộ lọc[cite: 7]

### Người 4 — Thành phần giao diện, form, tối ưu

File sở hữu: `src/index.css` (token), `src/components/ui/*` (Avatar, StatusPill, PriorityBadge, KpiCard, Pagination), `src/components/tasks/TaskList.tsx`, `CreateTaskModal.tsx`, `src/components/common/ErrorBoundary.tsx`, `LoadingSkeleton.tsx`, `src/routes/_authenticated/analytics.tsx`[cite: 7].

- [ ] `index.css`: token màu, bo góc, bóng, font Inter theo Figma[cite: 7]
- [ ] Thành phần thuần hiển thị trong `components/ui/`: `Avatar`, `StatusPill`, `PriorityBadge`, `KpiCard`, `Pagination` (chỉ nhận props, có dữ liệu cứng để xem trước)[cite: 7]
- [ ] `TaskList`: bảng theo thiết kế (mã, tiêu đề và nhãn, người được giao, trạng thái, độ ưu tiên, hạn chót, hành động); props một chiều, `key={task.id}` (có thể dùng chung hàm thuần `filterTasks` nếu cần xử lý hiển thị cục bộ)[cite: 7]
- [ ] `CreateTaskModal`: React Hook Form + Zod, báo lỗi từng ô (theo frame modal)[cite: 7]
- [ ] `LoadingSkeleton` cho trạng thái đang tải; trạng thái rỗng và lỗi[cite: 7]
- [ ] `ErrorBoundary` bọc vùng nội dung chính, có nút khôi phục và nút gây lỗi render để kiểm thử[cite: 7]
- [ ] `analytics.tsx`: `React.lazy` cho trang và thư viện biểu đồ, bọc `Suspense`; hiển thị **một biểu đồ Recharts** duy nhất (ví dụ số task theo trạng thái) dùng lại dữ liệu từ query `['task-stats']`
- [ ] `rollup-plugin-visualizer`: đo kích thước bundle trước và sau khi tách[cite: 7]
- [ ] Dùng Profiler tìm một re-render không cần thiết và sửa, hoặc ghi rõ vì sao không cần `useMemo`/`useCallback`[cite: 7]
- [ ] Minh chứng: ảnh Error Boundary cô lập lỗi (header vẫn hoạt động); số liệu bundle trước và sau; ảnh Profiler[cite: 7]

### Ranh giới chồng lấn (tránh sửa file của nhau)

| Phần trong thiết kế          | Làm phần nhìn                 | Nối dữ liệu/hành vi                                                 |
| ------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| Header, Sidebar                 | Người 3[cite: 7]               | Người 3[cite: 7]                                                      |
| Panel Filters và ô tìm kiếm | Người 3[cite: 7]               | Người 3 (số đếm: hook của Người 2)[cite: 7]                     |
| Thẻ KPI                        | Người 4 (`KpiCard`)[cite: 7] | Người 2 (`TaskStatsSummary`)[cite: 7]                               |
| Bảng task, phân trang, pill   | Người 4[cite: 7]               | Route của Người 3 truyền dữ liệu từ hook của Người 2[cite: 7] |
| Modal tạo task                 | Người 4[cite: 7]               | Người 4 gọi mutation của Người 2[cite: 7]                         |

Cần sửa file của người khác thì nhắn người đó hoặc mở PR cho họ duyệt[cite: 7].

## 5. Phần chung của cả nhóm

- [ ] Cập nhật bảng phủ kỹ thuật trong `README.md`: mỗi người sửa dòng của mình, trỏ tới file hoặc commit thật[cite: 7]
- [ ] `docs/EVIDENCE.md`: mỗi người một mục minh chứng của mình[cite: 7]
- [ ] `npm run build` và `npm run preview` chạy được; ghi `README.md` phiên bản đúng với `package.json`[cite: 7]
- [ ] Báo cáo, phân công người viết:
  - Người 1: MSW và kiểm thử[cite: 7]
  - Người 2: cache, mutation, so sánh TanStack Query với Redux Toolkit/RTK Query[cite: 7]
  - Người 3: Router, URL state, client state, vòng đời effect[cite: 7]
  - Người 4: Vite dev so với build và preview, so sánh với Next.js, **ít nhất 2 trường hợp không nên dùng React** (rút ra từ trải nghiệm làm DevTask, không viết chung chung)[cite: 7]
- [ ] Mọi người trả lời được các câu hỏi tự kiểm trong `CLAUDE.md` mục 10, kể cả phần không phải của mình[cite: 7]

## 6. Quy tắc làm việc

- Mỗi tính năng một nhánh `feat/<tên>`, merge vào `main` bằng Pull Request. **Người khác review**, không tự duyệt PR của mình[cite: 7].
- Commit theo `feat:`, `fix:`, `test:`, `docs:`, `chore:`. Mỗi dòng bảng phủ kỹ thuật có ít nhất một commit tương ứng[cite: 7].
- `routeTree.gen.ts` là file tự sinh. Khi xung đột, không sửa tay: lấy bản của `main`, rồi chạy `npm run dev` để sinh lại[cite: 7].
- Không thêm thư viện mới (kể cả thư viện icon) khi chưa báo nhóm. Không tự gọi `fetch` trong component hay `useEffect`; mọi lời gọi API nằm ở `src/api/`, component chỉ dùng hook[cite: 7].
- Thành phần trong `components/ui/` không được import hook dữ liệu hay router[cite: 7].
- Trước khi nhờ AI viết code, dán `CLAUDE.md` vào cuộc trò chuyện. Không nộp đoạn code mà bản thân không giải thích được[cite: 7].
- Gặp xung đột hoặc bị kẹt quá nửa buổi thì báo nhóm, đừng tự chịu[cite: 7].

## 7. Mốc kiểm tra

| Mốc                           | Điều kiện đạt                                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hợp đồng dữ liệu xong     | Schema (đủ trường giao diện cần), types, danh sách endpoint gồm endpoint thống kê đã ở `main`[cite: 7]                                 |
| Mỗi lớp chạy riêng được | Mock chạy, hook chạy với MSW, route và khung header/sidebar chuyển được, thành phần `ui/` hiển thị đúng với dữ liệu cứng[cite: 7] |
| Ghép xong                     | Cả 5 kịch bản kiểm chứng trong `README.md` mục 6 đều chạy đúng                                                                           |
| Sẵn sàng nộp                | Mọi mục trong danh sách kiểm ở `CLAUDE.md` mục 13 đã đánh dấu[cite: 7]                                                                   |

## Phụ lục — tạo thêm file cho phần giao diện

Chạy trong thư mục gốc dự án:

```bash
mkdir -p src/components/ui src/utils
touch src/components/ui/{Avatar,StatusPill,PriorityBadge,KpiCard,Pagination}.tsx \
      src/components/common/Sidebar.tsx \
      src/utils/taskFilters.ts
```

# Giao việc — DevTask (nhóm 4 người)

Công nghệ: **React 19 + Vite + TanStack**. Trọng tâm chấm điểm: phân biệt client state và server state, hiểu cache của TanStack Query. Xem thêm `CLAUDE.md` và `README.md`.

Giao diện lấy từ Figma: https://www.figma.com/design/pSoVkaqFSnIIB0KtDXDIOM (5 frame: `/tasks`, `/analytics`, modal tạo task, `/tasks/$taskId`, `/login`). Token màu và font nằm trong `src/index.css`.

## 1. Phân công

|           | Thành viên      | Vai trò                                      | Nhánh làm việc           |
| --------- | ----------------- | --------------------------------------------- | --------------------------- |
| Người 1 | _(điền tên)_ | Dữ liệu, mock API, kiểm thử               | `feat/data-mock-tests`    |
| Người 2 | _(điền tên)_ | Server state và cache                        | `feat/server-state`       |
| Người 3 | _(điền tên)_ | Router, URL state, auth, khung điều hướng | `feat/routing-auth-shell` |
| Người 4 | _(điền tên)_ | Thành phần giao diện, form, tối ưu       | `feat/ui-form-perf`       |

## 2. Nguyên tắc dựng giao diện (đọc trước khi code)

Để giao diện không đụng vào phần của người khác, mọi thành phần chia làm hai loại:

- **Thuần hiển thị** (`components/ui/*`): chỉ nhận props, không gọi hook dữ liệu, không dùng router. Người 4 làm. Dùng dữ liệu cứng để dựng và kiểm tra.
- **Nối dữ liệu và hành vi**: người sở hữu file gọi hook (Người 2), router/URL (Người 3) rồi truyền props xuống thành phần thuần hiển thị.

Các quyết định tạm thời cho giao diện (đổi được nếu cả nhóm đồng ý):

- Các mục ngoài phạm vi trong thiết kế (Backlog, Git Activity, Velocity & Metrics, Rollback Logs, Configuration, Export CSV, nút đổi kiểu xem, Ctrl+K, Assignee Presence, sparkline) chỉ **làm tĩnh, không chức năng**, hoặc bỏ. Không thêm tính năng ngoài danh sách trong `CLAUDE.md`.
- Dùng **font Inter** cho toàn bộ (thiết kế gốc có chỗ rơi về font có chân do thiếu font).
- Icon: **SVG nội tuyến**, không thêm thư viện icon khi nhóm chưa đồng ý.
- Vai trò có hai nơi: chọn ở `/login` và công tắc Tech Lead/Developer ở header, cùng ghi vào `AuthContext` (client state).

## 3. Thứ tự làm việc

1. **Giai đoạn 1 — Hợp đồng dữ liệu (Người 1 làm trước):** đẩy `schemas/task.schema.ts`, `types/task.ts` và danh sách endpoint lên `main`. Schema phải có đủ trường mà giao diện hiển thị (xem Người 1). Ba người còn lại không chờ không: Người 3 dựng khung header, sidebar và route, Người 4 dựng thành phần thuần hiển thị với dữ liệu cứng, Người 2 phác hàm tạo `queryKey`.
2. **Giai đoạn 2 — Làm song song** theo checklist từng người ở mục 4.
3. **Giai đoạn 3 — Ghép:** nối thành phần thuần hiển thị (Người 4) với hook (Người 2) và route (Người 3). Cả nhóm chạy các kịch bản ở `README.md` mục 6.
4. **Giai đoạn 4 — Hoàn thiện:** chụp minh chứng, đo bundle, chạy test, viết báo cáo, đối chiếu danh sách kiểm trước khi nộp trong `CLAUDE.md` mục 13.

## 4. Nhiệm vụ chi tiết

### Người 1 — Dữ liệu, mock API, kiểm thử

File sở hữu: `src/schemas/task.schema.ts`, `src/types/task.ts`, `src/api/*`, `src/mocks/*`, `src/tests/*`, phần Vitest trong `vite.config.ts`.

- [ ] Zod schema `Task` có **đủ trường mà giao diện hiển thị**: mã (ví dụ `DEV-101`), tiêu đề, mô tả, nhãn (`labels`), người được giao (tên và chữ viết tắt/màu avatar), trạng thái, độ ưu tiên, hạn chót
- [ ] Zod schema `CreateTaskForm`, `TaskSearchParams`; kiểu TypeScript suy ra từ Zod
- [ ] Chốt danh sách endpoint và ghi vào `docs/DESIGN-NOTES.md`, **gồm endpoint thống kê** (số task theo trạng thái, theo độ ưu tiên, tổng, % hoàn thành) để cấp số cho panel Filters và thẻ KPI
- [ ] `mocks/db.ts`: dữ liệu mẫu đủ các trường trên, đồng bộ `sessionStorage` (F5 không mất dữ liệu)
- [ ] `mocks/handlers.ts`: REST endpoint (danh sách có lọc, tìm kiếm, phân trang; chi tiết; tạo; đổi trạng thái; thống kê), độ trễ mạng, trả lỗi 500 khi công tắc bật
- [ ] `mocks/browser.ts` và `mocks/server.ts`; `main.tsx` bật MSW trước khi mount
- [ ] `api/client.ts` (fetch wrapper, `VITE_API_BASE_URL`, xử lý lỗi HTTP) và `api/tasks.api.ts`
- [ ] Test: `useDebouncedValue.test.ts` (phối hợp Người 3), `tasks.integration.test.tsx` (tải danh sách, tạo task)
- [ ] Minh chứng: kết quả `npm run test`, log MSW ca 200 và ca 500

### Người 2 — Server state và cache

File sở hữu: `src/App.tsx` (QueryClient), `src/hooks/useTaskQueries.ts`, `src/components/tasks/TaskStatsSummary.tsx`.

- [ ] `QueryClient` với `staleTime: 30_000`, `gcTime: 300_000`
- [ ] Hàm/đối tượng `queryKey` tập trung: `['tasks', searchParams]`, `['task', taskId]`, `['task-stats']`
- [ ] `useTasksQuery`, `useTaskQuery`, `useTaskStatsQuery`, `useCreateTaskMutation`, `useUpdateTaskStatusMutation`
- [ ] Mutation đổi trạng thái: `onMutate` (cancelQueries, lưu bản chụp, `setQueryData`), `onError` (rollback), `onSettled` (invalidate `['tasks']` và `['task', taskId]`, và `['task-stats']` vì số đếm đổi theo trạng thái)
- [ ] Mỗi lần `invalidateQueries`/`setQueryData` có một dòng chú thích nêu lý do
- [ ] `TaskStatsSummary`: 4 thẻ KPI (Total Tasks, Completion Rate, In Progress, Simulated Errors) dùng `KpiCard` của Người 4. Ba thẻ đầu lấy từ `useTaskStatsQuery` và tính trực tiếp khi render (derived state, không `useState`). Thẻ Simulated Errors đọc công tắc lỗi 500 từ client state, **không** từ server
- [ ] Minh chứng: ảnh Network và React Query Devtools (tươi, cũ, bị xóa); mutation ca thành công và ca lỗi 500 với rollback; ảnh số đếm cập nhật sau mutation

### Người 3 — Router, URL state, auth, khung điều hướng

File sở hữu: `src/routes/*` (trừ `analytics.tsx`), `src/context/AuthContext.tsx`, `src/hooks/useDebouncedValue.ts`, `src/components/tasks/TaskFilterBar.tsx`, `src/components/common/Navbar.tsx` (header), `src/components/common/Sidebar.tsx`.

- [ ] `AuthContext`: phiên đăng nhập và vai trò, lưu `localStorage`; hỗ trợ đổi vai trò từ header
- [ ] `__root.tsx`, `index.tsx` (chuyển hướng), `login.tsx` (chọn Developer hoặc Tech Lead, theo frame `/login`)
- [ ] `_authenticated.tsx`: kiểm tra đăng nhập trong `beforeLoad`; bố cục có header cố định và sidebar trái 240px
- [ ] `Navbar` (header): logo, Tasks/Analytics, công tắc Simulate Network Error (500), chuyển vai Tech Lead/Developer, thông tin người dùng, Sign Out
- [ ] `Sidebar`: mục điều hướng tĩnh theo thiết kế (không chức năng nếu ngoài phạm vi)
- [ ] `tasks.index.tsx`: `validateSearch` bằng Zod cho `q`, `status`, `priority`, `page`
- [ ] `tasks.$taskId.tsx`: route chi tiết, nối hook của Người 2
- [ ] `useDebouncedValue`: `useEffect` + `clearTimeout`; giải thích vì sao StrictMode chạy effect hai lần
- [ ] `TaskFilterBar`: ô tìm kiếm có debounce và panel lọc Status/Priority đồng bộ URL (không lưu vào `useState`); hiển thị số đếm lấy từ hook của Người 2
- [ ] Minh chứng: F5 giữ nguyên bộ lọc; truy cập `/tasks` khi chưa đăng nhập bị chặn; ảnh URL đổi theo bộ lọc

### Người 4 — Thành phần giao diện, form, tối ưu

File sở hữu: `src/index.css` (token), `src/components/ui/*` (Avatar, StatusPill, PriorityBadge, KpiCard, Pagination), `src/components/tasks/TaskList.tsx`, `CreateTaskModal.tsx`, `src/components/common/ErrorBoundary.tsx`, `LoadingSkeleton.tsx`, `src/routes/_authenticated/analytics.tsx`.

- [ ] `index.css`: token màu, bo góc, bóng, font Inter theo Figma
- [ ] Thành phần thuần hiển thị trong `components/ui/`: `Avatar`, `StatusPill`, `PriorityBadge`, `KpiCard`, `Pagination` (chỉ nhận props, có dữ liệu cứng để xem trước)
- [ ] `TaskList`: bảng theo thiết kế (mã, tiêu đề và nhãn, người được giao, trạng thái, độ ưu tiên, hạn chót, hành động); props một chiều, `key={task.id}`
- [ ] `CreateTaskModal`: React Hook Form + Zod, báo lỗi từng ô (theo frame modal)
- [ ] `LoadingSkeleton` cho trạng thái đang tải; trạng thái rỗng và lỗi
- [ ] `ErrorBoundary` bọc vùng nội dung chính, có nút khôi phục và nút gây lỗi render để kiểm thử
- [ ] `analytics.tsx`: `React.lazy` cho trang và thư viện biểu đồ, bọc `Suspense`; bố cục theo frame `/analytics`
- [ ] `rollup-plugin-visualizer`: đo kích thước bundle trước và sau khi tách
- [ ] Dùng Profiler tìm một re-render không cần thiết và sửa, hoặc ghi rõ vì sao không cần `useMemo`/`useCallback`
- [ ] Minh chứng: ảnh Error Boundary cô lập lỗi (header vẫn hoạt động); số liệu bundle trước và sau; ảnh Profiler

### Ranh giới chồng lấn (tránh sửa file của nhau)

| Phần trong thiết kế          | Làm phần nhìn        | Nối dữ liệu/hành vi                                        |
| ------------------------------- | ----------------------- | -------------------------------------------------------------- |
| Header, Sidebar                 | Người 3               | Người 3                                                      |
| Panel Filters và ô tìm kiếm | Người 3               | Người 3 (số đếm: hook của Người 2)                     |
| Thẻ KPI                        | Người 4 (`KpiCard`) | Người 2 (`TaskStatsSummary`)                               |
| Bảng task, phân trang, pill   | Người 4               | Route của Người 3 truyền dữ liệu từ hook của Người 2 |
| Modal tạo task                 | Người 4               | Người 4 gọi mutation của Người 2                         |

Cần sửa file của người khác thì nhắn người đó hoặc mở PR cho họ duyệt.

## 5. Phần chung của cả nhóm

- [ ] Cập nhật bảng phủ kỹ thuật trong `README.md`: mỗi người sửa dòng của mình, trỏ tới file hoặc commit thật
- [ ] `docs/EVIDENCE.md`: mỗi người một mục minh chứng của mình
- [ ] `npm run build` và `npm run preview` chạy được; ghi `README.md` phiên bản đúng với `package.json`
- [ ] Báo cáo, phân công người viết:
  - Người 1: MSW và kiểm thử
  - Người 2: cache, mutation, so sánh TanStack Query với Redux Toolkit/RTK Query
  - Người 3: Router, URL state, client state, vòng đời effect
  - Người 4: Vite dev so với build và preview, so sánh với Next.js, **ít nhất 2 trường hợp không nên dùng React** (rút ra từ trải nghiệm làm DevTask, không viết chung chung)
- [ ] Mọi người trả lời được các câu hỏi tự kiểm trong `CLAUDE.md` mục 10, kể cả phần không phải của mình

## 6. Quy tắc làm việc

- Mỗi tính năng một nhánh `feat/<tên>`, merge vào `main` bằng Pull Request. **Người khác review**, không tự duyệt PR của mình.
- Commit theo `feat:`, `fix:`, `test:`, `docs:`, `chore:`. Mỗi dòng bảng phủ kỹ thuật có ít nhất một commit tương ứng.
- `routeTree.gen.ts` là file tự sinh. Khi xung đột, không sửa tay: lấy bản của `main`, rồi chạy `npm run dev` để sinh lại.
- Không thêm thư viện mới (kể cả thư viện icon) khi chưa báo nhóm. Không tự gọi `fetch` trong component hay `useEffect`; mọi lời gọi API nằm ở `src/api/`, component chỉ dùng hook.
- Thành phần trong `components/ui/` không được import hook dữ liệu hay router.
- Trước khi nhờ AI viết code, dán `CLAUDE.md` vào cuộc trò chuyện. Không nộp đoạn code mà bản thân không giải thích được.
- Gặp xung đột hoặc bị kẹt quá nửa buổi thì báo nhóm, đừng tự chịu.

## 7. Mốc kiểm tra

| Mốc                           | Điều kiện đạt                                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Hợp đồng dữ liệu xong     | Schema (đủ trường giao diện cần), types, danh sách endpoint gồm endpoint thống kê đã ở `main`                                 |
| Mỗi lớp chạy riêng được | Mock chạy, hook chạy với MSW, route và khung header/sidebar chuyển được, thành phần `ui/` hiển thị đúng với dữ liệu cứng |
| Ghép xong                     | Cả 4 kịch bản kiểm chứng trong `README.md` mục 6 đều chạy đúng                                                                  |
| Sẵn sàng nộp                | Mọi mục trong danh sách kiểm ở `CLAUDE.md` mục 13 đã đánh dấu                                                                   |

## Phụ lục — tạo thêm file cho phần giao diện

Chạy trong thư mục gốc dự án:

```bash
mkdir -p src/components/ui
touch src/components/ui/{Avatar,StatusPill,PriorityBadge,KpiCard,Pagination}.tsx \
      src/components/common/Sidebar.tsx
```
