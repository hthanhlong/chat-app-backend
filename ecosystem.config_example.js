module.exports = {
  apps: [
    {
      name: '',
      script: '',
      env: {
        NODE_ENV: '',
        TZ: '',
        PORT: '',
        CORS_URL: '*',
        DB_HOST: '',
        DB_PORT: '',
        DB_USER: '',
        DB_USER_PWD: '',
        DB_NAME: '',
        DB_MIN_POOL_SIZE: 2,
        DB_MAX_POOL_SIZE: 5,
        REDIS_URL: '',
        ACCESS_TOKEN_VALIDITY_SEC: '',
        REFRESH_TOKEN_VALIDITY_SEC: '',
        JWT_SECRET_ACCESS: '',
        JWT_SECRET_REFRESH: '',
        GOOGLE_CLIENT_ID: '',
        PASSWORD_KEY: ''
      },
      env_production: {
        NODE_ENV: 'production'
        // Production environment variables
      }
    }
  ]
}
