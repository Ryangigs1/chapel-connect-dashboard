
import { encryptData, decryptData } from './encryption';

// Constants
const MUSIC_STORAGE_KEY = 'mtu_chapel_music';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  uploadedBy: string;
  uploadDate: string;
  fileUrl: string;
  coverArtUrl?: string;
  duration?: string;
  genre?: string;
}

/**
 * Store music tracks in localStorage (temporarily)
 * In production, this would use GitHub storage API
 */
export const storeTracks = (tracks: MusicTrack[]): void => {
  try {
    const encryptedTracks = encryptData(tracks);
    localStorage.setItem(MUSIC_STORAGE_KEY, encryptedTracks);
  } catch (error) {
    console.error('Error storing music tracks:', error);
  }
};

/**
 * Retrieve music tracks from storage
 */
export const getTracks = (): MusicTrack[] => {
  try {
    const storedTracks = localStorage.getItem(MUSIC_STORAGE_KEY);
    
    if (!storedTracks) {
      return [];
    }
    
    const decryptedTracks = decryptData(storedTracks);
    return decryptedTracks || [];
  } catch (error) {
    console.error('Error retrieving music tracks:', error);
    return [];
  }
};

/**
 * Add a new track to storage
 */
export const addTrack = (track: MusicTrack): MusicTrack[] => {
  const tracks = getTracks();
  const updatedTracks = [...tracks, track];
  storeTracks(updatedTracks);
  return updatedTracks;
};

/**
 * Remove a track from storage
 */
export const removeTrack = (trackId: string): MusicTrack[] => {
  const tracks = getTracks();
  const updatedTracks = tracks.filter(track => track.id !== trackId);
  storeTracks(updatedTracks);
  return updatedTracks;
};

/**
 * Get a track by ID
 */
export const getTrackById = (trackId: string): MusicTrack | undefined => {
  const tracks = getTracks();
  return tracks.find(track => track.id === trackId);
};

/**
 * Mock function to simulate uploading to GitHub
 * In a real app, this would use GitHub API
 */
export const uploadMusicToGitHub = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Create a blob URL to simulate a remote URL
      const url = URL.createObjectURL(file);
      resolve(url);
    }, 1500);
  });
};
