/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sea1.ingest.uploadthing.com',
        port: '',
        pathname: '/**',           // любая вложенная папка
      },
      // короткие ссылки utfs.io
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**',         // все пути, начинающиеся с /f/
      },
      // возможно, ещё один домен для CDN:
      {
        protocol: 'https',
        hostname: 'utfs-cdn.uploadthing.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
