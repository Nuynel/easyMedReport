import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    react(),
    vike({
      prerender: {
        partial: false,
        noExtraDir: true,
      }
    }),
    svgr({include: '**/*.svg'}),
  ]
}

export default config
