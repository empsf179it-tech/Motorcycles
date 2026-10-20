Add-Type -AssemblyName System.Drawing
$results = @()
for ($i = 1; $i -le 103; $i++) {
    $p = "images/image-$i.png"
    if (Test-Path $p) {
        $img = [System.Drawing.Image]::FromFile((Resolve-Path $p))
        $results += [PSCustomObject]@{
            Id = $i
            File = "image-$i.png"
            Width = $img.Width
            Height = $img.Height
            Ratio = [Math]::Round($img.Width / $img.Height, 2)
        }
        $img.Dispose()
    }
}
$results | Export-Csv -Path "image_info.csv" -NoTypeInformation
$results | Format-Table -AutoSize
