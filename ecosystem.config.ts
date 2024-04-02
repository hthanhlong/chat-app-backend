module.exports = {
  apps: [
    {
      name: 'my-app',
      script: 'app.js',
      env: {
        NODE_ENV: 'development',
        DB_HOST: 'localhost'
        // Add other environment variables here
      },
      env_production: {
        NODE_ENV: 'production'
        // Production environment variables
      }
    }
  ]
}
