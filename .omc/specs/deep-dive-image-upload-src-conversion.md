# Deep Dive Spec: image-upload-src-conversion

## Goal
Gmail 시그니처 생성기에 이미지 업로드 기능을 추가한다.
사용자가 이미지 파일을 업로드하면 Vercel Blob에 저장되고,
반환된 공개 URL이 미리보기에 자동 반영되며, 복사된 HTML에도 포함되어 Gmail에서 정상 표시된다.

## Constraints
- **Vercel Blob** 사용 (`@vercel/blob` 패키지)
- Next.js App Router API route 추가: `app/api/upload/route.ts`
- 기존 `image` state(string)에 공개 URL 설정 → `buildSignature()` 자동 반영
- 현재 "이미지 URL" 텍스트 입력칸을 파일 업로드 버튼으로 **완전 대체**
- 업로드 중 로딩 상태 표시
- Gmail에서 실제 작동하는 공개 HTTP URL 필수

## Non-Goals
- 이미지 리사이즈/크롭 기능
- 사용자 인증 / 이미지 소유권 관리
- 업로드된 이미지 삭제 기능
- 여러 이미지 동시 업로드

## Acceptance Criteria
1. "이미지 URL" 텍스트 입력칸이 파일 업로드 버튼으로 교체된다
2. 버튼 클릭 시 파일 피커 열림 (이미지 파일만 허용: `accept="image/*"`)
3. 파일 선택 후 자동으로 `/api/upload`에 POST → Vercel Blob 업로드
4. 업로드 중 버튼이 "업로드 중..." 상태로 비활성화됨
5. 업로드 완료 후 반환된 공개 URL이 `image` state에 설정됨
6. 미리보기 섹션의 이미지가 즉시 업데이트됨
7. "복사" 버튼 클릭 시 복사된 HTML에 Vercel Blob 공개 URL 포함됨
8. Gmail에 붙여넣었을 때 이미지 정상 표시됨
9. 업로드 실패 시 에러 메시지 표시

## Assumptions Exposed
- 프로젝트가 Vercel에 배포되며, `BLOB_READ_WRITE_TOKEN` 환경변수가 설정된다
- 로컬 개발 시 `.env.local`에 `BLOB_READ_WRITE_TOKEN` 설정 필요
- 이미지 파일 크기 제한은 Vercel Blob 기본값(500MB) 적용
- 기존 URL 텍스트 입력은 불필요하다고 사용자 확인

## Technical Context

### 현재 프로젝트 구조
```
signature-make/
├── app/
│   ├── page.tsx       ← "use client", 단일 파일 앱
│   └── layout.tsx
├── package.json       ← Next.js 15.3.0, React 19
```

### 변경 내용
```
signature-make/
├── app/
│   ├── page.tsx       ← 파일 업로드 UI로 교체
│   ├── layout.tsx
│   └── api/
│       └── upload/
│           └── route.ts  ← NEW: Vercel Blob 업로드 API
├── package.json       ← @vercel/blob 추가
```

### 핵심 코드 패턴

**API Route (app/api/upload/route.ts)**:
```ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const blob = await put(file.name, file, { access: 'public' });
  return NextResponse.json({ url: blob.url });
}
```

**Client Upload (page.tsx)**:
```ts
const [uploading, setUploading] = useState(false);

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const { url } = await res.json();
  setImage(url);
  setUploading(false);
};
```

## Ontology
- **image state**: `string` — 공개 URL (Vercel Blob URL)
- **buildSignature()**: imageUrl을 `<img src="">` 에 삽입하는 순수 함수 — 변경 불필요
- **Vercel Blob**: `@vercel/blob` 패키지의 `put()` 함수로 파일 업로드
- **API route**: `/api/upload` — server-side에서 Blob 토큰 사용

## Trace Findings
- **Most likely explanation**: Vercel Blob + API route가 최적 해결책
- **Lane 1 (code-path)**: image state → buildSignature() 흐름 변경 없음, 입력 방식만 교체
- **Lane 2 (email constraint)**: base64는 Gmail 미지원 확인 → 공개 URL 필수
- **Lane 3 (storage)**: 사용자가 Vercel Blob 선택 확정

## Interview Transcript
- R1: Gmail 작동 여부 → "Gmail에서도 실제 작동해야 함" 확정
- R2: 호스팅 방식 → "Vercel Blob" 선택
- R3: UX 구성 → "업로드로 완전 대체" (텍스트 입력 제거)
