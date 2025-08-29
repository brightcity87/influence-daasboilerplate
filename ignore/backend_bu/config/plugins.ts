
export default {
    'schemas-to-ts': {
      enabled: false,
      config: {
        acceptedNodeEnvs: process.env.ENVIRONMENT === 'development' ? ['development'] : ['production'],
        commonInterfacesFolderName: "schemas-to-ts",
        verboseLogs: process.env.ENVIRONMENT === 'development' ? true : false,
        alwaysAddEnumSuffix: false
      }
  
    },

    'databasesync': {
      enabled: true,
      resolve: './src/plugins/databasesync'
    },

    'drag-drop-content-types': {
      enabled: true
    }
  
  
  };
  