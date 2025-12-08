import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // ← Import Firebase Storage

function MainPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [shortDesc, setShortDesc] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false); // Show loading state

  // Handle file upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    /*if (!shortDesc.trim()) {
      alert('Please enter a brief description here.');
      return;
    }
    //MAKE THIS OPTIONAL*/

    if (!imagePreview) {
      alert('Please upload an image.');
      return;
    }
    //MAKE this compulsory

    setUploading(true);
    setResult('');

    try {
      // 1. Convert base64 to Blob (for Firebase upload)
      const base64Data = imagePreview.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // 2. Upload to Firebase Storage
      const fileName = `${Date.now()}.jpg`; // Unique name
      const storageRef = ref(storage, `artworks/${fileName}`);
      await uploadBytes(storageRef, blob);

      // 3. Get public URL
      const imageUrl = await getDownloadURL(storageRef);

      // 4. For now, just show the URL (later we'll send it to AI)
      setResult(`Image uploaded! Public URL:\n${imageUrl}`);

    } catch (error) {
      console.error("Upload failed:", error);
      setResult("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>Art Description Generator</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Art preview"
          style={{ maxWidth: '100%', marginTop: '15px' }}
        />
      )}

      <textarea
        placeholder="Enter a brief description of your artwork (optional)"
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
        style={{ width: '100%', margin: '10px 0', padding: '10px', boxSizing: 'border-box' }}
      />

      <button
        onClick={handleSubmit}
        disabled={uploading}
        style={{
          width: '100%',
          margin: '10px 0',
          padding: '10px',
          boxSizing: 'border-box',
          backgroundColor: uploading ? '#ccc' : '#007bff',
          color: 'white',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Uploading...' : 'Generate Full Description'}
      </button>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
            whiteSpace: 'pre-wrap' // Keep line breaks
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

export default MainPage;