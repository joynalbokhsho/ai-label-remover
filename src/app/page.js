'use client';

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Download, CheckCircle, EyeOff, Shield, RefreshCw, BarChart2 } from 'lucide-react';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [stats, setStats] = useState(0);
  const fileInputRef = useRef(null);

  // Fetch stats on mount
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data.count))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const lowerName = file.name.toLowerCase();
    const isJfif = lowerName.endsWith('.jfif');
    
    if (!file.type.startsWith('image/') && !isJfif) {
      alert('Please upload a valid image file (JPG, PNG, WebP, JFIF).');
      return;
    }

    let exportType = file.type;
    let exportName = file.name;

    if (lowerName.endsWith('.webp') || isJfif) {
      exportType = 'image/jpeg';
      exportName = file.name.replace(/\.(webp|jfif)$/i, '.jpg');
    }

    setOriginalFile({
      name: exportName,
      type: exportType
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to redraw the image (strips metadata)
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Draw image on canvas
        if (exportType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        // Convert canvas back to data URL (quality 1.0 for max quality)
        const cleanURL = canvas.toDataURL(exportType, 1.0);
        setPreviewUrl(cleanURL);

        // Track the processed image via API
        fetch('/api/stats', { method: 'POST' })
          .then(res => res.json())
          .then(data => setStats(data.count))
          .catch(err => console.error('Error updating stats:', err));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `clean_${originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setOriginalFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1>Remove AI Label <span>Instantly</span></h1>
        <p>Strip C2PA, XMP, EXIF, and PNG metadata entirely within your browser.</p>
      </header>

      <section className="card">
        {stats > 0 && (
          <div className="stats-badge">
            <BarChart2 size={14} />
            Images Cleaned: <span>{stats.toLocaleString()}</span>
          </div>
        )}

        {!previewUrl ? (
          <div 
            className={`drop-zone ${isDragging ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud />
            <div>
              <div className="drop-zone-title">Click or drag image here</div>
              <div className="drop-zone-subtitle">JPG, PNG, WebP, JFIF • Max 15MB</div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/webp, .jfif" 
              style={{ display: 'none' }} 
            />
          </div>
        ) : (
          <div className="preview-container">
            <img src={previewUrl} alt="Cleaned Image Preview" className="preview-image" />
            <div className="preview-actions">
              <button className="btn" onClick={handleDownload}>
                <Download size={20} />
                Download Cleaned Image
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                <RefreshCw size={20} />
                Process Another
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="chips">
        <div className="chip"><CheckCircle size={16} /> Strips C2PA</div>
        <div className="chip"><CheckCircle size={16} /> Strips XMP</div>
        <div className="chip"><CheckCircle size={16} /> Strips EXIF</div>
        <div className="chip" style={{ color: 'var(--primary)', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
          <EyeOff size={16} /> Bypasses IG/FB AI Label
        </div>
      </div>
      
      <div className="privacy-note">
        <Shield size={18} />
        100% Offline Processing. Your files never leave your device.
      </div>
    </main>
  );
}
