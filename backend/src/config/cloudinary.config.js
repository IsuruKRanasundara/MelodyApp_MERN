

import {v2 as cloudinary} from 'cloudinary';

// Configure Cloudinary using environment variables



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate streaming URL for audio files that works with frontend
export const generateAudioStreamUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'mp3',
    flags: 'streaming_attachment',
    secure: true
  });
};

// Generate optimized audio URL for direct playback
export const generateAudioPlaybackUrl = (publicId, originalUrl) => {
  try {
    // Use explicit cloud_name to avoid configuration issues
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.warn('CLOUDINARY_CLOUD_NAME not found in environment variables');
      return originalUrl; // Return original if we can't transform
    }

    // Use Cloudinary SDK for proper URL generation (handles format conversion better)
    try {
      const optimizedUrl = cloudinary.url(publicId, {
        resource_type: 'video',
        format: 'mp3',
        quality: 'auto',
        secure: true,
        sign_url: false
      });
      console.log('Generated optimized URL using SDK:', optimizedUrl);
      return optimizedUrl;
    } catch (sdkError) {
      console.warn('SDK URL generation failed, using manual construction:', sdkError);
      // Fallback: Build URL manually (less reliable but might work)
      const baseUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;
      const transformations = 'f_mp3,q_auto';
      // Don't add .mp3 extension - let Cloudinary handle it
      return `${baseUrl}/${transformations}/${publicId}`;
    }
  } catch (error) {
    console.error('Error generating audio playback URL:', error);
    return originalUrl; // Return original URL as fallback
  }
};

// Get the base streaming URL for the frontend
export const getStreamingBaseUrl = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/video/upload/`;
};

// Get frontend-compatible audio URL
export const getFrontendAudioUrl = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null;
  
  console.log('Processing cloudinary URL:', cloudinaryUrl);
  
  // Check if URL already has MP3 format transformation
  if (cloudinaryUrl.includes('/f_mp3') || cloudinaryUrl.includes('/q_auto')) {
    console.log('URL already has MP3 transformations, using as-is');
    return cloudinaryUrl;
  }

  // If it's a Cloudinary URL without format conversion, add MP3 format for browser compatibility
  if (cloudinaryUrl.includes('cloudinary.com')) {
    try {
      // Extract public_id from the URL
      const parts = cloudinaryUrl.split('/');
      const uploadIndex = parts.indexOf('upload');
      
      if (uploadIndex !== -1 && parts[uploadIndex + 1]) {
        // Get everything after 'upload/'
        let pathAfterUpload = parts.slice(uploadIndex + 1).join('/');
        
        // Remove version number if present (e.g., v1699999999/)
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
        
        // Check if there are existing transformations (between upload/ and public_id)
        // Pattern: upload/[transformations]/public_id.ext
        let publicId = pathAfterUpload;
        let transformations = '';
        
        // Check if there are transformations (they appear before the last segment)
        const pathSegments = pathAfterUpload.split('/');
        if (pathSegments.length > 1) {
          // Everything except the last segment is transformations
          const lastSegment = pathSegments[pathSegments.length - 1];
          const transformParts = pathSegments.slice(0, -1);
          
          // Check if these are actual transformations (contain underscore like f_mp3) or part of path
          const hasTransforms = transformParts.some(part => part.includes('_') || part.match(/^[a-z]_/));
          
          if (hasTransforms) {
            transformations = transformParts.join('/');
            publicId = lastSegment;
          } else {
            // No transformations, entire pathAfterUpload is the public_id
            publicId = pathAfterUpload;
          }
        }
        
        // Remove file extension from public_id
        publicId = publicId.replace(/\.[^/.]+$/, '');
        
        console.log('Extracted public_id:', publicId);
        console.log('Existing transformations:', transformations || 'none');
        
        // Generate URL with MP3 format transformation
        const optimizedUrl = generateAudioPlaybackUrl(publicId, cloudinaryUrl);
        console.log('Generated optimized MP3 URL:', optimizedUrl);
        
        // Return optimized URL if generation succeeded, otherwise fallback to original
        return optimizedUrl || cloudinaryUrl;
      }
    } catch (error) {
      console.error('Error processing Cloudinary URL:', error);
      // If processing fails, try to add format manually to the URL
      // This is a last resort fallback
      if (cloudinaryUrl.includes('/upload/') && !cloudinaryUrl.includes('/f_mp3')) {
        // Try to inject format transformation
        const formatUrl = cloudinaryUrl.replace('/upload/', '/upload/f_mp3,q_auto/');
        console.log('Fallback: Trying manually formatted URL:', formatUrl);
        return formatUrl;
      }
      return cloudinaryUrl;
    }
  }
  
  // For non-Cloudinary URLs, return as-is
  return cloudinaryUrl;
};

// Verify cloudinary is properly configured
if (!cloudinary || !cloudinary.uploader) {
  console.error("ERROR: Cloudinary is not properly initialized!");
} else {
  console.log("Cloudinary configured with audio streaming support");
  console.log("Cloudinary uploader available:", !!cloudinary.uploader);
}

export default cloudinary;
