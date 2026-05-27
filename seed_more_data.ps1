$token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwicm9sZXMiOlsiUk9MRV9TSElQUEVSIiwiUk9MRV9BRE1JTiIsIlJPTEVfQ1VTVE9NRVIiLCJST0xFX1NUQUZGIl0sImlhdCI6MTc3OTg3MjA2MSwiZXhwIjoxNzc5OTU4NDYxfQ._IGuK0NNWQM4H1VlU3-yy-l_3hOKkAelTNKUZbi5_zs'
$headers = @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' }
function Post-Entity($url, $body) {
    try {
        $json = $body | ConvertTo-Json -Depth 10
        $resp = Invoke-RestMethod -Method Post -Uri $url -Headers $headers -Body $json -UseBasicParsing
        return $resp.data
    } catch {
        $err = $_.Exception
        if ($err.Response -ne $null) {
            $stream = $err.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $text = $reader.ReadToEnd()
            Write-Host "WARN: $url duplicate or invalid: $text"
        } else {
            Write-Host "WARN: $url failed: $($err.Message)"
        }
        return $null
    }
}

# Brands
$brands = @(
    @{id='kf'; name='Korea Fashion'; slug='korea-fashion'; description='In-house Korean fashion label cho streetwear va casual'; logoUrl='https://example.com/brand-kf.svg'; country='Korea'; website='https://korea-fashion.example.com'; displayOrder=1; active=$true},
    @{id='seoul-vibe'; name='Seoul Vibe'; slug='seoul-vibe'; description='Tinh than Seoul voi thiet ke tre trung'; logoUrl='https://example.com/brand-seoul.svg'; country='Korea'; website='https://seoulvibe.example.com'; displayOrder=2; active=$true},
    @{id='minimal-life'; name='Minimal Life'; slug='minimal-life'; description='Nhung mau thoi trang toi gian va phoi do daily'; logoUrl='https://example.com/brand-minimal.svg'; country='Korea'; website='https://minimallife.example.com'; displayOrder=3; active=$true},
    @{id='everyday-core'; name='Everyday Core'; slug='everyday-core'; description='Basic essentials cho phong cach hang ngay'; logoUrl='https://example.com/brand-everyday.svg'; country='Korea'; website='https://everydaycore.example.com'; displayOrder=4; active=$true}
)
foreach ($brand in $brands) {
    $created = Post-Entity 'http://103.173.66.91:3398/api/brands' $brand
    if ($created) { Write-Host "Created brand: $($created.id)" }
}

# Product Collections
$collections = @(
    @{id='new-arrivals'; name='New Arrivals'; slug='new-arrivals'; description='Bst moi nhat vua cap nhat'; imageUrl='https://images.unsplash.com/photo-1512436991641-6745cdb1723f'; bannerImageUrl='https://images.unsplash.com/photo-1524504388940-b1c1722653e1'; displayOrder=1; active=$true; seoTitle='New Arrivals'; seoDescription='San pham moi nhat Korea Fashion'},
    @{id='best-sellers'; name='Best Sellers'; slug='best-sellers'; description='Cac san pham ban chay nhat'; imageUrl='https://images.unsplash.com/photo-1520975911226-8d0bc43a4d16'; bannerImageUrl='https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'; displayOrder=2; active=$true; seoTitle='Best Sellers'; seoDescription='San pham yeu thich nhat tu Korea Fashion'},
    @{id='summer-essentials'; name='Summer Essentials'; slug='summer-essentials'; description='Nhung mon do khong the thieu cho mua he'; imageUrl='https://images.unsplash.com/photo-1523381218027-3117c9c0f1c8'; bannerImageUrl='https://images.unsplash.com/photo-1512258282477-3f36c0f2c441'; displayOrder=3; active=$true; seoTitle='Summer Essentials'; seoDescription='Thoi trang mua he hien dai va thoai mai'}
)
foreach ($coll in $collections) {
    $created = Post-Entity 'http://103.173.66.91:3398/api/product-collections' $coll
    if ($created) { Write-Host "Created collection: $($created.id)" }
}

# Sizes
$sizes = @(
    @{id='XS'; name='XS'; groupName='Apparel'; region='Asia'; measurementGuide='Bust 78-82cm, Waist 58-62cm'; displayOrder=1; active=$true},
    @{id='S'; name='S'; groupName='Apparel'; region='Asia'; measurementGuide='Bust 82-86cm, Waist 62-66cm'; displayOrder=2; active=$true},
    @{id='M'; name='M'; groupName='Apparel'; region='Asia'; measurementGuide='Bust 86-90cm, Waist 66-70cm'; displayOrder=3; active=$true},
    @{id='L'; name='L'; groupName='Apparel'; region='Asia'; measurementGuide='Bust 90-94cm, Waist 70-74cm'; displayOrder=4; active=$true},
    @{id='XL'; name='XL'; groupName='Apparel'; region='Asia'; measurementGuide='Bust 94-98cm, Waist 74-78cm'; displayOrder=5; active=$true}
)
foreach ($size in $sizes) {
    $created = Post-Entity 'http://103.173.66.91:3398/api/sizes' $size
    if ($created) { Write-Host "Created size: $($created.id)" }
}

# Colors
$colors = @(
    @{id='BK'; name='Black'; hexCode='#000000'; displayName='Black'; displayOrder=1; active=$true},
    @{id='WT'; name='White'; hexCode='#FFFFFF'; displayName='White'; displayOrder=2; active=$true},
    @{id='BE'; name='Beige'; hexCode='#E2C9B7'; displayName='Beige'; displayOrder=3; active=$true},
    @{id='PK'; name='Pink'; hexCode='#F7C6D1'; displayName='Pink'; displayOrder=4; active=$true},
    @{id='BL'; name='Blue'; hexCode='#3B82F6'; displayName='Blue'; displayOrder=5; active=$true}
)
foreach ($color in $colors) {
    $created = Post-Entity 'http://103.173.66.91:3398/api/colors' $color
    if ($created) { Write-Host "Created color: $($created.id)" }
}

# Product Tags
$tags = @(
    @{id='new-arrival'; name='New Arrival'; slug='new-arrival'; description='San pham moi ra mat'; displayOrder=1; active=$true},
    @{id='best-seller'; name='Best Seller'; slug='best-seller'; description='San pham ban chay'; displayOrder=2; active=$true},
    @{id='limited'; name='Limited Edition'; slug='limited-edition'; description='Phien ban gioi han'; displayOrder=3; active=$true},
    @{id='daily-essentials'; name='Daily Essentials'; slug='daily-essentials'; description='Nhung mon do can thiet hang ngay'; displayOrder=4; active=$true}
)
foreach ($tag in $tags) {
    $created = Post-Entity 'http://103.173.66.91:3398/api/product-tags' $tag
    if ($created) { Write-Host "Created tag: $($created.id)" }
}

# Product Images for first 8 products
$productImages = @(
    @{productId=1; imageUrl='https://images.unsplash.com/photo-1512436991641-6745cdb1723f'; altText='Seoul Street Hoodie'; displayOrder=1; primaryImage=$true; active=$true},
    @{productId=1; imageUrl='https://images.unsplash.com/photo-1521334884684-d80222895322'; altText='Seoul Street Hoodie back'; displayOrder=2; primaryImage=$false; active=$true},
    @{productId=2; imageUrl='https://images.unsplash.com/photo-1521334884684-d80222895322'; altText='Minimal Logo Hoodie'; displayOrder=1; primaryImage=$true; active=$true},
    @{productId=2; imageUrl='https://images.unsplash.com/photo-1512258282477-3f36c0f2c441'; altText='Minimal Logo Hoodie detail'; displayOrder=2; primaryImage=$false; active=$true},
    @{productId=6; imageUrl='https://images.unsplash.com/photo-1524504388940-b1c1722653e1'; altText='Floral Midi Dress'; displayOrder=1; primaryImage=$true; active=$true},
    @{productId=6; imageUrl='https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'; altText='Floral Midi Dress closeup'; displayOrder=2; primaryImage=$false; active=$true},
    @{productId=11; imageUrl='https://images.unsplash.com/photo-1523381218027-3117c9c0f1c8'; altText='Linen Button-Up Shirt'; displayOrder=1; primaryImage=$true; active=$true},
    @{productId=11; imageUrl='https://images.unsplash.com/photo-1520975911226-8d0bc43a4d16'; altText='Linen Button-Up Shirt alternate'; displayOrder=2; primaryImage=$false; active=$true}
)
foreach ($img in $productImages) {
    $created = Post-Entity 'http://103.173.66.91:3398/api/product-images' $img
    if ($created) { Write-Host "Created product image for product $($created.productId)" }
}

# Product Options and Values
$productOptions = @(
    @{productId=1; code='SIZE'; name='Size'; type='select'; displayOrder=1; required=$true; filterable=$true; active=$true},
    @{productId=1; code='COLOR'; name='Color'; type='select'; displayOrder=2; required=$true; filterable=$true; active=$true},
    @{productId=6; code='SIZE'; name='Size'; type='select'; displayOrder=1; required=$true; filterable=$true; active=$true},
    @{productId=11; code='COLOR'; name='Color'; type='select'; displayOrder=1; required=$true; filterable=$true; active=$true}
)
$productOptionIds = @{}
foreach ($opt in $productOptions) {
    $created = Post-Entity 'http://103.173.66.91:3398/api/product-options' $opt
    if ($created) { 
        Write-Host "Created product option $($created.code) for product $($created.productId) -> id $($created.id)"
        $productOptionIds["$($created.productId)-$($created.code)"] = $created.id
    }
}

$productOptionValues = @(
    @{productId=1; optionId=$productOptionIds['1-SIZE']; code='SIZE-S'; value='S'; displayOrder=1; active=$true},
    @{productId=1; optionId=$productOptionIds['1-SIZE']; code='SIZE-M'; value='M'; displayOrder=2; active=$true},
    @{productId=1; optionId=$productOptionIds['1-SIZE']; code='SIZE-L'; value='L'; displayOrder=3; active=$true},
    @{productId=1; optionId=$productOptionIds['1-COLOR']; code='COLOR-BK'; value='Black'; colorHex='#000000'; displayOrder=1; active=$true},
    @{productId=1; optionId=$productOptionIds['1-COLOR']; code='COLOR-BE'; value='Beige'; colorHex='#E2C9B7'; displayOrder=2; active=$true},
    @{productId=6; optionId=$productOptionIds['6-SIZE']; code='SIZE-M'; value='M'; displayOrder=1; active=$true},
    @{productId=6; optionId=$productOptionIds['6-SIZE']; code='SIZE-L'; value='L'; displayOrder=2; active=$true},
    @{productId=11; optionId=$productOptionIds['11-COLOR']; code='COLOR-WT'; value='White'; colorHex='#FFFFFF'; displayOrder=1; active=$true},
    @{productId=11; optionId=$productOptionIds['11-COLOR']; code='COLOR-BL'; value='Blue'; colorHex='#3B82F6'; displayOrder=2; active=$true}
)
foreach ($val in $productOptionValues) {
    if ($val.optionId -ne $null) {
        $created = Post-Entity 'http://103.173.66.91:3398/api/product-option-values' $val
        if ($created) { Write-Host "Created option value $($created.code) for option $($created.optionId)" }
    }
}

# Product attributes
$productAttributes = @(
    @{productId=1; attributeKey='Material'; attributeValue='Cotton blend'; groupName='Details'; displayOrder=1; filterable=$false; visible=$true},
    @{productId=1; attributeKey='Care'; attributeValue='Machine wash cold'; groupName='Details'; displayOrder=2; filterable=$false; visible=$true},
    @{productId=6; attributeKey='Material'; attributeValue='Lightweight chiffon'; groupName='Details'; displayOrder=1; filterable=$false; visible=$true},
    @{productId=11; attributeKey='Material'; attributeValue='Linen blend'; groupName='Details'; displayOrder=1; filterable=$false; visible=$true},
    @{productId=11; attributeKey='Fit'; attributeValue='Relaxed fit'; groupName='Fit'; displayOrder=2; filterable=$false; visible=$true}
)
foreach ($attr in $productAttributes) {
    $created = Post-Entity 'http://103.173.66.91:3398/api/product-attributes' $attr
    if ($created) { Write-Host "Created attribute $($created.attributeKey) for product $($created.productId)" }
}

# Update product metadata for first 10 products
$updates = @(
    @{id=1; brand='Korea Fashion'; brandId='kf'; collectionId='best-sellers'; tags='new-arrival,best-seller'; style='Street'; season='Winter'; gender='Unisex'},
    @{id=2; brand='Minimal Life'; brandId='minimal-life'; collectionId='new-arrivals'; tags='new-arrival'; style='Minimal'; season='Fall'; gender='Unisex'},
    @{id=3; brand='Seoul Vibe'; brandId='seoul-vibe'; collectionId='best-sellers'; tags='daily-essentials'; style='Casual'; season='Spring'; gender='Women'},
    @{id=4; brand='Seoul Vibe'; brandId='seoul-vibe'; collectionId='new-arrivals'; tags='best-seller'; style='Sporty'; season='Fall'; gender='Men'},
    @{id=5; brand='Everyday Core'; brandId='everyday-core'; collectionId='new-arrivals'; tags='daily-essentials'; style='Relaxed'; season='Winter'; gender='Unisex'},
    @{id=6; brand='Korea Fashion'; brandId='kf'; collectionId='summer-essentials'; tags='new-arrival'; style='Romantic'; season='Spring'; gender='Women'},
    @{id=7; brand='Korea Fashion'; brandId='kf'; collectionId='summer-essentials'; tags='daily-essentials'; style='Casual'; season='Summer'; gender='Women'},
    @{id=8; brand='Minimal Life'; brandId='minimal-life'; collectionId='best-sellers'; tags='limited-edition'; style='Evening'; season='Fall'; gender='Women'},
    @{id=9; brand='Korea Fashion'; brandId='kf'; collectionId='new-arrivals'; tags='new-arrival'; style='Elegant'; season='Summer'; gender='Women'},
    @{id=10; brand='Korea Fashion'; brandId='kf'; collectionId='new-arrivals'; tags='daily-essentials'; style='Minimal'; season='Spring'; gender='Women'}
)
foreach ($u in $updates) {
    $url = "http://103.173.66.91:3398/api/products/$($u.id)"
    try {
        $existing = Invoke-RestMethod -Method Get -Uri $url -Headers $headers -UseBasicParsing
        $body = @{
            name = $existing.data.name
            description = $existing.data.description
            shortDescription = $existing.data.shortDescription
            imageUrl = $existing.data.imageUrl
            price = [decimal]$existing.data.price
            brand = $u.brand
            brandId = $u.brandId
            origin = $existing.data.origin
            categoryId = [long]$existing.data.categoryId
            collectionId = $u.collectionId
            sku = $existing.data.sku
            slug = $existing.data.slug
            material = $existing.data.material
            fabricComposition = $existing.data.fabricComposition
            careInstructions = $existing.data.careInstructions
            fit = $existing.data.fit
            style = $u.style
            occasion = $existing.data.occasion
            length = $existing.data.length
            neckline = $existing.data.neckline
            sleeveLength = $existing.data.sleeveLength
            pattern = $existing.data.pattern
            gender = $u.gender
            season = $u.season
            status = $existing.data.status
            stockQuantity = $existing.data.stockQuantity
            featured = $existing.data.featured
            newArrival = $existing.data.newArrival
            bestSeller = $existing.data.bestSeller
            sale = $existing.data.sale
            viewCount = $existing.data.viewCount
            soldCount = $existing.data.soldCount
            compareAtPrice = $existing.data.compareAtPrice
            costPrice = $existing.data.costPrice
            ratingAverage = $existing.data.ratingAverage
            reviewCount = $existing.data.reviewCount
            weight = $existing.data.weight
            packageWidth = $existing.data.packageWidth
            packageHeight = $existing.data.packageHeight
            packageLength = $existing.data.packageLength
            publishedAt = $existing.data.publishedAt
            tags = $u.tags
            seoTitle = $existing.data.seoTitle
            seoDescription = $existing.data.seoDescription
            seoKeywords = $existing.data.seoKeywords
            seoThumbnailUrl = $existing.data.seoThumbnailUrl
            canonicalUrl = $existing.data.canonicalUrl
            schemaType = $existing.data.schemaType
            robots = $existing.data.robots
        }
        Invoke-RestMethod -Method Put -Uri $url -Headers $headers -Body ($body | ConvertTo-Json -Depth 10) -UseBasicParsing | Out-Null
        Write-Host "Updated product $($u.id) brand/collection/tags"
    } catch {
        Write-Host "WARN update product $($u.id): $($_.Exception.Message)"
    }
}

Write-Host 'Done seeding additional data.'