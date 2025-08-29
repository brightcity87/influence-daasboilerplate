export default {
  admin: {
    routes: [
      {
        method: 'POST',
        path: '/upload',
        handler: 'myController.upload',
        config: {
          type: 'multipart',
          auth: false,
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'GET',
        path: '/fields',
        handler: 'myController.getFields',
        config: {
          auth: false,
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'GET',
        path: '/rows',
        handler: 'myController.getAllRows',
        config: {
          auth: false,
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'GET',
        path: '/upload/:id',
        handler: 'myController.getJobStatus',
        config: {
          auth: false,
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'GET',
        path: '/upload/:id/progress',
        handler: 'myController.subscribeToJob',
        config: {
          auth: false,
          policies: [],
          middlewares: [],
          timeout: 0 // Disable timeout for SSE
        }
      },
      {
        method: 'GET',
        path: '/active-jobs',
        handler: 'myController.getActiveJobs',
        config: {
          auth: false,
          policies: [],
          middlewares: []
        }
      }
    ]
  }
};
