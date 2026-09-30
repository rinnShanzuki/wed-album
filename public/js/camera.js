document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('videoElement');
    const canvasElement = document.getElementById('canvasElement');
    const photoPreview = document.getElementById('photoPreview');
    const captureBtn = document.getElementById('captureBtn');
    const switchCameraBtn = document.getElementById('switchCameraBtn');
    const fileUpload = document.getElementById('fileUpload');
    const retakeBtn = document.getElementById('retakeBtn');
    const usePhotoBtn = document.getElementById('usePhotoBtn');
    
    const cameraControls = document.getElementById('camera-controls');
    const previewControls = document.getElementById('preview-controls');
    const uploadingOverlay = document.getElementById('uploadingOverlay');
    const errorOverlay = document.getElementById('errorOverlay');
    
    let stream = null;
    let currentFacingMode = 'environment';
    let currentImageBlob = null;
    
    // Initialize Camera
    async function startCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: currentFacingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            });
            
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            photoPreview.style.display = 'none';
            cameraControls.style.display = 'flex';
            previewControls.style.display = 'none';
        } catch (err) {
            console.error('Error accessing camera:', err);
            showError('Camera Access Denied', 'Please allow camera access or use the gallery button to upload a photo.');
        }
    }
    
    // Check limit on load
    if (window.PHOTO_COUNT >= window.MAX_PHOTOS) {
        showError('Limit Reached', `You've captured ${window.MAX_PHOTOS} memories. Thank you!`);
        captureBtn.disabled = true;
        fileUpload.disabled = true;
    } else {
        startCamera();
    }
    
    // Switch Camera
    switchCameraBtn.addEventListener('click', () => {
        currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
        startCamera();
    });
    
    // Capture Photo
    captureBtn.addEventListener('click', () => {
        if (window.PHOTO_COUNT >= window.MAX_PHOTOS) return;
        
        const context = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        
        // Draw image
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // Show preview
        photoPreview.src = canvasElement.toDataURL('image/jpeg', 0.9);
        videoElement.style.display = 'none';
        photoPreview.style.display = 'block';
        
        cameraControls.style.display = 'none';
        previewControls.style.display = 'flex';
        
        // Convert to blob for upload
        canvasElement.toBlob((blob) => {
            currentImageBlob = blob;
        }, 'image/jpeg', 0.9);
    });
    
    // File Upload (Gallery)
    fileUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            if (window.PHOTO_COUNT >= window.MAX_PHOTOS) return;
            
            const file = e.target.files[0];
            currentImageBlob = file;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.src = e.target.result;
                videoElement.style.display = 'none';
                photoPreview.style.display = 'block';
                
                cameraControls.style.display = 'none';
                previewControls.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Retake
    retakeBtn.addEventListener('click', () => {
        currentImageBlob = null;
        startCamera();
    });
    
    // Use Photo / Upload
    usePhotoBtn.addEventListener('click', async () => {
        if (!currentImageBlob) return;
        
        uploadingOverlay.style.display = 'flex';
        
        const formData = new FormData();
        formData.append('photo', currentImageBlob, 'wedding-photo.jpg');
        
        try {
            const response = await fetch(`/api/photos`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            uploadingOverlay.style.display = 'none';
            
            if (response.ok) {
                window.location.href = `/w/${window.WEDDING_SLUG}/success`;
            } else {
                showError('Upload Failed', result.error || 'Something went wrong while saving your photo.');
            }
        } catch (err) {
            uploadingOverlay.style.display = 'none';
            showError('Network Error', 'Please check your connection and try again.');
        }
    });
    
    // Error Handling
    function showError(title, message) {
        document.getElementById('errorTitle').textContent = title;
        document.getElementById('errorMessage').textContent = message;
        errorOverlay.style.display = 'flex';
    }
    
    document.getElementById('closeErrorBtn').addEventListener('click', () => {
        errorOverlay.style.display = 'none';
    });
});
