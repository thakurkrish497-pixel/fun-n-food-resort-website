$dest = "c:\Users\Saket\Desktop\fun n food website\assets\images\facilities"
New-Item -ItemType Directory -Force -Path $dest

Copy-Item "c:\Users\Saket\Downloads\fun and food phtos 2\IMG_3213.JPG.jpeg" -Destination "$dest\water_pool.jpg"
Copy-Item "c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3767.JPG" -Destination "$dest\parking.jpg"
Copy-Item "c:\Users\Saket\Downloads\fun and food phtos 2\IMG_2261.JPG.jpeg" -Destination "$dest\deluxe_rooms.jpg"
Copy-Item "c:\Users\Saket\Downloads\fun and food phtos 2\IMG_3467.JPG.jpeg" -Destination "$dest\private_room_pool.jpg"
Copy-Item "c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3781.JPG" -Destination "$dest\in_room_dining.jpg"
Copy-Item "c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3740.JPG" -Destination "$dest\kids_play_area.jpg"
Copy-Item "c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3812.JPG" -Destination "$dest\sports.jpg"
Copy-Item "c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3819.JPG" -Destination "$dest\wedding.jpg"
Copy-Item "c:\Users\Saket\Downloads\drive-download-20260701T103318Z-3-001\0A9A3807.JPG" -Destination "$dest\private_parties.jpg"

Write-Host "Images copied successfully!"
