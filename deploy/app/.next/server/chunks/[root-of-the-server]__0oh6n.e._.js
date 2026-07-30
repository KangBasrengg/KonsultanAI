module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},883272,e=>{"use strict";let t=Symbol.for("__cloudflare-context__");function r(){return globalThis[t]}async function n(){let e=r();if(e)return e;{var n;let e=await o();return n=e,globalThis[t]=n,e}}async function o(e){let{getPlatformProxy:t}=await import(`${"__wrangler".replaceAll("_","")}`),r=e?.environment??process.env.NEXT_DEV_WRANGLER_ENV,{env:n,cf:o,ctx:a}=await t({...e,envFiles:[],environment:r});return{env:n,cf:o,ctx:a}}let a=`

ERROR: \`getCloudflareContext\` has been called without having called \`initOpenNextCloudflareForDev\` from the Next.js config file.
You should update your Next.js config file as shown below:

   \`\`\`
   // next.config.mjs

   import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

   initOpenNextCloudflareForDev();

   const nextConfig = { ... };
   export default nextConfig;
   \`\`\`

`;e.s(["getCloudflareContext",0,function(e={async:!1}){return e.async?n():function(){let e,t=r();if(t)return t;if(e=globalThis,e.__NEXT_DATA__?.nextExport===!0)throw Error("  - make sure that the call is not at the top level and that the route is not static\n  - call `getCloudflareContext({async: true})` to use the `async` mode\n  - avoid calling `getCloudflareContext` in the route\n");throw Error(a)}()}])},495879,(e,t,r)=>{t.exports=e.x("node:dns",()=>require("node:dns"))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0oh6n.e._.js.map