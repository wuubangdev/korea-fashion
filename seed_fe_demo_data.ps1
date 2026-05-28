param(
    [string]$BaseUrl = "http://103.173.66.91:3398",
    [string]$Username = "superadmin",
    [string]$Password = "superadminpass"
)

$ErrorActionPreference = "Stop"
$BaseUrl = $BaseUrl.TrimEnd("/")

function ConvertTo-JsonBody($Body) {
    return $Body | ConvertTo-Json -Depth 20 -Compress
}

function Get-Data($Response) {
    if ($null -ne $Response -and $Response.PSObject.Properties.Name -contains "data") {
        return $Response.data
    }
    return $Response
}

function Invoke-Api($Method, $Path, $Body = $null) {
    $uri = "$BaseUrl$Path"
    $params = @{
        Method = $Method
        Uri = $uri
        Headers = $script:Headers
        UseBasicParsing = $true
    }
    if ($null -ne $Body) {
        $params.Body = ConvertTo-JsonBody $Body
        $params.ContentType = "application/json"
    }
    return Get-Data (Invoke-RestMethod @params)
}

function Invoke-ApiOrNull($Method, $Path, $Body = $null) {
    try {
        return Invoke-Api $Method $Path $Body
    } catch {
        return $null
    }
}

function Search-Items($Endpoint, $Search, $Size = 100) {
    $encodedSearch = [System.Uri]::EscapeDataString($Search)
    $result = Invoke-Api "GET" "${Endpoint}?search=$encodedSearch&page=0&size=$Size&sort=id,desc"
    if ($null -eq $result -or $null -eq $result.content) {
        return @()
    }
    return @($result.content)
}

function Upsert-StringId($Endpoint, $Body, $Label) {
    $existing = Invoke-ApiOrNull "GET" "$Endpoint/$($Body.id)"
    if ($null -ne $existing) {
        $saved = Invoke-Api "PUT" "$Endpoint/$($Body.id)" $Body
        Write-Host "Updated ${Label}: $($Body.id)"
        return $saved
    }
    $saved = Invoke-Api "POST" $Endpoint $Body
    Write-Host "Created ${Label}: $($Body.id)"
    return $saved
}

function Upsert-Category($Body) {
    $existing = Search-Items "/api/categories" $Body.name | Where-Object { $_.name -eq $Body.name } | Select-Object -First 1
    if ($null -ne $existing) {
        $saved = Invoke-Api "PUT" "/api/categories/$($existing.id)" $Body
        Write-Host "Updated category: $($Body.name)"
        return $saved
    }
    $saved = Invoke-Api "POST" "/api/categories" $Body
    Write-Host "Created category: $($Body.name)"
    return $saved
}

function Upsert-Product($Body) {
    $existing = Search-Items "/api/products" $Body.name | Where-Object { $_.slug -eq $Body.slug -or $_.sku -eq $Body.sku -or $_.name -eq $Body.name } | Select-Object -First 1
    if ($null -ne $existing) {
        $saved = Invoke-Api "PUT" "/api/products/$($existing.id)" $Body
        Write-Host "Updated product: $($Body.sku)"
        return $saved
    }
    $saved = Invoke-Api "POST" "/api/products" $Body
    Write-Host "Created product: $($Body.sku)"
    return $saved
}

function Upsert-BySearch($Endpoint, $Search, $Predicate, $Body, $Label) {
    $existing = Search-Items $Endpoint $Search | Where-Object $Predicate | Select-Object -First 1
    if ($null -ne $existing) {
        $saved = Invoke-Api "PUT" "$Endpoint/$($existing.id)" $Body
        Write-Host "Updated ${Label}: $Search"
        return $saved
    }
    $saved = Invoke-Api "POST" $Endpoint $Body
    Write-Host "Created ${Label}: $Search"
    return $saved
}

$loginResponse = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/api/auth/login" `
    -ContentType "application/json" `
    -Body (ConvertTo-JsonBody @{ username = $Username; password = $Password }) `
    -UseBasicParsing
$auth = Get-Data $loginResponse
$token = $auth.token
if ([string]::IsNullOrWhiteSpace($token)) {
    throw "Login succeeded but token was not found in response."
}
$script:Headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}
Write-Host "Logged in as $($auth.username). Token acquired."

$image = @{
    hoodie = "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85"
    coat = "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=85"
    dress = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85"
    blouse = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=85"
    pants = "https://images.unsplash.com/photo-1506629905607-d9d297d9f5db?auto=format&fit=crop&w=1200&q=85"
    skirt = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"
    bag = "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=85"
    shoes = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85"
    hero = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85"
    editorial = "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1800&q=85"
}

$categories = @(
    @{ code = "outerwear"; name = "Outerwear"; description = "Ao khoac blazer, trench coat va cardigan phong cach Han Quoc."; slug = "outerwear"; imageUrl = $image.coat; bannerImageUrl = $image.hero; displayOrder = 1; active = $true; seoTitle = "Outerwear Korea Fashion"; seoDescription = "Ao khoac Han Quoc cho outfit cong so va daily." },
    @{ code = "tops"; name = "Tops"; description = "Ao so mi, blouse, knit top va hoodie de phoi moi ngay."; slug = "tops"; imageUrl = $image.blouse; bannerImageUrl = $image.editorial; displayOrder = 2; active = $true; seoTitle = "Tops Korea Fashion"; seoDescription = "Ao nu va unisex phong cach Seoul." },
    @{ code = "fe-dresses"; name = "Korean Dresses"; description = "Dam midi, slip dress va shirt dress form thanh lich."; slug = "korean-dresses"; imageUrl = $image.dress; bannerImageUrl = $image.dress; displayOrder = 3; active = $true; seoTitle = "Dresses Korea Fashion"; seoDescription = "Dam Han Quoc cho di lam, di choi va tiec nhe." },
    @{ code = "bottoms"; name = "Bottoms"; description = "Quan ong rong, culottes, chan vay va shorts."; slug = "bottoms"; imageUrl = $image.pants; bannerImageUrl = $image.skirt; displayOrder = 4; active = $true; seoTitle = "Bottoms Korea Fashion"; seoDescription = "Quan va chan vay de phoi voi ao basic." },
    @{ code = "accessories"; name = "Accessories"; description = "Tui, giay va phu kien hoan thien outfit."; slug = "accessories"; imageUrl = $image.bag; bannerImageUrl = $image.shoes; displayOrder = 5; active = $true; seoTitle = "Accessories Korea Fashion"; seoDescription = "Phu kien toi gian cho phong cach Han Quoc." }
)
$categoryByCode = @{}
foreach ($category in $categories) {
    $saved = Upsert-Category $category
    $categoryByCode[$category.code] = [long]$saved.id
    if ($category.code -eq "fe-dresses") {
        $categoryByCode["dresses"] = [long]$saved.id
    }
}

$brands = @(
    @{ id = "seoul-vibe"; name = "Seoul Vibe"; slug = "seoul-vibe"; logoUrl = "https://dummyimage.com/240x120/111827/ffffff&text=Seoul+Vibe"; description = "Street-casual label lay cam hung tu Hongdae va daily Seoul."; country = "Korea"; website = "https://seoul-vibe.example.com"; displayOrder = 1; active = $true },
    @{ id = "minimal-life"; name = "Minimal Life"; slug = "minimal-life"; logoUrl = "https://dummyimage.com/240x120/f4f4f5/111827&text=Minimal+Life"; description = "Nhung item toi gian, de layer va hop moi tu do."; country = "Korea"; website = "https://minimal-life.example.com"; displayOrder = 2; active = $true },
    @{ id = "atelier-han"; name = "Atelier Han"; slug = "atelier-han"; logoUrl = "https://dummyimage.com/240x120/fdf2f8/9f1239&text=Atelier+Han"; description = "Dam va blouse nu tinh voi chat lieu mem, form gon."; country = "Korea"; website = "https://atelier-han.example.com"; displayOrder = 3; active = $true },
    @{ id = "everyday-core"; name = "Everyday Core"; slug = "everyday-core"; logoUrl = "https://dummyimage.com/240x120/ecfeff/155e75&text=Everyday+Core"; description = "Basic essentials cho di lam, di hoc va cafe cuoi tuan."; country = "Korea"; website = "https://everyday-core.example.com"; displayOrder = 4; active = $true }
)
foreach ($brand in $brands) {
    Upsert-StringId "/api/brands" $brand "brand" | Out-Null
}

$collections = @(
    @{ id = "new-arrivals"; name = "New Arrivals"; slug = "new-arrivals"; description = "Nhung san pham vua cap nhat trong thang nay."; imageUrl = $image.editorial; bannerImageUrl = $image.hero; displayOrder = 1; active = $true; seoTitle = "New Arrivals"; seoDescription = "Bo suu tap moi nhat cua Korea Fashion." },
    @{ id = "office-core"; name = "Office Core"; slug = "office-core"; description = "Trang phuc di lam gon gang, thanh lich va de phoi."; imageUrl = $image.blouse; bannerImageUrl = $image.coat; displayOrder = 2; active = $true; seoTitle = "Office Core"; seoDescription = "Outfit cong so phong cach Han Quoc." },
    @{ id = "weekend-soft"; name = "Weekend Soft"; slug = "weekend-soft"; description = "Chat lieu mem, form thoai mai cho cuoi tuan."; imageUrl = $image.hoodie; bannerImageUrl = $image.skirt; displayOrder = 3; active = $true; seoTitle = "Weekend Soft"; seoDescription = "Do mac cuoi tuan nhe va de chiu." }
)
foreach ($collection in $collections) {
    Upsert-StringId "/api/product-collections" $collection "collection" | Out-Null
}

$sizes = @(
    @{ id = "XS"; name = "XS"; groupName = "Apparel"; region = "Asia"; measurementGuide = "Bust 78-82cm, Waist 58-62cm, Hip 84-88cm"; displayOrder = 1; active = $true },
    @{ id = "S"; name = "S"; groupName = "Apparel"; region = "Asia"; measurementGuide = "Bust 82-86cm, Waist 62-66cm, Hip 88-92cm"; displayOrder = 2; active = $true },
    @{ id = "M"; name = "M"; groupName = "Apparel"; region = "Asia"; measurementGuide = "Bust 86-90cm, Waist 66-70cm, Hip 92-96cm"; displayOrder = 3; active = $true },
    @{ id = "L"; name = "L"; groupName = "Apparel"; region = "Asia"; measurementGuide = "Bust 90-96cm, Waist 70-76cm, Hip 96-102cm"; displayOrder = 4; active = $true },
    @{ id = "FREE"; name = "Free Size"; groupName = "Apparel"; region = "Asia"; measurementGuide = "Relaxed one-size fit, recommended S-L"; displayOrder = 5; active = $true }
)
foreach ($size in $sizes) {
    Upsert-StringId "/api/sizes" $size "size" | Out-Null
}

$colors = @(
    @{ id = "IV"; name = "Ivory"; hexCode = "#F8F1E7"; displayName = "Ivory"; displayOrder = 1; active = $true },
    @{ id = "BK"; name = "Black"; hexCode = "#111111"; displayName = "Black"; displayOrder = 2; active = $true },
    @{ id = "BE"; name = "Beige"; hexCode = "#D9C4A9"; displayName = "Beige"; displayOrder = 3; active = $true },
    @{ id = "PK"; name = "Dusty Pink"; hexCode = "#D8A7B1"; displayName = "Dusty Pink"; displayOrder = 4; active = $true },
    @{ id = "DN"; name = "Denim Blue"; hexCode = "#456A8D"; displayName = "Denim Blue"; displayOrder = 5; active = $true }
)
foreach ($color in $colors) {
    Upsert-StringId "/api/colors" $color "color" | Out-Null
}

$tags = @(
    @{ id = "new-arrival"; name = "New Arrival"; slug = "new-arrival"; description = "San pham moi ve."; displayOrder = 1; active = $true },
    @{ id = "best-seller"; name = "Best Seller"; slug = "best-seller"; description = "San pham ban chay."; displayOrder = 2; active = $true },
    @{ id = "office-ready"; name = "Office Ready"; slug = "office-ready"; description = "Phu hop di lam."; displayOrder = 3; active = $true },
    @{ id = "date-look"; name = "Date Look"; slug = "date-look"; description = "Outfit hen ho nhe nhang."; displayOrder = 4; active = $true }
)
foreach ($tag in $tags) {
    Upsert-StringId "/api/product-tags" $tag "tag" | Out-Null
}

$publishedAt = "2026-05-28T09:00:00+07:00"
$products = @(
    @{
        name = "Seoul Cropped Trench Jacket"; description = "Ao khoac trench lung voi vai cotton twill dung form, lapel gon va day that eo nhe. Phu hop layer voi dam midi hoac quan ong rong."; shortDescription = "Cropped trench jacket dang gon."; imageUrl = $image.coat; price = 1290000; compareAtPrice = 1590000; costPrice = 760000; brand = "Seoul Vibe"; brandId = "seoul-vibe"; origin = "Korea"; categoryId = $categoryByCode["outerwear"]; collectionId = "new-arrivals"; sku = "KF-OUT-001"; slug = "seoul-cropped-trench-jacket"; material = "Cotton twill"; fabricComposition = "68% cotton, 28% polyester, 4% spandex"; careInstructions = "Dry clean recommended, steam on low heat."; fit = "Cropped regular fit"; style = "Korean casual"; occasion = "Office, weekend"; length = "Cropped"; neckline = "Lapel collar"; sleeveLength = "Long sleeve"; pattern = "Solid"; gender = "Women"; season = "Spring"; countryOfManufacture = "South Korea"; madeIn = "Seoul"; warrantyPolicy = "7 ngay doi san pham loi san xuat."; returnPolicy = "Doi size trong 7 ngay neu con tem mac."; status = "ACTIVE"; stockQuantity = 42; featured = $true; newArrival = $true; bestSeller = $false; sale = $true; viewCount = 1680; soldCount = 126; ratingAverage = 4.8; reviewCount = 38; weight = 0.72; packageWidth = 32; packageHeight = 8; packageLength = 42; publishedAt = $publishedAt; tags = "new-arrival,office-ready"; seoTitle = "Seoul Cropped Trench Jacket"; seoDescription = "Ao khoac trench lung Han Quoc form gon, phu hop cong so va daily."; seoKeywords = "trench jacket,korean outerwear,ao khoac han quoc"; seoThumbnailUrl = $image.coat; canonicalUrl = "/products/seoul-cropped-trench-jacket"; schemaType = "Product"; robots = "index,follow"
    },
    @{
        name = "Soft Ribbed Knit Cardigan"; description = "Cardigan rib mem voi nut ngoc trai nho, co the mac rieng nhu top hoac layer ngoai ao hai day."; shortDescription = "Cardigan rib mem, nut ngoc trai."; imageUrl = $image.blouse; price = 620000; compareAtPrice = 720000; costPrice = 330000; brand = "Minimal Life"; brandId = "minimal-life"; origin = "Korea"; categoryId = $categoryByCode["tops"]; collectionId = "weekend-soft"; sku = "KF-TOP-001"; slug = "soft-ribbed-knit-cardigan"; material = "Soft rib knit"; fabricComposition = "52% viscose, 28% nylon, 20% polyester"; careInstructions = "Hand wash cold, lay flat to dry."; fit = "Slim comfort fit"; style = "Minimal"; occasion = "Daily, cafe"; length = "Regular"; neckline = "V-neck"; sleeveLength = "Long sleeve"; pattern = "Ribbed"; gender = "Women"; season = "Fall"; countryOfManufacture = "South Korea"; madeIn = "Busan"; warrantyPolicy = "Ho tro loi duong may trong 7 ngay."; returnPolicy = "Doi hang neu chua qua su dung."; status = "ACTIVE"; stockQuantity = 88; featured = $true; newArrival = $false; bestSeller = $true; sale = $true; viewCount = 2412; soldCount = 312; ratingAverage = 4.9; reviewCount = 74; weight = 0.32; packageWidth = 28; packageHeight = 5; packageLength = 36; publishedAt = $publishedAt; tags = "best-seller,date-look"; seoTitle = "Soft Ribbed Knit Cardigan"; seoDescription = "Ao cardigan rib Han Quoc mem, de phoi hang ngay."; seoKeywords = "cardigan,knit cardigan,korean top"; seoThumbnailUrl = $image.blouse; canonicalUrl = "/products/soft-ribbed-knit-cardigan"; schemaType = "Product"; robots = "index,follow"
    },
    @{
        name = "Atelier Floral Midi Dress"; description = "Dam midi hoa nho voi eo chun sau, tay phong nhe va lop lot mem. Len form thanh lich cho di choi hoac tiec nhe."; shortDescription = "Dam midi hoa nho nu tinh."; imageUrl = $image.dress; price = 980000; compareAtPrice = 1180000; costPrice = 570000; brand = "Atelier Han"; brandId = "atelier-han"; origin = "Korea"; categoryId = $categoryByCode["dresses"]; collectionId = "new-arrivals"; sku = "KF-DRS-001"; slug = "atelier-floral-midi-dress"; material = "Printed chiffon"; fabricComposition = "100% polyester outer, soft lining"; careInstructions = "Hand wash separately, do not bleach."; fit = "Waist defined"; style = "Romantic"; occasion = "Date, brunch"; length = "Midi"; neckline = "Square neck"; sleeveLength = "Short puff sleeve"; pattern = "Floral"; gender = "Women"; season = "Summer"; countryOfManufacture = "South Korea"; madeIn = "Daegu"; warrantyPolicy = "Bao hanh loi khoa keo/duong may 7 ngay."; returnPolicy = "Doi size trong 7 ngay."; status = "ACTIVE"; stockQuantity = 36; featured = $true; newArrival = $true; bestSeller = $false; sale = $false; viewCount = 1920; soldCount = 88; ratingAverage = 4.7; reviewCount = 29; weight = 0.46; packageWidth = 30; packageHeight = 6; packageLength = 40; publishedAt = $publishedAt; tags = "new-arrival,date-look"; seoTitle = "Atelier Floral Midi Dress"; seoDescription = "Dam midi hoa nho phong cach Han Quoc."; seoKeywords = "floral dress,midi dress,korean dress"; seoThumbnailUrl = $image.dress; canonicalUrl = "/products/atelier-floral-midi-dress"; schemaType = "Product"; robots = "index,follow"
    },
    @{
        name = "Office Wide-Leg Trousers"; description = "Quan ong rong lung cao, nep ly truoc va chat vai ro mem. De phoi cung blouse, cardigan hoac blazer."; shortDescription = "Quan cong so ong rong lung cao."; imageUrl = $image.pants; price = 760000; compareAtPrice = 890000; costPrice = 420000; brand = "Everyday Core"; brandId = "everyday-core"; origin = "Korea"; categoryId = $categoryByCode["bottoms"]; collectionId = "office-core"; sku = "KF-BOT-001"; slug = "office-wide-leg-trousers"; material = "Drape suiting"; fabricComposition = "74% polyester, 20% rayon, 6% spandex"; careInstructions = "Machine wash gentle, hang dry."; fit = "High waist wide leg"; style = "Office"; occasion = "Work, meeting"; length = "Full length"; neckline = ""; sleeveLength = ""; pattern = "Solid"; gender = "Women"; season = "All season"; countryOfManufacture = "South Korea"; madeIn = "Incheon"; warrantyPolicy = "Ho tro loi khoa nut trong 7 ngay."; returnPolicy = "Doi size trong 7 ngay."; status = "ACTIVE"; stockQuantity = 64; featured = $false; newArrival = $false; bestSeller = $true; sale = $true; viewCount = 1320; soldCount = 205; ratingAverage = 4.6; reviewCount = 41; weight = 0.52; packageWidth = 30; packageHeight = 5; packageLength = 38; publishedAt = $publishedAt; tags = "best-seller,office-ready"; seoTitle = "Office Wide-Leg Trousers"; seoDescription = "Quan ong rong cong so phong cach Han Quoc."; seoKeywords = "wide leg trousers,office pants,korean fashion"; seoThumbnailUrl = $image.pants; canonicalUrl = "/products/office-wide-leg-trousers"; schemaType = "Product"; robots = "index,follow"
    },
    @{
        name = "Weekend Oversized Hoodie"; description = "Hoodie ni bong mem form oversized, day rut tron va tui kangaroo. Hop voi phong cach streetwear hang ngay."; shortDescription = "Hoodie oversized ni bong mem."; imageUrl = $image.hoodie; price = 690000; compareAtPrice = 790000; costPrice = 390000; brand = "Seoul Vibe"; brandId = "seoul-vibe"; origin = "Korea"; categoryId = $categoryByCode["tops"]; collectionId = "weekend-soft"; sku = "KF-TOP-002"; slug = "weekend-oversized-hoodie"; material = "Brushed fleece"; fabricComposition = "80% cotton, 20% polyester"; careInstructions = "Machine wash cold, wash inside out."; fit = "Oversized"; style = "Street"; occasion = "Weekend, travel"; length = "Hip length"; neckline = "Hooded"; sleeveLength = "Long sleeve"; pattern = "Solid"; gender = "Unisex"; season = "Winter"; countryOfManufacture = "South Korea"; madeIn = "Seoul"; warrantyPolicy = "Ho tro loi in/thieu phu kien trong 7 ngay."; returnPolicy = "Doi size trong 7 ngay."; status = "ACTIVE"; stockQuantity = 120; featured = $true; newArrival = $false; bestSeller = $true; sale = $false; viewCount = 3560; soldCount = 480; ratingAverage = 4.9; reviewCount = 112; weight = 0.68; packageWidth = 34; packageHeight = 9; packageLength = 42; publishedAt = $publishedAt; tags = "best-seller"; seoTitle = "Weekend Oversized Hoodie"; seoDescription = "Hoodie oversized Han Quoc phong cach streetwear."; seoKeywords = "hoodie,oversized hoodie,korean streetwear"; seoThumbnailUrl = $image.hoodie; canonicalUrl = "/products/weekend-oversized-hoodie"; schemaType = "Product"; robots = "index,follow"
    },
    @{
        name = "Pleated A-Line Mini Skirt"; description = "Chan vay mini xep ly A-line voi quan trong an toan, phu hop style preppy va campus look."; shortDescription = "Chan vay xep ly A-line."; imageUrl = $image.skirt; price = 540000; compareAtPrice = 640000; costPrice = 290000; brand = "Atelier Han"; brandId = "atelier-han"; origin = "Korea"; categoryId = $categoryByCode["bottoms"]; collectionId = "new-arrivals"; sku = "KF-BOT-002"; slug = "pleated-a-line-mini-skirt"; material = "Soft twill"; fabricComposition = "65% polyester, 32% rayon, 3% spandex"; careInstructions = "Machine wash gentle, iron pleats on low heat."; fit = "A-line"; style = "Preppy"; occasion = "School, cafe"; length = "Mini"; neckline = ""; sleeveLength = ""; pattern = "Pleated"; gender = "Women"; season = "Spring"; countryOfManufacture = "South Korea"; madeIn = "Seoul"; warrantyPolicy = "Ho tro loi duong may trong 7 ngay."; returnPolicy = "Doi size trong 7 ngay."; status = "ACTIVE"; stockQuantity = 58; featured = $false; newArrival = $true; bestSeller = $false; sale = $true; viewCount = 980; soldCount = 67; ratingAverage = 4.5; reviewCount = 18; weight = 0.28; packageWidth = 28; packageHeight = 4; packageLength = 34; publishedAt = $publishedAt; tags = "new-arrival,date-look"; seoTitle = "Pleated A-Line Mini Skirt"; seoDescription = "Chan vay xep ly Han Quoc phong cach preppy."; seoKeywords = "pleated skirt,korean skirt,a-line skirt"; seoThumbnailUrl = $image.skirt; canonicalUrl = "/products/pleated-a-line-mini-skirt"; schemaType = "Product"; robots = "index,follow"
    },
    @{
        name = "Canvas Mini Crossbody Bag"; description = "Tui canvas mini co khoa nam cham, quai deo dieu chinh va ngan trong vua du dien thoai, vi nho, son."; shortDescription = "Tui canvas mini deo cheo."; imageUrl = $image.bag; price = 420000; compareAtPrice = 0; costPrice = 210000; brand = "Everyday Core"; brandId = "everyday-core"; origin = "Korea"; categoryId = $categoryByCode["accessories"]; collectionId = "weekend-soft"; sku = "KF-ACC-001"; slug = "canvas-mini-crossbody-bag"; material = "Canvas"; fabricComposition = "Cotton canvas, synthetic leather trim"; careInstructions = "Spot clean only."; fit = "Adjustable strap"; style = "Casual"; occasion = "Daily"; length = ""; neckline = ""; sleeveLength = ""; pattern = "Solid"; gender = "Unisex"; season = "All season"; countryOfManufacture = "South Korea"; madeIn = "Busan"; warrantyPolicy = "Bao hanh phu kien kim loai 14 ngay."; returnPolicy = "Doi hang neu chua su dung."; status = "ACTIVE"; stockQuantity = 95; featured = $false; newArrival = $false; bestSeller = $false; sale = $false; viewCount = 760; soldCount = 44; ratingAverage = 4.4; reviewCount = 11; weight = 0.25; packageWidth = 20; packageHeight = 8; packageLength = 26; publishedAt = $publishedAt; tags = "daily-essentials"; seoTitle = "Canvas Mini Crossbody Bag"; seoDescription = "Tui mini canvas de phoi voi outfit Han Quoc."; seoKeywords = "crossbody bag,canvas bag,korean accessories"; seoThumbnailUrl = $image.bag; canonicalUrl = "/products/canvas-mini-crossbody-bag"; schemaType = "Product"; robots = "index,follow"
    },
    @{
        name = "Clean Low-Top Sneakers"; description = "Giay sneaker low-top mau trang kem, de cao su mem va lot chan em. De phoi voi quan ong rong hoac dam midi."; shortDescription = "Sneaker low-top trang kem."; imageUrl = $image.shoes; price = 890000; compareAtPrice = 990000; costPrice = 520000; brand = "Minimal Life"; brandId = "minimal-life"; origin = "Korea"; categoryId = $categoryByCode["accessories"]; collectionId = "office-core"; sku = "KF-ACC-002"; slug = "clean-low-top-sneakers"; material = "Synthetic leather"; fabricComposition = "PU upper, rubber sole"; careInstructions = "Wipe clean with damp cloth."; fit = "True to size"; style = "Minimal"; occasion = "Daily, office casual"; length = ""; neckline = ""; sleeveLength = ""; pattern = "Solid"; gender = "Unisex"; season = "All season"; countryOfManufacture = "South Korea"; madeIn = "Gwangju"; warrantyPolicy = "Bao hanh keo de 30 ngay."; returnPolicy = "Doi size neu de giay chua mon."; status = "ACTIVE"; stockQuantity = 72; featured = $true; newArrival = $false; bestSeller = $false; sale = $true; viewCount = 1120; soldCount = 90; ratingAverage = 4.6; reviewCount = 24; weight = 0.82; packageWidth = 24; packageHeight = 12; packageLength = 34; publishedAt = $publishedAt; tags = "office-ready,daily-essentials"; seoTitle = "Clean Low-Top Sneakers"; seoDescription = "Sneaker trang kem toi gian de phoi hang ngay."; seoKeywords = "low top sneakers,korean sneakers,minimal shoes"; seoThumbnailUrl = $image.shoes; canonicalUrl = "/products/clean-low-top-sneakers"; schemaType = "Product"; robots = "index,follow"
    }
)

$savedProducts = @{}
foreach ($product in $products) {
    $saved = Upsert-Product $product
    $savedProducts[$product.sku] = $saved
}

foreach ($product in $products) {
    $savedProduct = $savedProducts[$product.sku]
    $baseSku = $product.sku
    $variantRows = @(
        @{ sku = "$baseSku-IV-S"; sizeId = "S"; size = "S"; colorId = "IV"; color = "Ivory"; colorHex = "#F8F1E7"; quantity = 18; reservedQuantity = 2; price = $product.price; compareAtPrice = $product.compareAtPrice; costPrice = $product.costPrice; weight = $product.weight; imageUrl = $product.imageUrl },
        @{ sku = "$baseSku-BK-M"; sizeId = "M"; size = "M"; colorId = "BK"; color = "Black"; colorHex = "#111111"; quantity = 24; reservedQuantity = 1; price = $product.price; compareAtPrice = $product.compareAtPrice; costPrice = $product.costPrice; weight = $product.weight; imageUrl = $product.imageUrl }
    )
    foreach ($variant in $variantRows) {
        $variant.productId = [long]$savedProduct.id
        $variant.barcode = "880$($savedProduct.id)$($variant.sku.GetHashCode().ToString().Replace('-','').PadLeft(8,'0').Substring(0,8))"
        $variant.availableQuantity = $variant.quantity - $variant.reservedQuantity
        $variant.lowStockThreshold = 5
        $variant.active = $true
        Upsert-BySearch "/api/variants" $variant.sku { $_.sku -eq $variant.sku } $variant "variant" | Out-Null
    }

    $imageRows = @(
        @{ productId = [long]$savedProduct.id; imageUrl = $product.imageUrl; altText = "$($product.name) main"; displayOrder = 1; primaryImage = $true; active = $true },
        @{ productId = [long]$savedProduct.id; imageUrl = "$($product.imageUrl)&sat=-20"; altText = "$($product.name) detail"; displayOrder = 2; primaryImage = $false; active = $true }
    )
    foreach ($row in $imageRows) {
        Upsert-BySearch "/api/product-images" $row.altText { $_.altText -eq $row.altText } $row "product image" | Out-Null
    }

    $sizeOption = Upsert-BySearch "/api/product-options" "$baseSku-size" { $_.productId -eq $savedProduct.id -and $_.code -eq "SIZE" } @{ productId = [long]$savedProduct.id; code = "SIZE"; name = "Size"; type = "select"; displayOrder = 1; required = $true; filterable = $true; active = $true } "product option"
    $colorOption = Upsert-BySearch "/api/product-options" "$baseSku-color" { $_.productId -eq $savedProduct.id -and $_.code -eq "COLOR" } @{ productId = [long]$savedProduct.id; code = "COLOR"; name = "Color"; type = "swatch"; displayOrder = 2; required = $true; filterable = $true; active = $true } "product option"

    $optionValues = @(
        @{ productId = [long]$savedProduct.id; optionId = [long]$sizeOption.id; code = "$baseSku-SIZE-S"; value = "S"; displayOrder = 1; active = $true },
        @{ productId = [long]$savedProduct.id; optionId = [long]$sizeOption.id; code = "$baseSku-SIZE-M"; value = "M"; displayOrder = 2; active = $true },
        @{ productId = [long]$savedProduct.id; optionId = [long]$colorOption.id; code = "$baseSku-COLOR-IV"; value = "Ivory"; colorHex = "#F8F1E7"; displayOrder = 1; active = $true },
        @{ productId = [long]$savedProduct.id; optionId = [long]$colorOption.id; code = "$baseSku-COLOR-BK"; value = "Black"; colorHex = "#111111"; displayOrder = 2; active = $true }
    )
    foreach ($row in $optionValues) {
        Upsert-BySearch "/api/product-option-values" $row.code { $_.code -eq $row.code } $row "option value" | Out-Null
    }

    $attrs = @(
        @{ productId = [long]$savedProduct.id; attributeKey = "Material"; attributeValue = $product.material; groupName = "Details"; displayOrder = 1; filterable = $false; visible = $true },
        @{ productId = [long]$savedProduct.id; attributeKey = "Fit"; attributeValue = $product.fit; groupName = "Fit"; displayOrder = 2; filterable = $true; visible = $true },
        @{ productId = [long]$savedProduct.id; attributeKey = "Care"; attributeValue = $product.careInstructions; groupName = "Care"; displayOrder = 3; filterable = $false; visible = $true }
    )
    foreach ($row in $attrs) {
        $search = "$($product.sku)-$($row.attributeKey)"
        Upsert-BySearch "/api/product-attributes" $search { $_.productId -eq $row.productId -and $_.attributeKey -eq $row.attributeKey } $row "attribute" | Out-Null
    }
}

$banners = @(
    @{ id = "home-hero"; title = "Seoul Spring Edit"; subtitle = "Layer nhe, form gon, mau trung tinh"; description = "Bo suu tap moi voi outerwear, knit va dam midi de phoi cho tuan lam viec lan cuoi tuan."; imageUrl = $image.hero; mobileImageUrl = $image.editorial; ctaLabel = "Xem bo suu tap"; ctaUrl = "/products?collectionId=new-arrivals"; placement = "home-hero"; displayOrder = 1; active = $true },
    @{ id = "office-core"; title = "Office Core"; subtitle = "Cong so nhung khong cung nhac"; description = "Quan ong rong, cardigan va sneaker toi gian cho nhung ngay di lam."; imageUrl = $image.coat; mobileImageUrl = $image.pants; ctaLabel = "Shop office"; ctaUrl = "/products?collectionId=office-core"; placement = "home-section"; displayOrder = 2; active = $true }
)
foreach ($banner in $banners) {
    Upsert-StringId "/api/banners" $banner "banner" | Out-Null
}

$contentNow = "2026-05-28T09:00:00"
$blogPosts = @(
    @{ id = "style-layering-seoul"; title = "5 cong thuc layer kieu Seoul cho ngay mat troi"; slug = "5-cong-thuc-layer-kieu-seoul"; excerpt = "Cach phoi cardigan, trench va quan ong rong thanh outfit gon gang."; content = "Bat dau voi mot lop base mong, them cardigan rib hoac trench jacket va ket thuc bang sneaker trang. Uu tien bang mau ivory, beige, black de FE co du lieu hien thi editorial."; authorName = "Korea Fashion Studio"; category = "Style guide"; thumbnailUrl = $image.editorial; tags = "style,layering,office"; status = "PUBLISHED"; seoTitle = "5 cong thuc layer kieu Seoul"; seoDescription = "Goi y phoi do Han Quoc cho giao dien blog va storefront."; publishedAt = $contentNow },
    @{ id = "fabric-care-knit"; title = "Cach giu form do knit va chiffon"; slug = "cach-giu-form-do-knit-va-chiffon"; excerpt = "Huong dan bao quan cardigan, dam chiffon va hoodie."; content = "Do knit nen giat tay, phoi ngang va tranh moc vai khi con uot. Chiffon nen giat rieng va ui hoi nuoc nhe."; authorName = "Care Team"; category = "Care"; thumbnailUrl = $image.blouse; tags = "care,knit,chiffon"; status = "PUBLISHED"; seoTitle = "Cach giu form do knit va chiffon"; seoDescription = "Noi dung mau cho trang blog/care."; publishedAt = $contentNow }
)
foreach ($post in $blogPosts) {
    Upsert-StringId "/api/blog-posts" $post "blog post" | Out-Null
}

$faqs = @(
    @{ category = "Shipping"; question = "Don hang mat bao lau de giao?"; answer = "Noi thanh thuong 1-2 ngay, tinh thanh khac 2-5 ngay lam viec tuy khu vuc."; displayOrder = 1; active = $true },
    @{ category = "Returns"; question = "Co doi size duoc khong?"; answer = "Co. San pham con tem mac va chua qua su dung duoc doi size trong 7 ngay."; displayOrder = 2; active = $true },
    @{ category = "Product"; question = "Bang size la size Han hay Viet Nam?"; answer = "Bang size tham chieu form chau A. Moi san pham co measurement guide rieng trong phan thuoc tinh."; displayOrder = 3; active = $true }
)
foreach ($faq in $faqs) {
    Upsert-BySearch "/api/faqs" $faq.question { $_.question -eq $faq.question } $faq "faq" | Out-Null
}

$coupons = @(
    @{ id = "WELCOME10"; code = "WELCOME10"; name = "Giam 10% don dau"; description = "Coupon demo cho FE hien thi va test checkout."; discountType = "PERCENT"; discountValue = 10; maxDiscountAmount = 100000; minOrderAmount = 500000; appliesTo = "ALL"; usageLimit = 1000; usageLimitPerCustomer = 1; usedCount = 24; stackable = $false; freeShipping = $false; active = $true; startsAt = "2026-01-01T00:00:00"; endsAt = "2026-12-31T23:59:59" },
    @{ id = "FREESHIP"; code = "FREESHIP"; name = "Mien phi van chuyen"; description = "Coupon freeship mau."; discountType = "FIXED"; discountValue = 0; maxDiscountAmount = 0; minOrderAmount = 700000; appliesTo = "ALL"; usageLimit = 500; usageLimitPerCustomer = 2; usedCount = 51; stackable = $true; freeShipping = $true; active = $true; startsAt = "2026-01-01T00:00:00"; endsAt = "2026-12-31T23:59:59" }
)
foreach ($coupon in $coupons) {
    Upsert-StringId "/api/coupons" $coupon "coupon" | Out-Null
}

Write-Host "Demo seed completed."
Write-Host "Base URL: $BaseUrl"
Write-Host "Login: $Username / $Password"
Write-Host "Token: $token"
