
# DevTask — Quản lý công việc và theo dõi tiến độ

Đồ án môn **Các Công nghệ Lập trình Hiện đại**.
Công nghệ chính: **React 19 + Vite + TanStack** (Query, Router).

DevTask là một issue tracker thu nhỏ gồm 4 màn hình. Mục tiêu của đồ án không phải là nhiều tính năng, mà là cho thấy cách chia state, lấy dữ liệu từ server, định tuyến và đóng gói trong một ứng dụng React đúng nghĩa.

> Phiên bản chính xác của mọi thư viện nằm trong `package.json` và `package-lock.json`.

## 1. Công nghệ sử dụng

| Nhóm              | Công nghệ              | Vai trò trong đồ án                                                       |
| ------------------ | ------------------------ | ----------------------------------------------------------------------------- |
| Giao diện         | React 19, TypeScript     | Component, hooks, state cục bộ                                              |
| Build              | Vite                     | Dev server, HMR, build production, chia chunk, biến môi trường `VITE_*` |
| Server state       | TanStack Query           | Lấy dữ liệu, cache, mutation, optimistic update                            |
| Routing            | TanStack Router          | Route an toàn kiểu, route bảo vệ, search params trên URL                 |
| Form               | React Hook Form + Zod    | Form tạo công việc, validate theo schema                                   |
| API giả lập      | MSW                      | REST API chạy trong trình duyệt và trong test                             |
| Kiểm thử         | Vitest, Testing Library  | Unit test hook, integration test luồng chính                                |
| Phân tích bundle | rollup-plugin-visualizer | Đo kích thước chunk trước và sau khi tách                             |
| Style              | Tailwind CSS             | Giao diện                                                                    |

## 2. Màn hình và cách phân loại state

| Route              | Chức năng                                                                    | Loại dữ liệu                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/login`         | Đăng nhập giả lập, chọn vai trò Developer hoặc Tech Lead               | **Client state**: `AuthContext`, lưu vào `localStorage`                                                                                                            |
| `/tasks`         | Danh sách, tìm kiếm, lọc theo trạng thái và độ ưu tiên, phân trang | **URL state**: `q`, `status`, `priority`, `page` · **Server state**: `['tasks', searchParams]` · **Derived state**: tổng số và % hoàn thành |
| `/tasks/$taskId` | Chi tiết, đổi trạng thái, bình luận                                     | **Server state**: `['task', taskId]` · **Mutation** có optimistic update và rollback                                                                          |
| `/analytics`     | Thống kê tiến độ                                                          | Tải lười bằng `React.lazy`                                                                                                                                               |

Nguyên tắc: dữ liệu lấy từ API chỉ do TanStack Query quản lý, không sao chép vào `useState` hay Context. Dữ liệu suy ra được thì tính ra, không lưu.

### Cache của TanStack Query

- `staleTime`: 30 giây. Trong khoảng này, đi từ `/tasks` sang chi tiết rồi quay lại không gọi lại API.
- `gcTime`: 5 phút. Query không còn component nào dùng sẽ bị xóa khỏi cache sau thời gian này.
- `queryKey` có chứa `searchParams`, nên mỗi tổ hợp bộ lọc có một cache riêng.

### Luồng mutation đổi trạng thái

1. `onMutate`: hủy các query đang chạy, lưu bản chụp cache cũ, ghi trạng thái mới vào cache để giao diện đổi ngay.
2. `onError`: khôi phục cache từ bản chụp (rollback) và hiện thông báo lỗi.
3. `onSettled`: `invalidateQueries` cho `['tasks']` và `['task', taskId]` để đồng bộ lại với server.

## 3. Cấu trúc thư mục

```text
devtask-app/
├── public/
│   └── mockServiceWorker.js        # sinh bởi `npx msw init public/`
├── src/
│   ├── api/
│   │   ├── client.ts               # fetch wrapper, baseURL từ VITE_API_BASE_URL, xử lý lỗi HTTP
│   │   └── tasks.api.ts            # hàm gọi API thuần
│   ├── components/
│   │   ├── common/                 # ErrorBoundary, Navbar, LoadingSkeleton
│   │   └── tasks/                  # TaskFilterBar, TaskList, TaskStatsSummary, CreateTaskModal
│   ├── context/AuthContext.tsx     # client state: phiên đăng nhập và vai trò
│   ├── hooks/
│   │   ├── useDebouncedValue.ts    # custom hook: useEffect + cleanup
│   │   └── useTaskQueries.ts       # useQuery, useMutation, optimistic update
│   ├── mocks/                      # db, handlers, browser (worker), server (Vitest)
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx               # chuyển hướng sang /tasks hoặc /login
│   │   ├── login.tsx
│   │   ├── _authenticated.tsx      # layout route bảo vệ, kiểm tra trong beforeLoad
│   │   └── _authenticated/         # tasks.index, tasks.$taskId, analytics
│   ├── schemas/task.schema.ts      # Zod: Task, CreateTaskForm, TaskSearchParams
│   ├── tests/                      # setup, unit test, integration test
│   ├── types/task.ts               # kiểu suy ra từ Zod
│   ├── routeTree.gen.ts            # tự sinh bởi plugin của TanStack Router
│   ├── App.tsx                     # QueryClientProvider, RouterProvider
│   └── main.tsx                    # bật MSW trước khi mount, bọc StrictMode
├── docs/                           # ghi chú minh chứng và quyết định thiết kế
├── .env.example
├── vite.config.ts
└── README.md
```

## 4. Cài đặt và chạy

Yêu cầu: Node.js 20 trở lên và npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Nếu `public/mockServiceWorker.js` chưa có:

```bash
npx msw init public/ --save
```

### Các lệnh

| Lệnh                  | Tác dụng                                                            |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`        | Dev server với HMR                                                   |
| `npm run build`      | Build production, chia chunk, sinh `stats.html` (biểu đồ bundle) |
| `npm run preview`    | Chạy thử bản build production                                      |
| `npm run test`       | Chạy toàn bộ test một lần                                        |
| `npm run test:watch` | Chạy test ở chế độ theo dõi                                     |

### Biến môi trường

| Biến                 | Ý nghĩa                                |
| --------------------- | ---------------------------------------- |
| `VITE_API_BASE_URL` | Tiền tố của API, mặc định `/api` |
| `VITE_ENABLE_MOCK`  | `true` thì bật MSW                   |

`.env.production` giữ `VITE_ENABLE_MOCK=true` vì đồ án không có backend thật. Nhờ vậy `vite preview` vẫn chạy được đầy đủ với dữ liệu giả lập.

## 5. Dữ liệu giả lập (MSW)

- `src/mocks/db.ts` giữ dữ liệu mẫu và đồng bộ vào `sessionStorage`, nên tải lại trang (F5) không mất dữ liệu.
- `src/mocks/handlers.ts` định nghĩa các endpoint REST, thêm độ trễ mạng và trả lỗi 500 khi công tắc **Simulate Network Error (500)** trên thanh điều hướng đang bật.
- `src/mocks/browser.ts` chạy trong trình duyệt (dev và preview). `src/mocks/server.ts` dùng lại cùng bộ handler cho Vitest.

## 6. Kịch bản kiểm chứng

**Cache.** Đăng nhập, vào `/tasks` và mở DevTools, tab Network, quan sát `GET /api/tasks`. Mở chi tiết một task rồi quay lại trong vòng 30 giây. Danh sách hiện ngay và không có request mới.

**URL state.** Chọn Priority là High và nhập từ khóa. URL cập nhật theo. Nhấn F5, bộ lọc và kết quả vẫn giữ nguyên.

**Optimistic update và rollback.** Mở chi tiết một task. Bật công tắc Simulate Network Error (500). Đổi trạng thái sang Done: giao diện đổi ngay, rồi hoàn tác khi MSW trả lỗi 500 và có thông báo lỗi. Tắt công tắc và làm lại: trạng thái được giữ và danh sách được làm mới.

**Error Boundary.** Bấm nút gây lỗi render ở vùng danh sách. Vùng đó hiện khung báo lỗi và nút khôi phục, trong khi thanh điều hướng vẫn hoạt động.

**Code splitting.** Chạy `npm run build`. Kết quả build có chunk riêng cho `/analytics` và thư viện biểu đồ. Mở `stats.html` để so sánh kích thước.

## 7. Bảng phủ kỹ thuật

| Hạng mục                            | Cơ chế áp dụng                                                     | File                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Component, props, key                 | Component chia nhỏ, props một chiều, `key={task.id}`              | `src/components/tasks/TaskList.tsx`                                            |
| Vòng đời, custom hook              | `useDebouncedValue` dùng `useEffect` và `clearTimeout`         | `src/hooks/useDebouncedValue.ts`                                               |
| Client state và server state         | `AuthContext` tách khỏi TanStack Query                             | `src/context/AuthContext.tsx`, `src/hooks/useTaskQueries.ts`                 |
| Vòng đời cache                     | `staleTime` 30 giây, `gcTime` 5 phút, `queryKey` theo tham số | `src/App.tsx`, `src/hooks/useTaskQueries.ts`                                 |
| Router và URL state                  | Route bảo vệ, `validateSearch` bằng Zod                           | `src/routes/_authenticated.tsx`, `src/routes/_authenticated/tasks.index.tsx` |
| Mutation, optimistic update, rollback | `onMutate`, `onError`, `onSettled`                               | `src/hooks/useTaskQueries.ts`, `src/mocks/handlers.ts`                       |
| Form và validation                   | React Hook Form kết hợp Zod                                          | `src/components/tasks/CreateTaskModal.tsx`, `src/schemas/task.schema.ts`     |
| Error Boundary                        | Bọc vùng nội dung chính                                            | `src/components/common/ErrorBoundary.tsx`                                      |
| Code splitting                        | `React.lazy` cho trang thống kê                                    | `src/routes/_authenticated/analytics.tsx`                                      |
| Vite, biến môi trường, build      | `dev` và `build` rồi `preview`, biến `VITE_*`               | `vite.config.ts`, `.env.example`                                             |
| Kiểm thử                            | Vitest, Testing Library, MSW                                           | `src/tests/`                                                                   |
| Phân tích bundle                    | rollup-plugin-visualizer                                               | `vite.config.ts`                                                               |

## 8. Kiểm thử

- `useDebouncedValue.test.ts`: kiểm tra hook trả giá trị sau độ trễ và hủy timer khi giá trị đổi hoặc component bị gỡ.
- `tasks.integration.test.tsx`: kiểm tra luồng tải danh sách và tạo công việc mới qua MSW.

## 9. Quy ước làm việc với Git

- Nhánh: `main` luôn chạy được; làm tính năng trên `feat/<tên>`, sửa lỗi trên `fix/<tên>`.
- Commit theo dạng `feat:`, `fix:`, `test:`, `docs:`, `chore:`.
- Mỗi dòng trong bảng phủ kỹ thuật nên có ít nhất một commit tương ứng để trỏ tới khi cần.
