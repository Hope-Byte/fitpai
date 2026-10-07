/* ============================================================
 * Fit拍 · 摄像头与图片采集
 * ============================================================ */
const Camera = (() => {
  let stream = null;
  let facingMode = 'environment'; // 后置摄像头

  const video = () => document.getElementById('camera-video');

  async function start() {
    facingMode = 'environment';
    return _open();
  }

  async function _open() {
    stop();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('当前浏览器不支持摄像头');
      }
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 960 } }
      });
      const v = video();
      v.srcObject = stream;
      await v.play();
      return true;
    } catch (err) {
      console.warn('摄像头启动失败', err);
      return false;
    }
  }

  async function switchCamera() {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    return _open();
  }

  function stop() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    const v = video();
    if (v) v.srcObject = null;
  }

  /* 拍照：从视频帧截取为 dataURL */
  function capture() {
    const v = video();
    if (!v || !v.videoWidth) return null;
    const canvas = document.createElement('canvas');
    const max = 1280;
    const ratio = v.videoWidth / v.videoHeight;
    canvas.width = ratio > 1 ? max : Math.round(max * ratio);
    canvas.height = ratio > 1 ? Math.round(max / ratio) : max;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  }

  /* 从相册选择：返回 Promise<dataURL|null> */
  function pickFromGallery() {
    return new Promise((resolve) => {
      const input = document.getElementById('file-input');
      const handler = () => {
        input.removeEventListener('change', handler);
        const file = input.files && input.files[0];
        if (!file) { input.value = ''; resolve(null); return; }
        const reader = new FileReader();
        reader.onload = () => { input.value = ''; resolve(reader.result); };
        reader.onerror = () => { input.value = ''; resolve(null); };
        reader.readAsDataURL(file);
      };
      input.addEventListener('change', handler);
      input.value = '';
      input.click();
    });
  }

  /* 压缩图片到目标最长边，减小上传体积 */
  function compress(dataUrl, maxDim = 1024, quality = 0.8) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  return { start, stop, switchCamera, capture, pickFromGallery, compress, getFacing: () => facingMode };
})();
