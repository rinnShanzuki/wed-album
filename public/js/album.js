document.addEventListener('DOMContentLoaded', () => {
    const albumGrid = document.getElementById('albumGrid');
    const photoViewer = document.getElementById('photoViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerGuestName = document.getElementById('viewerGuestName');
    const closeViewer = document.getElementById('closeViewer');
    const downloadLink = document.getElementById('downloadLink');
    
    // Will be set by EJS template?
    // Supabase URL is needed here. For simplicity, we can fetch it via an endpoint or infer it if we pass it, but API gives full JSON. Let's just use API.
    
    async function loadPhotos() {
        try {
            const response = await fetch(`/api/weddings/${window.WEDDING_SLUG}/photos`);
            const result = await response.json();
            
            if (response.ok) {
                renderPhotos(result.photos);
            } else {
                albumGrid.innerHTML = '<div class="error">Failed to load memories.</div>';
            }
        } catch (err) {
            albumGrid.innerHTML = '<div class="error">Network error.</div>';
        }
    }
    
    function renderPhotos(photos) {
        if (!photos || photos.length === 0) {
            albumGrid.innerHTML = '<div class="no-photos">No memories shared yet. Be the first!</div>';
            albumGrid.style.display = 'block';
            albumGrid.style.textAlign = 'center';
            albumGrid.style.padding = '40px 20px';
            return;
        }
        
        albumGrid.innerHTML = '';
        
        photos.forEach(photo => {
            const el = document.createElement('div');
            el.className = 'photo-item';
            
            const img = document.createElement('img');
            // We need the supabase URL to construct the public URL.
            // A better way would be API returning the full URL. Let's assume the API returns the path, and we just need the domain.
            // I'll fetch the URL from a global variable if needed, or better, change API to return full URLs.
            // Since we didn't change the API yet to return full URLs, I'll extract host from the image path somehow.
            
            // Wait, we need the supabase URL in the frontend. Let's ask API to return it, or just use a trick.
            // Let's modify the API response in our head. We can't now.
            // I'll just write a script tag in layout? No, I'll update the API route to return the storage url base if I have to.
            // Alternatively, in album.js we can make it so the API returns the full path. Let's just create a quick patch for API or just use the current hostname if we proxied it. 
            // We didn't proxy. Let me use window.location.origin for a relative fetch? No, Supabase is external.
            
            // For now, I'll append a data attribute in EJS. No, we are fetching via JS.
            // Let me update photo.controller.js to return the full URL. Yes!
            img.src = ''; 
            
            // I will use a placeholder and then I'll use multi_replace to fix the controller.
            el.appendChild(img);
            
            el.addEventListener('click', () => {
                openViewer(photo);
            });
            
            albumGrid.appendChild(el);
            
            // Set image src after appending
            img.src = photo.thumbnailUrl;
        });
    }
    
    function openViewer(photo) {
        viewerImage.src = photo.imageUrl;
        viewerGuestName.textContent = photo.guest_name;
        downloadLink.href = photo.imageUrl;
        photoViewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeViewer.addEventListener('click', () => {
        photoViewer.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    loadPhotos();
});
