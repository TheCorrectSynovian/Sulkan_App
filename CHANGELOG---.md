CHANGELOG---
- 26.2-snapshot-4
- dynamic lighting
- fixes terrain rendering and water issues
- big performance jump in terrain rendering
- Settings available. 
- I recommend using high for shadow and water and ambient occlusion off
- it's an exp build due to some bugs, but just to get some early testing in. Entity shadows and - some things have a few issues
0.1.5 - 26.2-snapshot-4 full release
https://modrinth.com/mod/sulkan
- I did some optimization work. This is with shadows and water at ultra. Still a bit of bottle neck to fully use the GPU and CPU but, now the game should be way more CPU efficient
- I implimented indirect rendering which significantly reduces the CPU overhead. Downside is it doesn't work with mac very well, so it does a fallback. But for all other devices CPU usage should drop quite a bit
- <@1131940729145528320> try this version for mac. Thanks!
