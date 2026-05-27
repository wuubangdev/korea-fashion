import requests
url = 'http://103.173.66.91:3398/api/categories'
token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwicm9sZXMiOlsiUk9MRV9TSElQUEVSIiwiUk9MRV9BRE1JTiIsIlJPTEVfQ1VTVE9NRVIiLCJST0xFX1NUQUZGIl0sImlhdCI6MTc3OTg3MjA2MSwiZXhwIjoxNzc5OTU4NDYxfQ._IGuK0NNWQM4H1VlU3-yy-l_3hOKkAelTNKUZbi5_zs'
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
cats = [
    {'code': 'hoodies', 'name': 'Hoodie', 'description': 'Korean-style hoodie', 'slug': 'hoodie', 'imageUrl': 'https://images.unsplash.com/photo-1521334884684-d80222895322', 'displayOrder': 1, 'active': True},
    {'code': 'dresses', 'name': 'Dress', 'description': 'Comfortable Korean dresses', 'slug': 'dress', 'imageUrl': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', 'displayOrder': 2, 'active': True},
    {'code': 'shirts', 'name': 'Shirt', 'description': 'Smart shirts and blouses', 'slug': 'shirt', 'imageUrl': 'https://images.unsplash.com/photo-1523381218027-3117c9c0f1c8', 'displayOrder': 3, 'active': True},
    {'code': 'pants', 'name': 'Pants', 'description': 'Stylish pants and shorts', 'slug': 'pants', 'imageUrl': 'https://images.unsplash.com/photo-1520975911226-8d0bc43a4d16', 'displayOrder': 4, 'active': True},
]
for cat in cats:
    r = requests.post(url, headers=headers, json=cat, timeout=20)
    print(r.status_code, r.text)
