"use client";

import { useState, useCallback } from "react";

function buildSignature(name: string, position: string, phone: string, email: string, imageUrl: string) {
  const imgTag = imageUrl
    ? `<img src="${imageUrl}" width="150" style="display:block;border-radius:4px;" alt="프로필">`
    : `<div style="width:150px;height:100px;background:#eee;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#aaa;">이미지 없음</div>`;

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
  <tr>
    <td style="vertical-align:top;padding-right:16px;border-right:2px solid #6D319D;">
      ${imgTag}
    </td>
    <td style="vertical-align:top;padding-left:16px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-size:18px;font-weight:bold;color:#222;padding-bottom:2px;">${name}</td></tr>
        <tr><td style="font-size:13px;color:#6D319D;padding-bottom:10px;">${position}</td></tr>
        <tr><td style="font-size:12px;color:#555;padding-bottom:4px;">
          <span style="color:#6D319D;font-weight:bold;">📞</span>&nbsp; ${phone}
        </td></tr>
        <tr><td style="font-size:12px;color:#555;padding-bottom:4px;">
          <span style="color:#6D319D;font-weight:bold;">📧</span>&nbsp; <a href="mailto:${email}" style="color:#555;text-decoration:none;font-family:Arial,sans-serif;">${email}</a>
        </td></tr>
        <tr><td style="font-size:12px;color:#555;padding-bottom:4px;">
          <span style="color:#6D319D;font-weight:bold;">🌐</span>&nbsp; <a href="https://jocodingax.ai/" style="color:#555;text-decoration:none;font-family:Arial,sans-serif;">https://jocodingax.ai/</a>
        </td></tr>
        <tr><td style="font-size:12px;color:#555;padding-bottom:4px;">
          <span style="color:#6D319D;font-weight:bold;">🏢</span>&nbsp; 서울 서초구 사평대로 55길 65-7 1층
        </td></tr>
      </table>
    </td>
  </tr>
</table>`;
}

export default function Home() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const sig = buildSignature(
    name || "YOUR_NAME",
    position || "YOUR_POSITION",
    phone || "YOUR_NUMBER",
    email || "YOUR_EMAIL_ADDRESS",
    image
  );

  const copySignature = useCallback(() => {
    const area = document.getElementById("preview-area");
    if (!area) return;
    const range = document.createRange();
    range.selectNodeContents(area);
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand("copy");
    sel.removeAllRanges();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 30px; }
        h2 { color: #333; margin-bottom: 6px; }
        .subtitle { color: #888; font-size: 13px; margin-bottom: 24px; }
        .container { max-width: 680px; margin: 0 auto; }
        .form-box { background: #fff; border-radius: 10px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .form-box h3 { margin: 0 0 16px; font-size: 18px; color: #181818; }
        .form-row { margin-bottom: 14px; }
        .form-row label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; }
        .form-row input { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; font-family: Arial, sans-serif; outline: none; transition: border 0.2s; }
        .form-row input:focus { border-color: #6D319D; }
        .form-row input::placeholder { color: #D4D4D8; }
        .form-row .hint { font-size: 11px; color: #aaa; margin-top: 4px; }
        .preview-box { background: #fff; border-radius: 10px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .preview-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .preview-header h3 { margin: 0; font-size: 18px; color: #181818; }
        .copy-icon-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; color: #6D319D; transition: background 0.2s; display: flex; align-items: center; gap: 5px; font-size: 13px; font-family: Arial, sans-serif; }
        .copy-icon-btn:hover { background: #f0ecfd; }
        .copy-icon-btn svg { width: 18px; height: 18px; }
        .copy-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #333; color: #fff; padding: 10px 20px; border-radius: 8px; font-size: 13px; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .copy-toast.show { opacity: 1; }
        #preview-area { border: 1px dashed #ddd; border-radius: 6px; padding: 16px; background: #fafafa; }
      `}</style>

      <div className="container">
        <h2>✉️ Gmail 시그니처 생성기</h2>
        <p className="subtitle">아래 정보를 입력하면 시그니처가 자동으로 만들어집니다.</p>

        <div className="form-box">
          <h3>내 정보 입력</h3>
          <div className="form-row">
            <label>이름</label>
            <input type="text" placeholder="홍길동" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <label>직책</label>
            <input type="text" placeholder="AX Director" value={position} onChange={e => setPosition(e.target.value)} />
          </div>
          <div className="form-row">
            <label>휴대폰 번호</label>
            <input type="text" placeholder="010-0000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-row">
            <label>이메일</label>
            <input type="text" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-row">
            <label>이미지 URL</label>
            <input type="text" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
            <div className="hint">Google Drive, Imgur 등에 이미지를 올리고 공개 링크를 붙여넣으세요.</div>
          </div>
        </div>

        <div className="preview-box">
          <div className="preview-header">
            <h3>시그니처 복사하기</h3>
            <button className="copy-icon-btn" onClick={copySignature} title="복사">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              복사
            </button>
          </div>
          <div id="preview-area" dangerouslySetInnerHTML={{ __html: sig }} />
        </div>

        <div className={`copy-toast${showToast ? " show" : ""}`}>✓ 복사됐습니다! Gmail에 붙여넣으세요.</div>
      </div>
    </>
  );
}
