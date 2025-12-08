import React, { useState, useRef } from 'react';
import '../styles/DiseaseSolution.css';

const DiseaseSolution = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [result, setResult] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    cropType: '',
    growthStage: '',
    symptoms: '',
    notes: '',
    language: 'en'
  });

  const quickCaptureInputRef = useRef(null);
  const imageUploadInputRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const backendBaseURL = "https://pest-disease-backend.onrender.com";

  const growthStages = [
    'Germination',
    'Seedling',
    'Vegetative',
    'Flowering',
    'Fruiting',
    'Maturity',
    'Harvest'
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload or capture an image.");
      return;
    }

    setIsProcessing(true);
    setResult("Processing...");
    setAudioUrl('');

    const submitFormData = new FormData();
    submitFormData.append("image", selectedFile);
    submitFormData.append("language", formData.language);
    submitFormData.append("crop_type", formData.cropType.trim());
    submitFormData.append("growth_stage", formData.growthStage);
    submitFormData.append("symptoms", formData.symptoms.trim());
    submitFormData.append("notes", formData.notes.trim());

    try {
      const response = await fetch(`${backendBaseURL}/predict/`, {
        method: "POST",
        body: submitFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      let resultHtml = `
        <div class="disease-font-bold disease-text-lg disease-mb-2 disease-text-green-700">Analysis Result</div>
        <p><b>Predicted Disease:</b> ${data.predicted_class}</p>
        <p><b>Advice:</b> ${data.recommendation.advice || "N/A"}</p>
      `;

      if (data.recommendation.pesticides && data.recommendation.pesticides.length) {
        resultHtml += `<p><b>Pesticides:</b> ${data.recommendation.pesticides.join(", ")}</p>`;
      }
      if (data.recommendation.fertilizers && data.recommendation.fertilizers.length) {
        resultHtml += `<p><b>Fertilizers:</b> ${data.recommendation.fertilizers.join(", ")}</p>`;
      }
      if (data.recommendation.dosage) {
        resultHtml += `<p><b>Dosage:</b> ${data.recommendation.dosage}</p>`;
      }

      setResult(resultHtml);

      if (data.tts_audio_url) {
        setAudioUrl(`${backendBaseURL}${data.tts_audio_url}`);
      }
    } catch (error) {
      setResult(`<span class="disease-text-red-500">Error: ${error.message}</span>`);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerQuickCapture = () => {
    quickCaptureInputRef.current?.click();
  };

  const triggerImageUpload = () => {
    imageUploadInputRef.current?.click();
  };

  return (
    <div className="disease-container">
      {/* Header */}
      <div className="disease-header">
        <a href="index4.html" className="disease-mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </a>
        <span>Disease Solution</span>
      </div>

      <div className="disease-space-y-6 disease-mt-4">
        {/* Upload or Capture Card */}
        <div className="disease-card">
          <h2 className="disease-text-xl disease-font-semibold disease-mb-2">Upload or Capture</h2>
          <p className="disease-text-sm disease-text-gray-500 disease-mb-4">
            Capture or upload a photo of your crop disease for instant analysis.
          </p>
          
          <div className="disease-flex-space">
            <button
              onClick={triggerQuickCapture}
              className="disease-capture-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 disease-mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 3-6 4 8z"
                />
              </svg>
              Quick Capture
            </button>
            
            <input
              ref={quickCaptureInputRef}
              type="file"
              accept="image/*"
              capture="camera"
              className="disease-file-input"
              onChange={handleFileChange}
            />
            
            <button
              onClick={triggerImageUpload}
              className="disease-capture-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 disease-mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414L9 2.586V11a1 1 0 11-2 0V4.586L4.707 7.707a1 1 0 01-1.414-1.414L8 1.172a1 1 0 011.414 0l4.707 4.707a1 1 0 01-1.414 1.414L10 4.414V11a1 1 0 11-2 0V4.414L6.293 6.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Upload Image
            </button>
            <input
              ref={imageUploadInputRef}
              type="file"
              accept="image/*"
              className="disease-file-input"
              onChange={handleFileChange}
            />
          </div>

          {/* Preview Section */}
          <div className={`disease-preview-container ${!imagePreview ? 'disease-hidden' : ''}`}>
            <p className="disease-text-sm disease-text-gray-600 disease-mb-2">Selected Image:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="disease-preview-image"
            />
          </div>
        </div>

        {/* Details Card */}
        <div className="disease-card">
          <h2 className="disease-text-xl disease-font-semibold disease-mb-4">
            Provide More Details (Optional)
          </h2>

          <div className="disease-grid-cols">
            <div>
              <label
                htmlFor="cropType"
                className="disease-block disease-text-sm disease-font-medium disease-text-gray-700"
              >
                Crop Type (optional)
              </label>
              <input
                type="text"
                id="cropType"
                value={formData.cropType}
                onChange={(e) => handleInputChange('cropType', e.target.value)}
                placeholder="e.g. Wheat, Rice, Tomato"
                className="disease-mt-1 disease-form-input"
              />
            </div>
            <div>
              <label
                htmlFor="growthStage"
                className="disease-block disease-text-sm disease-font-medium disease-text-gray-700"
              >
                Growth Stage (optional)
              </label>
              <select
                id="growthStage"
                value={formData.growthStage}
                onChange={(e) => handleInputChange('growthStage', e.target.value)}
                className="disease-mt-1 disease-form-input"
              >
                <option value="">-- Select stage --</option>
                {growthStages.map((stage, index) => (
                  <option key={index} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="disease-mb-4">
            <label htmlFor="symptoms" className="disease-block disease-text-sm disease-font-medium disease-text-gray-700">
              Symptoms Observed (optional)
            </label>
            <textarea
              id="symptoms"
              rows="3"
              value={formData.symptoms}
              onChange={(e) => handleInputChange('symptoms', e.target.value)}
              placeholder="Describe any visible issues..."
              className="disease-mt-1 disease-form-input disease-textarea"
            ></textarea>
          </div>

          <div className="disease-mb-4">
            <label htmlFor="notes" className="disease-block disease-text-sm disease-font-medium disease-text-gray-700">
              Additional Notes (optional)
            </label>
            <textarea
              id="notes"
              rows="3"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Other observations..."
              className="disease-mt-1 disease-form-input disease-textarea"
            ></textarea>
          </div>

          <div className="disease-mb-6">
            <label htmlFor="language" className="disease-block disease-text-sm disease-font-medium disease-text-gray-700">
              Select Language
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="disease-mt-1 disease-form-input"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>

          <div className="disease-text-center">
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="disease-submit-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 disease-mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L3 22l9-2 9 2z" />
              </svg>
              {isProcessing ? 'Processing...' : 'Submit for Analysis'}
            </button>
          </div>

          {result && (
            <div 
              className="disease-result" 
              dangerouslySetInnerHTML={{ __html: result }}
            />
          )}
          
          <audio 
            ref={audioPlayerRef}
            src={audioUrl}
            controls 
            className={`disease-audio-player ${!audioUrl ? 'disease-hidden' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default DiseaseSolution;