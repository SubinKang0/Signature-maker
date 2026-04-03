# Deep Dive Trace: image-upload-src-conversion

## Observed Result
사용자가 이미지를 업로드하면 사이트 내에서 공개 URL로 변환해 미리보기 섹션에 반영되길 원함.
현재는 외부 URL을 텍스트로 붙여넣는 방식만 지원.

## Ranked Hypotheses
| Rank | Hypothesis | Confidence | Evidence Strength | Why it leads |
|------|------------|------------|-------------------|--------------|
| 1 | Vercel Blob API route + client upload | High | Strong | Gmail 호환 공개 URL 생성, Next.js 통합 자연스러움 |
| 2 | 외부 서비스(ImgBB/Cloudinary) | Medium | Moderate | API 키 관리 필요, 외부 의존성 |
| 3 | base64 preview only | Low | Strong (but scoped) | Gmail 시그니처에서 작동 안 함 — 사용자 요구 불충족 |

## Evidence Summary by Hypothesis
- **Hypothesis 1 (Vercel Blob)**: page.tsx가 Next.js 15 `"use client"` 단일 파일. `/api/upload` route 추가 후 `@vercel/blob` 패키지로 업로드 → 공개 URL 반환. image state에 URL 설정 → buildSignature() 자동 반영.
- **Hypothesis 2 (외부 API)**: 클라이언트에서 직접 ImgBB API 호출 가능하나 API 키 노출 위험.
- **Hypothesis 3 (base64)**: FileReader.readAsDataURL() 단순하나 Gmail 시그니처에서 data: URL 미지원.

## Evidence Against / Missing Evidence
- **Hypothesis 1**: Vercel Blob 환경변수(BLOB_READ_WRITE_TOKEN) 설정 필요. 로컬 개발 시 추가 설정.
- **Hypothesis 2**: API 키를 환경변수로 숨겨야 함 — 결국 서버 route 필요.
- **Hypothesis 3**: 사용자가 "Gmail에서 실제 작동해야 함" 명시 — 이 옵션 탈락.

## Per-Lane Critical Unknowns
- **Lane 1 (Code-path)**: 업로드 중 로딩 상태 UX가 필요한가? 실패 시 에러 핸들링은?
- **Lane 2 (Email client 제약)**: 사용자가 Gmail base64 제약을 인지했는가? → 인터뷰에서 확인됨.
- **Lane 3 (Storage/hosting)**: Vercel Blob 환경변수가 이미 설정되어 있는가?

## Rebuttal Round
- Best rebuttal to leader (Vercel Blob): "Vercel 배포가 아닌 로컬에서만 사용하면 굳이 Blob 필요 없음"
- Why leader held: 사용자가 Vercel 배포 프로젝트 사용 중 (Dockerfile, Vercel 관련 커밋 존재). Gmail 호환 요구 확정.

## Convergence / Separation Notes
- Lane 2 (ImgBB)와 Lane 1 (Vercel Blob)은 "공개 URL 생성"이라는 같은 목적 — Vercel Blob이 통합 일관성 면에서 우위.
- Lane 3 (base64)은 완전히 분리 — 사용자 요구 불충족으로 탈락.

## Most Likely Explanation
Vercel Blob을 사용한 서버사이드 업로드 API route 추가가 가장 적합한 해결책.
현재 프로젝트 구조(Next.js 15, Vercel 배포)와 자연스럽게 통합됨.

## Critical Unknown
Vercel Blob 환경변수(BLOB_READ_WRITE_TOKEN)가 현재 프로젝트에 설정되어 있는가?

## Recommended Discriminating Probe
`vercel env ls` 또는 `.env.local` 확인으로 BLOB_READ_WRITE_TOKEN 존재 여부 확인.
