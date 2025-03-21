
import { ParsedCsvData } from './csvParser';
import { encryptData, decryptData } from './encryption';

// GitHub API configuration - these would come from environment variables in production
const GITHUB_TOKEN = 'ghp_yourgithubtoken'; // Replace with your actual token for testing
const GITHUB_USERNAME = 'mtu-chapel';
const GITHUB_REPO = 'chapel-attendance-data';
const GITHUB_BRANCH = 'main';
const DATA_PATH = 'data/attendance';

export interface StoredAttendanceData {
  id: string;
  timestamp: string;
  filename: string;
  uploadedBy: string;
  data: ParsedCsvData;
}

// Simulate GitHub API for development without exposing tokens
const simulateGitHubApi = true;

// In-memory cache for development
let localStorageCache: StoredAttendanceData[] = [];

/**
 * Stores attendance data in GitHub repository
 */
export const storeAttendanceData = async (
  data: ParsedCsvData, 
  filename: string, 
  username: string
): Promise<StoredAttendanceData> => {
  const timestamp = new Date().toISOString();
  const id = `attendance-${Date.now()}`;
  
  const storageData: StoredAttendanceData = {
    id,
    timestamp,
    filename,
    uploadedBy: username,
    data
  };
  
  if (simulateGitHubApi) {
    // Store in localStorage for development/demo
    try {
      // Get existing data
      const existingData = localStorage.getItem('mtu_attendance_data');
      let dataArray: StoredAttendanceData[] = [];
      
      if (existingData) {
        dataArray = JSON.parse(existingData);
      }
      
      // Add new data
      dataArray.push(storageData);
      
      // Save back to localStorage
      localStorage.setItem('mtu_attendance_data', JSON.stringify(dataArray));
      
      // Update cache
      localStorageCache = dataArray;
      
      console.log('Stored attendance data in localStorage:', storageData);
      return storageData;
    } catch (error) {
      console.error('Error storing data in localStorage:', error);
      throw new Error('Failed to store attendance data');
    }
  }
  
  // Real GitHub API implementation
  try {
    // Construct file path in the GitHub repo
    const filePath = `${DATA_PATH}/${id}.json`;
    
    // Convert data to JSON string
    const content = JSON.stringify(storageData, null, 2);
    
    // Encrypt the content for additional security
    const encryptedContent = encryptData(content);
    
    // Convert content to base64 for GitHub API
    const contentBase64 = btoa(unescape(encodeURIComponent(encryptedContent)));
    
    // Create file in GitHub repository
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload attendance data - ${filename} - ${timestamp}`,
          content: contentBase64,
          branch: GITHUB_BRANCH,
        }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to store data in GitHub: ${errorData.message}`);
    }
    
    return storageData;
  } catch (error) {
    console.error('Error storing data in GitHub:', error);
    throw new Error('Failed to store attendance data in GitHub');
  }
};

/**
 * Retrieves all stored attendance data from GitHub
 */
export const getStoredAttendanceData = async (): Promise<StoredAttendanceData[]> => {
  if (simulateGitHubApi) {
    // Return from localStorage for development/demo
    try {
      // If we have a cache, use it
      if (localStorageCache.length > 0) {
        return localStorageCache;
      }
      
      // Get data from localStorage
      const storedData = localStorage.getItem('mtu_attendance_data');
      
      if (!storedData) {
        return [];
      }
      
      const parsedData: StoredAttendanceData[] = JSON.parse(storedData);
      
      // Sort by timestamp (newest first)
      const sortedData = parsedData.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Update cache
      localStorageCache = sortedData;
      
      console.log('Retrieved attendance data from localStorage:', sortedData);
      return sortedData;
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return [];
    }
  }
  
  // Real GitHub API implementation
  try {
    // First, get the contents of the data directory
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${DATA_PATH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    
    if (!response.ok) {
      // If directory doesn't exist yet, return empty array
      if (response.status === 404) {
        return [];
      }
      
      const errorData = await response.json();
      throw new Error(`Failed to fetch data from GitHub: ${errorData.message}`);
    }
    
    const files = await response.json();
    
    // If no files found, return empty array
    if (!Array.isArray(files) || files.length === 0) {
      return [];
    }
    
    // Fetch content of each JSON file
    const dataPromises = files
      .filter(file => file.name.endsWith('.json'))
      .map(async (file) => {
        const fileResponse = await fetch(file.download_url, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        });
        
        if (!fileResponse.ok) {
          console.error(`Failed to fetch file: ${file.name}`);
          return null;
        }
        
        const encryptedContent = await fileResponse.text();
        
        // Decrypt the content
        try {
          const decryptedContent = decryptData(encryptedContent);
          return JSON.parse(decryptedContent) as StoredAttendanceData;
        } catch (error) {
          console.error(`Failed to decrypt file: ${file.name}`, error);
          return null;
        }
      });
    
    const results = await Promise.all(dataPromises);
    
    // Filter out any null results and sort by timestamp (newest first)
    return results
      .filter(item => item !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error retrieving data from GitHub:', error);
    throw new Error('Failed to retrieve attendance data from GitHub');
  }
};

/**
 * Retrieves a single attendance data record by ID
 */
export const getAttendanceDataById = async (id: string): Promise<StoredAttendanceData | null> => {
  if (simulateGitHubApi) {
    // Return from localStorage for development/demo
    try {
      // If we have a cache, use it
      if (localStorageCache.length > 0) {
        return localStorageCache.find(item => item.id === id) || null;
      }
      
      // Get data from localStorage
      const storedData = localStorage.getItem('mtu_attendance_data');
      
      if (!storedData) {
        return null;
      }
      
      const parsedData: StoredAttendanceData[] = JSON.parse(storedData);
      
      // Update cache
      localStorageCache = parsedData;
      
      // Find and return the matching record
      return parsedData.find(item => item.id === id) || null;
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return null;
    }
  }
  
  // Real GitHub API implementation
  try {
    const filePath = `${DATA_PATH}/${id}.json`;
    
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      
      const errorData = await response.json();
      throw new Error(`Failed to fetch data from GitHub: ${errorData.message}`);
    }
    
    const file = await response.json();
    
    // Fetch and parse the raw content
    const contentResponse = await fetch(file.download_url);
    
    if (!contentResponse.ok) {
      throw new Error(`Failed to fetch file content`);
    }
    
    const encryptedContent = await contentResponse.text();
    
    // Decrypt the content
    try {
      const decryptedContent = decryptData(encryptedContent);
      return JSON.parse(decryptedContent) as StoredAttendanceData;
    } catch (error) {
      console.error(`Failed to decrypt file: ${id}.json`, error);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data from GitHub:', error);
    throw new Error('Failed to retrieve attendance data from GitHub');
  }
};

/**
 * Updates an existing attendance record
 */
export const updateAttendanceData = async (
  id: string,
  updatedData: Partial<StoredAttendanceData>
): Promise<StoredAttendanceData | null> => {
  if (simulateGitHubApi) {
    try {
      // Get existing data
      const storedData = localStorage.getItem('mtu_attendance_data');
      
      if (!storedData) {
        return null;
      }
      
      const parsedData: StoredAttendanceData[] = JSON.parse(storedData);
      
      // Find the record to update
      const index = parsedData.findIndex(item => item.id === id);
      
      if (index === -1) {
        return null;
      }
      
      // Update the record
      parsedData[index] = {
        ...parsedData[index],
        ...updatedData,
        timestamp: updatedData.timestamp || new Date().toISOString() // Update timestamp if not provided
      };
      
      // Save back to localStorage
      localStorage.setItem('mtu_attendance_data', JSON.stringify(parsedData));
      
      // Update cache
      localStorageCache = parsedData;
      
      return parsedData[index];
    } catch (error) {
      console.error('Error updating data in localStorage:', error);
      return null;
    }
  }
  
  // Real GitHub API implementation would go here
  // This would involve fetching the file, updating it, and pushing back to GitHub
  return null;
};
