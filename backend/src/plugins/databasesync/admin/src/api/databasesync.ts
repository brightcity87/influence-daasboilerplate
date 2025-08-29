import { request } from "@strapi/helper-plugin";

interface UploadResponse {
  jobId: string;
}

interface JobStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  error?: string;
}

interface FieldsResponse {
  fields: string[];
}

interface GetRowsResponse {
  data: any[];
}



interface SubscribeToJobResponse {
  jobId: string;
}

export const syncDatabaseRequests = {
  getFields: async (): Promise<FieldsResponse> => {
    return await request("/databasesync/fields", {
      method: "GET"
    });
  },
  getActiveJobs: async (): Promise<JobStatus[]> => {
    const apiResponse = await request("/databasesync/active-jobs", {
      method: "GET"
    });
    if (apiResponse?.jobs) {
      return apiResponse.jobs;
    }
    return [];
  },
  subscribeToJob: async (jobId: string, onProgress: (status: JobStatus) => void): Promise<SubscribeToJobResponse> => {
    const eventSource = new EventSource(`/databasesync/upload/${jobId}/progress`);

    eventSource.onmessage = (event) => {
      const status: JobStatus = JSON.parse(event.data);
      onProgress(status);

      // Close connection when job is done
      if (status.status === 'completed' || status.status === 'failed') {
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
      onProgress({
        id: jobId,
        status: 'failed',
        progress: 0,
        totalRows: 0,
        processedRows: 0,
        error: 'Lost connection to server'
      });
    };
    return { jobId };
  },

  upload: async (formData: FormData, onProgress?: (status: JobStatus) => void): Promise<JobStatus> => {
    // Ensure the formData includes the file field
    if (!formData.has('files')) {
      throw new Error('FormData must include a file field');
    }

    // Get the data from formData
    const dataStr = formData.get('data') as string;
    const data = JSON.parse(dataStr);

    // Add important fields to data if they exist
    if (data.importantFields) {
      formData.set('data', JSON.stringify({
        ...data,
        importantFields: data.importantFields
      }));
    }

    // Start the upload
    const response = await fetch("/databasesync/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const { jobId } = await response.json();

    // Set up SSE connection for progress updates
    if (onProgress) {
      const eventSource = new EventSource(`/databasesync/upload/${jobId}/progress`);

      eventSource.onmessage = (event) => {
        const status: JobStatus = JSON.parse(event.data);
        onProgress(status);

        // Close connection when job is done
        if (status.status === 'completed' || status.status === 'failed') {
          eventSource.close();
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();
        onProgress({
          id: jobId,
          status: 'failed',
          progress: 0,
          totalRows: 0,
          processedRows: 0,
          error: 'Lost connection to server'
        });
      };
    }

    // Poll for initial status
    const initialStatus = await syncDatabaseRequests.getJobStatus(jobId);
    return initialStatus;
  },

  getJobStatus: async (jobId: string): Promise<JobStatus> => {
    const response = await fetch(`/databasesync/upload/${jobId}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get job status');
    }

    return await response.json();
  },

  getAllRows: async (): Promise<GetRowsResponse> => {
    return await request("/databasesync/rows", {
      method: "GET"
    });
  }
};
