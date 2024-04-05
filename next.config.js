/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [ "antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table" ],
  env: {
    NEXT_PUBLIC_SUPABASE_PUBLIC_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aXpyYWt0d3RjdXB5bmlyeGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0NDQ4NDEsImV4cCI6MjAyMDAyMDg0MX0.R25uxXXNKh0BbI_BjgOnC541EJW0i0tIk--boIkatvs",
    NEXT_PUBLIC_SUPABASE_URL:"https://nyizraktwtcupynirxii.supabase.co"
  },
};

module.exports = nextConfig;
