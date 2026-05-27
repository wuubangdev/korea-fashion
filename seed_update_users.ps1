# Seed/Update existing users with fuller information using superadmin token
param()

$token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwicm9sZXMiOlsiUk9MRV9TSElQUEVSIiwiUk9MRV9BRE1JTiIsIlJPTEVfQ1VTVE9NRVIiLCJST0xFX1NUQUZGIl0sImlhdCI6MTc3OTg3MjA2MSwiZXhwIjoxNzc5OTU4NDYxfQ._IGuK0NNWQM4H1VlU3-yy-l_3hOKkAelTNKUZbi5_zs'
$headers = @{ Authorization = 'Bearer ' + $token; 'Content-Type' = 'application/json' }
$base = 'http://103.173.66.91:3398'

Write-Host "Fetching users..."
try {
    $resp = Invoke-RestMethod -Uri "$base/api/users?page=0&size=200" -Headers $headers -UseBasicParsing
} catch {
    Write-Host "Failed to fetch users:" $_.Exception.Message
    exit 1
}

$users = $null
if ($resp -is [System.Collections.IDictionary]) {
    if ($resp.ContainsKey('data') -and $resp.data -is [System.Collections.IDictionary] -and $resp.data.ContainsKey('content')) {
        $users = $resp.data.content
    } elseif ($resp.ContainsKey('content')) {
        $users = $resp.content
    } else {
        $users = $resp
    }
} else {
    $users = $resp
}

if (-not $users) { Write-Host "No users found."; exit 0 }

foreach ($u in $users) {
    $id = $u.id
    $username = if ($u.username) { $u.username } else { "user$id" }
    $email = if ($u.email) { $u.email } else { "$($username.ToLower())@example.com" }
    $password = 'Password123!'

    # preserve existing roles if present; otherwise default to ROLE_CUSTOMER
    if ($null -ne $u.roles -and $u.roles.Count -gt 0) {
        $roles = $u.roles
    } else {
        $roles = @('ROLE_CUSTOMER')
    }

    # Skip superadmin username to avoid locking ourselves out
    if ($username -match 'superadmin') {
        Write-Host "Skipping superadmin user: $username (id=$id)"
        continue
    }

    $body = @{ username = $username; password = $password; email = $email; roles = $roles } | ConvertTo-Json -Depth 5
    try {
        Invoke-RestMethod -Method Put -Uri "$base/api/users/$id" -Headers $headers -Body $body -UseBasicParsing
        Write-Host "Updated user $username (id=$id)"
    } catch {
        if ($_.Exception.Response) {
            $s = $_.Exception.Response.GetResponseStream(); $r = New-Object System.IO.StreamReader($s); $text = $r.ReadToEnd()
            Write-Host "ERROR updating user $username (id=$id): $text"
        } else {
            Write-Host "ERROR updating user $username (id=$id): $_.Exception.Message"
        }
    }
}

Write-Host "Done updating users."
