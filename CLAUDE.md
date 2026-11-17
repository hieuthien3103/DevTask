# Hướng dẫn cho trợ lý code: dự án DevTask

Dự án thuộc môn **Các Công nghệ Lập trình Hiện đại**, nhóm công nghệ **React 19 + Vite + TanStack**.
Mục tiêu chấm điểm là phân biệt được **client state và server state**, và hiểu **cơ chế cache của TanStack Query**. Mọi đoạn code bạn viết phải phục vụ mục tiêu này và phải giải thích được trong buổi vấn đáp.

Đọc file này trước khi viết hoặc sửa code. Nếu yêu cầu của người dùng mâu thuẫn với file này, hãy nói rõ chỗ mâu thuẫn trước khi làm.

## 1. Stack cố định

React 19, TypeScript, Vite, TanStack Query, TanStack Router, React Hook Form + Zod, MSW, Vitest + Testing Library, Tailwind CSS, rollup-plugin-visualizer.

- Không thêm thư viện state toàn cục (Redux, Zustand…) và không thêm thư viện UI (MUI, shadcn…) nếu người dùng chưa đồng ý. Mỗi thư viện thêm vào đều phải giải thích được vai trò của nó.
- Không thêm Next.js, Remix hay bất cứ framework nào thay thế Vite.
- Công nghệ chính luôn được gọi là "React 19 + Vite + TanStack", không tách riêng "Vite" hay "TanStack".

## 2. Quy tắc state (quan trọng nhất)

| Loại | Công cụ | Ví dụ trong dự án |
|---|---|---|
| Server state | TanStack Query | danh sách task, chi tiết task, bình luận |
| URL state | TanStack Router `validateSearch` (Zod) | `q`, `status`, `priority`, `page` |
| Client state | `useState`, Context | phiên đăng nhập, đóng/mở modal, công tắc giả lập lỗi |
| Derived state | tính trực tiếp khi render | tổng số task, % hoàn thành |

Điều cấm:
- Không sao chép dữ liệu API vào `useState` hoặc Context.
- Không gọi `fetch` trực tiếp trong `useEffect` hoặc trong component. Mọi lời gọi API nằm ở `src/api/`, và component chỉ dùng hook trong `src/hooks/useTaskQueries.ts`.
- Không lưu giá trị suy ra được vào state.
- Không lưu bộ lọc và phân trang vào `useState`. Chúng nằm trên URL.

## 3. Cache của TanStack Query

- `QueryClient` đặt trong `src/App.tsx` với `staleTime: 30_000` và `gcTime: 300_000`.
- `queryKey` có cấu trúc rõ ràng: `['tasks', searchParams]` cho danh sách và `['task', taskId]` cho chi tiết. Không dùng key viết tay rải rác. Gom lại thành một hàm hoặc object key.
- Sau mỗi mutation phải xử lý cache có chủ đích. Mỗi lần gọi `invalidateQueries` hoặc `setQueryData` cần một dòng chú thích nói vì sao.
- Mutation đổi trạng thái phải có đủ `onMutate` (cancelQueries, lưu bản chụp, `setQueryData`), `onError` (rollback) và `onSettled` (invalidate cả `['tasks']` và `['task', taskId]`).

## 4. Hạng mục bắt buộc và nơi đặt code

| Hạng mục | Nơi đặt |
|---|---|
| Component, props một chiều, `key={task.id}` | `src/components/tasks/TaskList.tsx` |
| Custom hook tự viết, có cleanup | `src/hooks/useDebouncedValue.ts` |
| Phân loại client và server state | `src/context/AuthContext.tsx`, `src/hooks/useTaskQueries.ts` |
| Vòng đời cache | `src/App.tsx`, `src/hooks/useTaskQueries.ts` |
| Vite, biến môi trường, `dev` so với `build` + `preview` | `vite.config.ts`, `.env.example` |
| Tối ưu re-render có lý do | xem mục 6 |

## 5. Hạng mục tự chọn đã quyết định

Tự chọn theo ứng dụng (làm sâu, có minh chứng):
1. TanStack Router với search params kiểm tra bằng Zod, route bảo vệ `_authenticated`.
2. Mutation với optimistic update và rollback.
3. React Hook Form + Zod cho modal tạo công việc.
4. Error Boundary (và Suspense nếu dùng với `React.lazy`).

Nâng cao (chọn ít, làm sâu, có số liệu):
1. Phân tích bundle trước và sau khi tách `/analytics` bằng `React.lazy`.
2. Kiểm thử bằng Vitest + Testing Library + MSW.

Không thêm hạng mục ngoài danh sách này khi chưa được yêu cầu. Làm ít nhưng đúng và chứng minh được thì tốt hơn làm nhiều mà không giải thích được.

## 6. Re-render và memo

- Không bọc `useMemo` hoặc `useCallback` theo thói quen. Chỉ dùng khi có lý do đo được hoặc giải thích được (ví dụ giữ ổn định tham chiếu cho component con đã `memo`).
- Mỗi chỗ dùng phải có chú thích một dòng nêu lý do. Phép tính nhỏ như tổng số task và % hoàn thành chỉ cần tính thẳng khi render.
- `key` luôn dùng id ổn định, không dùng chỉ số mảng.

## 7. Minh chứng phải có

Mỗi tính năng làm xong cần để lại bằng chứng trong `docs/EVIDENCE.md` (ảnh, log hoặc số liệu):
- Một server state kèm vòng đời cache: tươi, cũ, bị xóa (ảnh DevTools Network và React Query Devtools).
- Một mutation, ca thành công và ca lỗi 500 với rollback.
- `npm run build` và `npm run preview` chạy được, kèm kích thước bundle trước và sau khi tách chunk.
- Kết quả `npm run test`.
- Bảng phủ kỹ thuật trong `README.md`: mỗi dòng trỏ tới file hoặc commit cụ thể. Khi thêm hoặc đổi tính năng, cập nhật bảng này cùng lúc.

## 8. Những tình huống chưa được xem là đạt

Tránh các tình huống sau, kể cả khi code vẫn chạy:
- Chỉ có component, `useState` và `fetch` thuần, không có phần TanStack đúng nghĩa.
- Gọi lại API sau mọi thao tác mà không hiểu cache hay invalidation.
- Dùng thư viện chỉ vì mẫu code AI sinh ra, không giải thích được state thuộc loại nào.
- Bảng phủ kỹ thuật liệt kê hạng mục nhưng không có file hay commit thật.

## 9. Cách viết code để dễ vấn đáp

- Mỗi hook và mỗi quyết định về state có một chú thích ngắn nêu **vì sao**, không chỉ nêu làm gì.
- Hàm nhỏ, tên rõ nghĩa, không gộp nhiều trách nhiệm vào một component.
- Không để code thừa, code thử nghiệm hoặc đoạn bạn không giải thích được.
- Khi thêm hoặc sửa một phần quan trọng, kết thúc bằng một đoạn ngắn giải thích đoạn đó hoạt động ra sao, để người viết đồ án trả lời được câu hỏi vấn đáp.

## 10. Câu hỏi tự kiểm (người viết đồ án phải trả lời được)

- Dữ liệu nào là client state, dữ liệu nào là server state, và vì sao?
- Vì sao query này cần invalidate hoặc refetch sau mutation?
- Nếu bỏ TanStack Query, nhóm phải tự quản lý những phần nào?
- Component này render lại vì lý do gì, và kiểm chứng bằng cách nào?
- Vì sao StrictMode chạy effect hai lần ở môi trường dev, và cleanup của `useDebouncedValue` làm gì?
- Vì sao `queryKey` chứa `searchParams`?
- `vite preview` khác `vite dev` ở chỗ nào?

## 11. Bài thực hành tại chỗ (chuẩn bị sẵn)

Cấu trúc code phải cho phép làm nhanh các yêu cầu kiểu sau:
- Thêm một mutation mới và cập nhật cache đúng cách.
- Đổi `queryKey` để hỗ trợ thêm bộ lọc hoặc phân trang, và giải thích vì sao cache tách theo tham số.
- Phân tích một re-render không cần thiết bằng Profiler rồi sửa.

## 12. Phần phản biện cho báo cáo

Báo cáo cần phần so sánh, gồm: lý do chọn React + Vite thay vì Next.js (ứng dụng là SPA sau đăng nhập, không cần SEO), so sánh với một framework khác, so sánh TanStack Query với Redux Toolkit/RTK Query, và **ít nhất 2 trường hợp không nên dùng React** rút ra từ trải nghiệm làm DevTask. Khi người dùng làm phần này, hãy giúp lập luận dựa trên những gì dự án thực sự gặp phải, không viết chung chung.

## 13. Danh sách kiểm trước khi nộp

- [ ] `npm run build` và `npm run preview` chạy không lỗi
- [ ] `npm run test` đều qua
- [ ] Không còn `fetch` trực tiếp trong component hoặc `useEffect`
- [ ] Không còn dữ liệu API được sao chép vào state
- [ ] `queryKey` nhất quán và có chú thích cho từng lần invalidate
- [ ] Mutation đổi trạng thái đã kiểm cả ca thành công và ca lỗi 500
- [ ] F5 giữ nguyên bộ lọc trên `/tasks`
- [ ] Error Boundary cô lập được lỗi, thanh điều hướng vẫn hoạt động
- [ ] Có số liệu bundle trước và sau khi tách `/analytics`
- [ ] `docs/EVIDENCE.md` đủ ảnh và log
- [ ] Bảng phủ kỹ thuật trong README trỏ đúng file hoặc commit
- [ ] README ghi phiên bản đúng với `package.json`
- [ ] Đã viết phần so sánh và phản biện
