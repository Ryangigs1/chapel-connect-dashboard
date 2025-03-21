
import { encryptData, decryptData } from './encryption';

// Define the image interface
interface GalleryImage {
  id: string;
  title: string;
  url: string;
  date: string;
  category: string;
  uploadedBy?: string;
}

// In-memory cache for development
let imageCache: GalleryImage[] = [];

/**
 * Stores an image in simulated GitHub storage
 */
export const storeImageInGithub = async (image: GalleryImage): Promise<void> => {
  try {
    // Get existing images
    const existingImages = localStorage.getItem('mtu_gallery_images');
    let imagesArray: GalleryImage[] = [];
    
    if (existingImages) {
      imagesArray = JSON.parse(existingImages);
    }
    
    // Add new image
    imagesArray.unshift(image);
    
    // Encrypt and save back to localStorage
    const encryptedData = encryptData(JSON.stringify(imagesArray));
    localStorage.setItem('mtu_gallery_images', encryptedData);
    
    // Update cache
    imageCache = imagesArray;
    
    console.log('Stored image in local storage:', image.id);
  } catch (error) {
    console.error('Error storing image:', error);
    throw new Error('Failed to store image');
  }
};

/**
 * Retrieves all stored images from GitHub
 */
export const getStoredImages = async (): Promise<GalleryImage[]> => {
  try {
    // If we have a cache, use it
    if (imageCache.length > 0) {
      return imageCache;
    }
    
    // Get images from localStorage
    const storedData = localStorage.getItem('mtu_gallery_images');
    
    if (!storedData) {
      return [];
    }
    
    // Decrypt the data
    const decryptedData = decryptData(storedData);
    const parsedData: GalleryImage[] = JSON.parse(decryptedData);
    
    // Update cache
    imageCache = parsedData;
    
    console.log('Retrieved images from local storage:', parsedData.length);
    return parsedData;
  } catch (error) {
    console.error('Error retrieving images:', error);
    return [];
  }
};

/**
 * Deletes an image by ID
 */
export const deleteImage = async (id: string): Promise<void> => {
  try {
    // Get existing images
    const existingImages = localStorage.getItem('mtu_gallery_images');
    
    if (!existingImages) {
      return;
    }
    
    // Decrypt and parse
    const decryptedData = decryptData(existingImages);
    let imagesArray: GalleryImage[] = JSON.parse(decryptedData);
    
    // Filter out the image to delete
    imagesArray = imagesArray.filter(image => image.id !== id);
    
    // Encrypt and save back to localStorage
    const encryptedData = encryptData(JSON.stringify(imagesArray));
    localStorage.setItem('mtu_gallery_images', encryptedData);
    
    // Update cache
    imageCache = imagesArray;
    
    console.log('Deleted image:', id);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};
