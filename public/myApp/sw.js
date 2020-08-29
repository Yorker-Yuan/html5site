var cache_name = "v3"
var url_files = [
    '/MyApp',
    '/MyApp/Main.html',
    '/MyApp/main.css',
    '/MyApp/main.js'
]
//儲存檔案到Cache Storage中
self.addEventListener('install',function(event){
    event.waitUntil(
        caches.open(cache_name).then(function(cache){
            return cache.addAll(url_files)
        })
    )
})

//http://localhost:3000/MyApp/Main.html
//使用者透過瀏覽器發出要求，就會觸發fetch事件
//在這個事件中我們會去比對使用者要瀏覽的網頁
//有沒有在CacheStorage中
//如果有直接回傳，沒有就透過Ajax方法去Server上取回來
self.addEventListener('fetch',function(event){
   // console.log(event.request)
    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request)
        })
    )
})

//管理Cache Storage
//將舊的Cache刪除，保留新的Cache
self.addEventListener("activate",function(event){
    event.waitUntil(
        caches.keys().then(function(names){
            Promise.all(names.map(function(name){
                if(name != cache_name){
                    return caches.delete(name);
                }
            }))
        })
    )
})