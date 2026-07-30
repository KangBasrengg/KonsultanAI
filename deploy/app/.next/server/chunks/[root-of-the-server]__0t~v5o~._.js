module.exports=[814747,(e,t,a)=>{t.exports=e.x("path",()=>require("path"))},193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},224361,(e,t,a)=>{t.exports=e.x("util",()=>require("util"))},522734,(e,t,a)=>{t.exports=e.x("fs",()=>require("fs"))},446786,(e,t,a)=>{t.exports=e.x("os",()=>require("os"))},427699,(e,t,a)=>{t.exports=e.x("events",()=>require("events"))},792509,(e,t,a)=>{t.exports=e.x("url",()=>require("url"))},921517,(e,t,a)=>{t.exports=e.x("http",()=>require("http"))},524836,(e,t,a)=>{t.exports=e.x("https",()=>require("https"))},406461,(e,t,a)=>{t.exports=e.x("zlib",()=>require("zlib"))},688947,(e,t,a)=>{t.exports=e.x("stream",()=>require("stream"))},504446,(e,t,a)=>{t.exports=e.x("net",()=>require("net"))},254799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},755004,(e,t,a)=>{t.exports=e.x("tls",()=>require("tls"))},433484,e=>{"use strict";var t=e.i(747909),a=e.i(174017),r=e.i(996250),n=e.i(759756),s=e.i(561916),o=e.i(174677),i=e.i(869741),l=e.i(316795),d=e.i(487718),p=e.i(995169),u=e.i(47587),c=e.i(666012),x=e.i(570101),m=e.i(626937),g=e.i(10372),h=e.i(193695);e.i(52474);var f=e.i(257297),v=e.i(89171),b=e.i(129508),y=e.i(224389);let k=b.default.createTransport({host:process.env.SMTP_HOST||"mail.konsultan-ai.com",port:parseInt(process.env.SMTP_PORT||"465"),secure:!0,auth:{user:process.env.SMTP_USER||"admin@konsultan-ai.com",pass:process.env.SMTP_PASS}});async function R(e){try{let{email:t,fullName:a}=await e.json();if(!t)return v.NextResponse.json({error:"Email is required"},{status:400});let r=(0,y.createClient)("https://hdvuzjabpfqabcxhbbci.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY),{data:n,error:s}=await r.from("users").select("created_at").eq("email",t).single();if(s||!n)return console.warn(`[WelcomeEmail] Attempted to send to unregistered email: ${t}`),v.NextResponse.json({success:!0});let o=new Date(n.created_at).getTime();if(Date.now()-o>9e5)return console.warn(`[WelcomeEmail] Attempted to send to old account: ${t}`),v.NextResponse.json({success:!0});let i=a||t.split("@")[0],l={from:`"KonsultanAI" <${process.env.SMTP_USER||"admin@konsultan-ai.com"}>`,to:t,subject:"🎉 Selamat Datang di KonsultanAI — Asisten Hukum AI Anda!",html:`
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #ffffff; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #d4af37, #b8941f); padding: 32px; text-align: center;">
            <h1 style="margin: 0 0 8px; font-size: 28px; color: #0a1628; letter-spacing: -0.5px;">⚖️ KonsultanAI</h1>
            <p style="margin: 0; font-size: 14px; color: #0a1628cc;">Asisten Hukum AI Indonesia</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 40px 32px;">
            <h2 style="margin: 0 0 16px; font-size: 22px; color: #ffffff;">
              Selamat Datang, ${i}! 🎉
            </h2>
            
            <p style="color: #c0c8d4; line-height: 1.7; font-size: 15px; margin-bottom: 24px;">
              Terima kasih telah mendaftar di <strong style="color: #d4af37;">konsultan-ai.com</strong>. 
              Kami sangat senang Anda bergabung bersama kami!
            </p>

            <p style="color: #c0c8d4; line-height: 1.7; font-size: 15px; margin-bottom: 32px;">
              Sekarang Anda bisa mendapatkan analisis hukum AI yang akurat, rekomendasi pasal-pasal relevan, 
              dan panduan langkah hukum — semua dalam hitungan detik.
            </p>

            <!-- Feature cards -->
            <div style="margin-bottom: 32px;">
              <div style="background: #111d33; border: 1px solid #1e3a5f; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                <p style="margin: 0; font-size: 14px;">
                  <span style="color: #d4af37; font-weight: bold;">🤖 Konsultasi AI</span><br/>
                  <span style="color: #8899aa;">Analisis kasus hukum real-time dengan AI yang menguasai seluruh bidang hukum Indonesia</span>
                </p>
              </div>
              <div style="background: #111d33; border: 1px solid #1e3a5f; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                <p style="margin: 0; font-size: 14px;">
                  <span style="color: #d4af37; font-weight: bold;">📚 Learning Center</span><br/>
                  <span style="color: #8899aa;">Modul edukasi hukum interaktif agar Anda lebih paham hak-hak Anda</span>
                </p>
              </div>
              <div style="background: #111d33; border: 1px solid #1e3a5f; border-radius: 12px; padding: 20px;">
                <p style="margin: 0; font-size: 14px;">
                  <span style="color: #d4af37; font-weight: bold;">⚖️ LegalKita UMKM</span><br/>
                  <span style="color: #8899aa;">Temukan advokat terpercaya sesuai spesialisasi dan wilayah Anda</span>
                </p>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="https://konsultan-ai.com/intake" 
                 style="display: inline-block; background: linear-gradient(135deg, #d4af37, #b8941f); color: #0a1628; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; letter-spacing: 0.3px;">
                Mulai Konsultasi Pertama Anda →
              </a>
            </div>

            <!-- Free trial info -->
            <div style="background: #0d1f3c; border: 1px solid #d4af3730; border-radius: 12px; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #d4af37;">
                🎁 Akun gratis Anda sudah termasuk <strong>3x konsultasi AI</strong> per 3 hari.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #8899aa;">
                Upgrade ke Premium untuk akses tanpa batas
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #060e1a; padding: 24px 32px; text-align: center;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #4a5568;">
              \xa9 ${new Date().getFullYear()} KonsultanAI — Asisten Hukum AI Indonesia
            </p>
            <p style="margin: 0; font-size: 11px; color: #4a5568;">
              <a href="https://konsultan-ai.com" style="color: #d4af37; text-decoration: none;">konsultan-ai.com</a> 
              &nbsp;|&nbsp; 
              <a href="https://konsultan-ai.com/privacy-policy" style="color: #4a5568; text-decoration: none;">Privacy Policy</a>
              &nbsp;|&nbsp;
              <a href="https://konsultan-ai.com/terms-of-service" style="color: #4a5568; text-decoration: none;">Terms of Service</a>
            </p>
          </div>
        </div>
      `};return await k.sendMail(l),console.log("[WelcomeEmail] Sent to:",t),v.NextResponse.json({success:!0})}catch(e){return console.error("[WelcomeEmail] Error:",e),v.NextResponse.json({success:!0})}}e.s(["POST",0,R],600986);var w=e.i(600986);let A=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/auth/welcome-email/route",pathname:"/api/auth/welcome-email",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/auth/welcome-email/route.ts",nextConfigOutput:"standalone",userland:w,...{}}),{workAsyncStorage:E,workUnitAsyncStorage:S,serverHooks:C}=A;async function T(e,t,r){r.requestMeta&&(0,n.setRequestMeta)(e,r.requestMeta),A.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/auth/welcome-email/route";v=v.replace(/\/index$/,"")||"/";let b=await A.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!b)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:y,deploymentId:k,params:R,nextConfig:w,parsedUrl:E,isDraftMode:S,prerenderManifest:C,routerServerContext:T,isOnDemandRevalidate:q,revalidateOnlyGenerated:P,resolvedPathname:I,clientReferenceManifest:_,serverActionsManifest:N}=b,j=(0,i.normalizeAppPath)(v),M=!!(C.dynamicRoutes[j]||C.routes[I]),O=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,E,!1):t.end("This page could not be found"),null);if(M&&!S){let e=!!C.routes[I],t=C.dynamicRoutes[j];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await O();throw new h.NoFallbackError}}let H=null;!M||A.isDev||S||(H="/index"===(H=I)?"/":H);let U=!0===A.isDev||!M,D=M&&!U;N&&_&&(0,o.setManifestsSingleton)({page:v,clientReferenceManifest:_,serverActionsManifest:N});let K=e.method||"GET",z=(0,s.getTracer)(),$=z.getActiveScopeSpan(),F=!!(null==T?void 0:T.isWrappedByNextServer),B=!!(0,n.getRequestMeta)(e,"minimalMode"),L=(0,n.getRequestMeta)(e,"incrementalCache")||await A.getIncrementalCache(e,w,C,B);null==L||L.resetRequestCache(),globalThis.__incrementalCache=L;let W={params:R,previewProps:C.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:U,incrementalCache:L,cacheLifeProfiles:w.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>A.onRequestError(e,t,r,n,T)},sharedContext:{buildId:y,deploymentId:k}},V=new l.NodeNextRequest(e),G=new l.NodeNextResponse(t),X=d.NextRequestAdapter.fromNodeNextRequest(V,(0,d.signalFromNodeResponse)(t));try{let n,o=async e=>A.handle(X,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=z.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${K} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",r),n.updateName(t))}else e.updateName(`${K} ${v}`)}),i=async n=>{var s,i;let l=async({previousCacheEntry:a})=>{try{if(!B&&q&&P&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(n);e.fetchMetrics=W.renderOpts.fetchMetrics;let i=W.renderOpts.pendingWaitUntil;i&&r.waitUntil&&(r.waitUntil(i),i=void 0);let l=W.renderOpts.collectedTags;if(!M)return await (0,c.sendResponse)(V,G,s,W.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,r=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:q})},!1,T),t}},d=await A.handleResponse({req:e,nextConfig:w,cacheKey:H,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:P,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:B});if(!M)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(i=d.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",q?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,x.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&M||p.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,c.sendResponse)(V,G,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};F&&$?await i($):(n=z.getActiveScopeSpan(),await z.withPropagatedContext(e.headers,()=>z.trace(p.BaseServerSpan.handleRequest,{spanName:`${K} ${v}`,kind:s.SpanKind.SERVER,attributes:{"http.method":K,"http.target":e.url}},i),void 0,!F))}catch(t){if(t instanceof h.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:j,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:q})},!1,T),M)throw t;return await (0,c.sendResponse)(V,G,new Response(null,{status:500})),null}}e.s(["handler",0,T,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:S})},"routeModule",0,A,"serverHooks",0,C,"workAsyncStorage",0,E,"workUnitAsyncStorage",0,S],433484)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0t~v5o~._.js.map