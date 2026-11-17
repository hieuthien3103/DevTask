# Giao việc — DevTask (nhóm 4 người)

Công nghệ: **React 19 + Vite + TanStack**. Trọng tâm chấm điểm: phân biệt client state và server state, hiểu cache của TanStack Query. Xem thêm `CLAUDE.md` và `README.md`.

## 1. Phân công

| | Thành viên | Vai trò | Nhánh làm việc |
|---|---|---|---|
| Người 1 | _(điền tên)_ | Dữ liệu, mock API, kiểm thử | `feat/data-mock-tests` |
| Người 2 | _(điền tên)_ | Server state và cache | `feat/server-state` |
| Người 3 | _(điền tên)_ | Router, URL state, auth | `feat/routing-auth` |
| Người 4 | _(điền tên)_ | Giao diện, form, tối ưu | `feat/ui-form-perf` |

## 2. Thứ tự làm việc

1. **Giai đoạn 1 — Hợp đồng dữ liệu (Người 1 làm trước):** đẩy `schemas/task.schema.ts`, `types/task.ts` và danh sách endpoint lên `main`. Ba người còn lại không chờ không: Người 3 dựng khung route, Người 4 dựng giao diện với dữ liệu cứng, Người 2 đọc tài liệu TanStack Query và phác hàm tạo `queryKey`.
2. **Giai đoạn 2 — Làm song song** theo checklist từng người ở mục 3.
3. **Giai đoạn 3 — Ghép:** nối giao diện (Người 4) với hook (Người 2) và route (Người 3). Cả nhóm chạy các kịch bản ở `README.md` mục 6.
4. **Giai đoạn 4 — Hoàn thiện:** chụp minh chứng, đo bundle, chạy test, viết báo cáo, đối chiếu danh sách kiểm trước khi nộp trong `CLAUDE.md` mục 13.

## 3. Nhiệm vụ chi tiết

### Người 1 — Dữ liệu, mock API, kiểm thử
File sở hữu: `src/schemas/task.schema.ts`, `src/types/task.ts`, `src/api/*`, `src/mocks/*`, `src/tests/*`, phần Vitest trong `vite.config.ts`.

- [ ] Zod schema: `Task`, `CreateTaskForm`, `TaskSearchParams`; kiểu TypeScript suy ra từ Zod
- [ ] Chốt danh sách endpoint (tên, tham số, dạng trả về) và ghi vào `docs/DESIGN-NOTES.md` để cả nhóm dùng
- [ ] `mocks/db.ts`: dữ liệu mẫu, đồng bộ `sessionStorage` (F5 không mất dữ liệu)
- [ ] `mocks/handlers.ts`: REST endpoint, độ trễ mạng, trả lỗi 500 khi công tắc bật
- [ ] `mocks/browser.ts` và `mocks/server.ts`; `main.tsx` bật MSW trước khi mount
- [ ] `api/client.ts` (fetch wrapper, `VITE_API_BASE_URL`, xử lý lỗi HTTP) và `api/tasks.api.ts`
- [ ] Test: `useDebouncedValue.test.ts` (phối hợp Người 3), `tasks.integration.test.tsx` (tải danh sách, tạo task)
- [ ] Minh chứng: kết quả `npm run test`, log MSW ca 200 và ca 500

### Người 2 — Server state và cache
File sở hữu: `src/App.tsx` (QueryClient), `src/hooks/useTaskQueries.ts`, `src/components/tasks/TaskStatsSummary.tsx`.

- [ ] `QueryClient` với `staleTime: 30_000`, `gcTime: 300_000`
- [ ] Hàm/đối tượng `queryKey` tập trung: `['tasks', searchParams]`, `['task', taskId]`
- [ ] `useTasksQuery`, `useTaskQuery`, `useCreateTaskMutation`, `useUpdateTaskStatusMutation`
- [ ] Mutation đổi trạng thái: `onMutate` (cancelQueries, lưu bản chụp, `setQueryData`), `onError` (rollback), `onSettled` (invalidate cả `['tasks']` và `['task', taskId]`)
- [ ] Mỗi lần `invalidateQueries`/`setQueryData` có một dòng chú thích nêu lý do
- [ ] `TaskStatsSummary`: tổng số và % hoàn thành tính trực tiếp khi render (derived state), không `useState`
- [ ] Minh chứng: ảnh Network và React Query Devtools (tươi, cũ, bị xóa); mutation ca thành công và ca lỗi 500 với rollback

### Người 3 — Router, URL state, auth
File sở hữu: `src/routes/*` (trừ `analytics.tsx`), `src/context/AuthContext.tsx`, `src/hooks/useDebouncedValue.ts`, `src/components/tasks/TaskFilterBar.tsx`, `src/components/common/Navbar.tsx`.

- [ ] `AuthContext`: phiên đăng nhập và vai trò, lưu `localStorage`
- [ ] `__root.tsx`, `index.tsx` (chuyển hướng), `login.tsx` (chọn Developer hoặc Tech Lead)
- [ ] `_authenticated.tsx`: kiểm tra đăng nhập trong `beforeLoad`
- [ ] `tasks.index.tsx`: `validateSearch` bằng Zod cho `q`, `status`, `priority`, `page`
- [ ] `tasks.$taskId.tsx`: route chi tiết, nối hook của Người 2
- [ ] `useDebouncedValue`: `useEffect` + `clearTimeout`; giải thích vì sao StrictMode chạy effect hai lần
- [ ] `TaskFilterBar`: tìm kiếm có debounce, bộ lọc đồng bộ URL (không lưu vào `useState`)
- [ ] `Navbar`: công tắc Simulate Network Error (500), đăng xuất
- [ ] Minh chứng: F5 giữ nguyên bộ lọc; truy cập `/tasks` khi chưa đăng nhập bị chặn; ảnh URL đổi theo bộ lọc

### Người 4 — Giao diện, form, tối ưu
File sở hữu: `src/components/tasks/TaskList.tsx`, `CreateTaskModal.tsx`, `src/components/common/ErrorBoundary.tsx`, `LoadingSkeleton.tsx`, `src/routes/_authenticated/analytics.tsx`, cấu hình Tailwind.

- [ ] Chốt design token và style chung bằng Tailwind (màu, font, bo góc, khoảng cách)
- [ ] `TaskList`: props một chiều, `key={task.id}`
- [ ] `CreateTaskModal`: React Hook Form + Zod, báo lỗi từng ô
- [ ] `LoadingSkeleton` cho trạng thái đang tải; trạng thái rỗng và lỗi
- [ ] `ErrorBoundary` bọc vùng nội dung chính, có nút khôi phục và nút gây lỗi render để kiểm thử
- [ ] `analytics.tsx`: `React.lazy` cho trang và thư viện biểu đồ, bọc `Suspense`
- [ ] `rollup-plugin-visualizer`: đo kích thước bundle trước và sau khi tách
- [ ] Dùng Profiler tìm một re-render không cần thiết và sửa, hoặc ghi rõ vì sao không cần `useMemo`/`useCallback`
- [ ] Minh chứng: ảnh Error Boundary cô lập lỗi (Navbar vẫn hoạt động); số liệu bundle trước và sau; ảnh Profiler

## 4. Phần chung của cả nhóm

- [ ] Cập nhật bảng phủ kỹ thuật trong `README.md`: mỗi người sửa dòng của mình, trỏ tới file hoặc commit thật
- [ ] `docs/EVIDENCE.md`: mỗi người một mục minh chứng của mình
- [ ] `npm run build` và `npm run preview` chạy được; ghi `README.md` phiên bản đúng với `package.json`
- [ ] Báo cáo, phân công người viết:
  - Người 1: MSW và kiểm thử
  - Người 2: cache, mutation, so sánh TanStack Query với Redux Toolkit/RTK Query
  - Người 3: Router, URL state, client state, vòng đời effect
  - Người 4: Vite dev so với build và preview, so sánh với Next.js, **ít nhất 2 trường hợp không nên dùng React** (rút ra từ trải nghiệm làm DevTask, không viết chung chung)
- [ ] Mọi người trả lời được các câu hỏi tự kiểm trong `CLAUDE.md` mục 10, kể cả phần không phải của mình

## 5. Quy tắc làm việc

- Mỗi tính năng một nhánh `feat/<tên>`, merge vào `main` bằng Pull Request. **Người khác review**, không tự duyệt PR của mình.
- Commit theo `feat:`, `fix:`, `test:`, `docs:`, `chore:`. Mỗi dòng bảng phủ kỹ thuật có ít nhất một commit tương ứng.
- `routeTree.gen.ts` là file tự sinh. Khi xung đột, không sửa tay: lấy bản của `main`, rồi chạy `npm run dev` để sinh lại.
- Không thêm thư viện mới khi chưa báo nhóm. Không tự gọi `fetch` trong component hay `useEffect`; mọi lời gọi API nằm ở `src/api/`, component chỉ dùng hook.
- Trước khi nhờ AI viết code, dán `CLAUDE.md` vào cuộc trò chuyện. Không nộp đoạn code mà bản thân không giải thích được.
- Gặp xung đột hoặc bị kẹt quá nửa buổi thì báo nhóm, đừng tự chịu.

## 6. Mốc kiểm tra

| Mốc | Điều kiện đạt |
|---|---|
| Hợp đồng dữ liệu xong | Schema, types, danh sách endpoint đã ở `main` |
| Mỗi lớp chạy riêng được | Mock chạy, hook chạy với MSW, route chuyển được, component hiển thị được |
| Ghép xong | Cả 4 kịch bản kiểm chứng trong `README.md` mục 6 đều chạy đúng |
| Sẵn sàng nộp | Mọi mục trong danh sách kiểm ở `CLAUDE.md` mục 13 đã đánh dấu |
