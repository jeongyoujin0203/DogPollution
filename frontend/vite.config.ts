import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {viteStaticCopy} from 'vite-plugin-static-copy'

export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'public/*.geojson',  // GeoJSON 파일 경로
                    dest: 'data'  // 빌드 후 복사될 대상 폴더
                }
            ]
        })
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})