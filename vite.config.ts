import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { createHtmlPlugin } from 'vite-plugin-html'

function findHtmlFiles(srcDir: string): { [key: string]: string } {
  const htmlFiles: { [key: string]: string } = {};

  function traverseDir(dir: string) {
    try {
      fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          traverseDir(filePath);
        } else if (file.endsWith('.html')) {
          const fileName = file.replace('.html', '');
          htmlFiles[fileName] = filePath.replaceAll('\\', '/');
        }
      });
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
      return;
    }
  }

  traverseDir(path.join(__dirname, 'src', srcDir));
  return htmlFiles;
}

export default defineConfig({
  root: path.join(__dirname, 'src'),
  base: './',
  build: {
    emptyOutDir: true,
    outDir: path.join(__dirname, 'dist'),
    target: 'es6',
    rollupOptions: {
      input: findHtmlFiles('/')
    }
  },
  plugins: [
    createHtmlPlugin({
      minify: true
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  },
  server: {
    port: 8080
  }
});